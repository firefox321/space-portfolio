import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message is too short").max(2000)
});

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

type HitRecord = { timestamps: number[] };

const rateLimitStore = new Map<string, HitRecord>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip) ?? { timestamps: [] };

  record.timestamps = record.timestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );

  if (record.timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitStore.set(ip, record);
    return true;
  }

  record.timestamps.push(now);
  rateLimitStore.set(ip, record);
  return false;
}

async function sendEmail(data: z.infer<typeof bodySchema>) {
  const {
    CONTACT_EMAIL_TO,
    CONTACT_EMAIL_FROM,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS
  } = process.env;

  if (
    !CONTACT_EMAIL_TO ||
    !CONTACT_EMAIL_FROM ||
    !SMTP_HOST ||
    !SMTP_PORT ||
    !SMTP_USER ||
    !SMTP_PASS
  ) {
    // Email not configured; silently succeed in dev.
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  await transporter.sendMail({
    to: CONTACT_EMAIL_TO,
    from: CONTACT_EMAIL_FROM,
    subject: `New portfolio contact from ${data.name}`,
    replyTo: data.email,
    text: `From: ${data.name} <${data.email}>\n\n${data.message}`
  });
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  try {
    await sendEmail(parsed.data);
    return NextResponse.json(
      {
        ok: true,
        message:
          "Message received. If email delivery is configured, it has been forwarded."
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact email error", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

