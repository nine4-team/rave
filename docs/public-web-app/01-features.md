# Public Web App — Features (Working Notes)

This document captures the **public-facing** web surfaces for Rave. It is derived from:
- `docs/mobile-app/implementation/mobile-ui-audit.md` (missing public flows noted there)
- `docs/mobile-app/01-features.md` + `docs/mobile-app/03-architecture.md` (source requirements + system context)

---

## Scope

### Included public web surfaces
- **Referral “referrer” flow**: a single-use link experience that helps a referrer generate a polished intro message for the business, then send via native SMS.
- **Review feedback / gating flow**: a lightweight, public feedback capture flow (NPS-style) that optionally routes happy customers to Google with “copy-then-navigate” UX.

### Non-goals (for this doc)
- Owner-only app surfaces (mobile “Scorecard / Reviews / Referrals / Settings” tabs).
- Deep backend schema details (see the mobile docs).

---

## Referral flow (Referrer web surface)

### Entry / access model
- Owner creates a **secure, single-use referral link** (tokenized; expires).
- Referrer opens link with **no account / no install**.
- Link validation happens server-side (token verification).

### Core flow (V1)
- **Prompt screen**: sets context (“You’ve been asked to make a quick intro; say it however you want; we’ll help clean it up.”)
- **Input**: type (and optionally voice via Web Speech API).
- **Generate**: return **three send-ready variants** (e.g. Casual / Professional / Warm).
- **Optional revise**: “Make this sound more like me” → ask for **one sentence of context** → run a surgical revision (structure/length stable).
- **Preview & Send**: display final message + deep-link to **native SMS** with recipients + message prefilled (referrer taps Send).

### Behavioral requirements
- Avoid blank-page editing; the referrer selects from variants and optionally requests a surgical tweak.
- Fast path should be 3 taps: **Generate → pick variant → Send**.
- Provide a clear “success/receipt” state after the send handoff.

---

## Review feedback / gating flow (Public feedback surface)

### Why this is a public web surface
We want customers/contacts to complete feedback without app install. The flow is link-based and can be hosted alongside the referrer flow.

### Core flow (V1)
- **NPS score screen**: \(0–10\) “How likely are you to recommend [business]…?”
- **Outcome split**:
  - **Positive (≥ threshold)**: capture short text feedback + prominent **Copy** CTA; then provide clear instructions and a link to the Google review URL.
  - **Negative (< threshold)**: capture private feedback only (no Google redirect).

### Behavioral requirements
- **Copy-then-navigate UX**: prioritize explicit copy and instructions; optional auto-open of Google after copy can be a later enhancement.
- **Threshold**: default threshold \(9\), but should be configurable by the owner in settings (owner-side control).
- **Cadence integration (future-facing)**: the goal of early follow-ups is completion of this form; later messages can reuse the customer’s own positive text + Google link.

---

## Shared requirements (Referral + Review public surfaces)

### UX + compliance
- Must feel trustworthy: clear branding, “why you’re here,” and minimal friction.
- Accessibility: keyboard + screen-reader reasonable defaults; high-contrast and large tap targets.
- Privacy: clearly communicate what’s stored (especially for negative feedback).

### Platform + integration
- Hosted as a static web app (Firebase Hosting) backed by Cloud Functions for:
  - single-use token verify
  - AI generation + surgical revision
  - feedback submission
  - rate limiting / abuse prevention

---

## Open questions (to resolve in design)
- Should the review gating page be a **separate path** inside the same web app, or a distinct app served from the same hosting project?
- Do we show a “thank you” receipt after the **SMS deep-link**, given we can’t confirm a send actually happened?
- Should referrers be allowed to opt-in to store their polished text for future reuse (V2)?

