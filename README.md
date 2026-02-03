# Bharat Gupta — Portfolio

A dark, cinematic portfolio built with **Next.js (App Router)**, **React**, **Three.js**, **GSAP**, and **Lenis**. It includes a 3D starfield background, interactive hero photo, smooth scrolling, sound design, and a contact form with optional email delivery.

---

## What’s in the project

### Frontend

| Area | What’s used | Purpose |
|------|-------------|--------|
| **Framework** | Next.js 14 (App Router) | Routing, SSR, API routes |
| **UI** | React 18 | Components and state |
| **Styling** | Global CSS (`app/globals.css`) | Layout, typography, dark theme, glass panels |
| **3D / canvas** | Three.js, @react-three/fiber, @react-three/drei | Starfield background, astronaut & asteroid, hero 3D portrait (if enabled) |
| **Motion** | GSAP + ScrollTrigger | Hero text reveal, skill cards, opening page animation |
| **Scroll** | Lenis | Smooth scrolling; `ScrollTrigger.update()` synced in RAF |
| **Sound** | Howler.js | Ambient BGM, click/hover SFX; user-gesture compliant |
| **Cursor** | Custom component + CSS | Neon dot + ring; hidden default cursor on desktop |

**Main sections**

- **Hero** – Intro, tagline, avatar, and photo panel (image shifted slightly down via `object-position` + `translateY`).
- **About** – Short bio and focus.
- **Skills** – 3D-style cards (GSAP tilt on hover, scroll-in animation).
- **Projects** – Project cards with hover states.
- **Contact** – Form (name, email, message) with client-side validation.
- **Footer** – “Created with creativity and love by Bharat Gupta”.

**Key files**

- `app/layout.tsx` – Root layout: providers, Nav, BackgroundStars, OpeningAnimation, Footer.
- `app/page.tsx` – Home page: Hero, About, Skills, Projects, Contact.
- `app/globals.css` – All global and section styles.
- `ui/` – Nav, footer, custom cursor, opening animation, background (stars + astronaut + asteroid), sections (hero, about, skills, projects, contact), sound toggle, providers (smooth scroll, sound).

### Backend

| Area | What’s used | Purpose |
|------|-------------|--------|
| **API** | Next.js Route Handlers | Single endpoint: `POST /api/contact` |
| **Validation** | Zod | Request body: `name`, `email`, `message` |
| **Rate limiting** | In-memory (per IP) | 5 requests per minute per IP |
| **Email** | Nodemailer | Sends mail only when env vars are set |

**Contact API (`app/api/contact/route.ts`)**

- Accepts `POST` with JSON: `{ name, email, message }`.
- Validates with Zod (name 1–100 chars, valid email, message 10–2000 chars).
- Returns 400 on invalid body, 429 if rate limited.
- If `CONTACT_EMAIL_*` and `SMTP_*` env vars are set, sends an email via Nodemailer; otherwise returns 200 without sending (so the form still “succeeds” in dev).
- Returns JSON only (no HTML), so the frontend never hits “&lt;!DOCTYPE” JSON parse errors.

---

## What you need to run and deploy

### 1. Node and install

- Node 18+.
- `npm install` in the project root.

### 2. Public assets

Place these in `public/` (paths used by the app):

- `public/photo.png` – Hero avatar and/or hero panel image (as used in the hero section).
- `public/audio/ambience.mp3` – Background music.
- `public/audio/click.mp3` – Click sound.
- `public/audio/hover.mp3` – Hover sound.

### 3. Environment variables (optional)

Copy `.env.example` to `.env.local` and fill only if you want contact emails sent:

- `CONTACT_EMAIL_TO` – Where to receive messages.
- `CONTACT_EMAIL_FROM` – Sender address/name.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` – SMTP credentials (e.g. Gmail, SendGrid, Resend SMTP).

If these are not set, the contact form still returns success; it just won’t send mail.

---

## Commands

```bash
npm run dev   # Dev server (e.g. http://localhost:3000)
npm run build # Production build
npm run start # Run production build
npm run lint  # ESLint
```

---

## Deploy (e.g. Vercel)

1. Push the repo to GitHub (or connect your Git provider to Vercel).
2. In Vercel: **New Project** → import this repo → framework preset **Next.js**.
3. **Environment variables**: in the Vercel project, add the same variables as in `.env.example` (only the ones you need for email). Do not commit `.env.local`.
4. **Build**: Vercel runs `npm run build` by default. No extra build command needed.
5. **Output**: Next.js is detected; no custom output directory.

**Notes**

- The contact API runs as a serverless function; in-memory rate limit is per instance, not global (fine for a portfolio).
- For production email, use a real SMTP provider (SendGrid, Resend, etc.) and set the env vars in Vercel.

---

## Hero photo “shifted down”

The hero section photo is intentionally shifted slightly downward:

- In **CSS** (`app/globals.css`):
  - `object-position: center 55%` – shows a bit more of the lower part of the image.
  - `transform: scale(1.02) translateY(6px)` – moves the image down by 6px so it doesn’t feel too high in the panel.

So the “inner photo” is nudged down both by how the image is positioned inside the frame and by a small vertical translation.

---

## Summary

- **Frontend**: Next.js + React, global CSS, Three.js (stars, astronaut, asteroid, optional 3D hero), GSAP (animations, opening), Lenis (smooth scroll), Howler (BGM + SFX), custom cursor.
- **Backend**: One API route for contact with Zod, rate limiting, and optional Nodemailer email.
- **Deploy**: `npm run build` and set env vars on your host (e.g. Vercel). Add `photo.png` and audio files under `public/` so the site is fully deploy-ready.
