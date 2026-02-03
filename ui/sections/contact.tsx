"use client";

import { FormEvent, useState } from "react";
import { useSound } from "../providers/sound-provider";

type FormState = {
  name: string;
  email: string;
  message: string;
};

type Status =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function ContactSection() {
  const { playClick, playHover } = useSound();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) {
      next.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email.";
    }
    if (!form.message.trim()) {
      next.message = "Tell me a little about what you need.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus({ type: "submitting" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setStatus({
        type: "success",
        message: "Message sent. I’ll get back to you shortly."
      });
      setForm({ name: "", email: "", message: "" });
      setErrors({});
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err?.message || "Could not send message. Please try again."
      });
    }
  };

  return (
    <section id="contact" className="section" aria-label="Contact">
      <div className="section-heading">
        <span className="section-kicker">Contact</span>
        <h2 className="section-title">Let&apos;s build something</h2>
      </div>
      <div className="contact-grid">
        <form
          className="contact-form glass-panel"
          onSubmit={(e) => {
            playClick();
            handleSubmit(e);
          }}
          noValidate
        >
          <div className="field">
            <label className="field-label" htmlFor="name">
              Name <span className="field-required">*</span>
            </label>
            <input
              id="name"
              className="field-input"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>
          <div className="field">
            <label className="field-label" htmlFor="email">
              Email <span className="field-required">*</span>
            </label>
            <input
              id="email"
              type="email"
              className="field-input"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div className="field">
            <label className="field-label" htmlFor="message">
              Project details <span className="field-required">*</span>
            </label>
            <textarea
              id="message"
              className="field-textarea"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            {errors.message && <p className="field-error">{errors.message}</p>}
          </div>
          <div className="form-footer">
            <button
              type="submit"
              className="btn"
              disabled={status.type === "submitting"}
              onMouseEnter={playHover}
            >
              {status.type === "submitting" ? "Sending..." : "Send message"}
            </button>
            <div className="form-status">
              {status.type === "success" && (
                <span className="form-status-success">{status.message}</span>
              )}
              {status.type === "error" && (
                <span className="form-status-error">{status.message}</span>
              )}
            </div>
          </div>
        </form>
        <aside className="contact-sidebar">
          <p>
            Looking for a collaboration, a new team member, or just a quick technical
            chat? Share a bit about your project, timeline and what you&apos;re aiming to
            build.
          </p>
          <p>
            I usually respond within 24–48 hours. If you prefer, you can also reach out
            directly at{" "}
            <span className="contact-pill">bharatg03246@gmail.com</span>
            .
          </p>
        </aside>
      </div>
    </section>
  );
}

