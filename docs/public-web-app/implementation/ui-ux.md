# Public Web App — UI / UX (Referral + Review)

This is the UI/UX companion doc for `docs/public-web-app/01-features.md`. It focuses on **page-level UX**, **information architecture**, and **key interaction details** for the public-facing web surfaces.

---

## IA (Information Architecture)

### Referral (Referrer flow)
- `/r/:token` — Entry + token validation
- `/r/:token/input` — Referrer input (type/voice)
- `/r/:token/variants` — Variant chooser (3 options)
- `/r/:token/revise` — One-sentence context (optional)
- `/r/:token/preview` — Final message preview + Send handoff
- `/r/:token/done` — Receipt/confirmation copy (best-effort)

### Review feedback / gating
- `/f/:token` — NPS score screen
- `/f/:token/positive` — Positive feedback + Copy + Google link
- `/f/:token/negative` — Private feedback capture + thank you
- `/f/:token/done` — Receipt/confirmation

Notes:
- Routes are suggestive; final structure can be simplified (e.g., wizard-style single route with steps).
- Both flows should be designed to support **mobile-first** usage.

---

## Global UI principles
- **Fast path first**: don’t force editing; always offer a “good enough” default action.
- **Trust + clarity**: explain who requested this, what happens next, and what data is saved.
- **Best-effort handoffs**: deep-linking to SMS/Google is a handoff; treat completion states accordingly.

---

## Referral flow — key screens and UX notes

### 1) Entry + validation
- Show a minimal loading state while verifying token.
- Failure states:
  - **Expired / already used**: plain explanation + CTA to close.
  - **Invalid**: generic error + CTA to close.

### 2) Input screen
- Prompt should reduce pressure: “Say it however you want; we’ll clean it up.”
- Input affordances:
  - Primary: multiline text box
  - Optional: voice dictation (Web Speech API) if available, with fallback
- Primary CTA: **Generate message**

### 3) Variants screen
- Show three stacked cards: **Casual / Professional / Warm**
- Each card: message preview (3–5 lines) + “Use this” CTA
- Secondary action: **Make this sound more like me**
  - When tapped, carry the chosen base variant forward

### 4) One-sentence revise
- Single sentence input (with helper text and a character cap)
- CTA: **Update message**
- Copy should set expectations: “We’ll keep the structure and length the same.”

### 5) Preview & Send
- Show final message in a copyable/selectable container.
- Primary CTA: **Send as group text**
  - Deep-link to native SMS composer (prefill recipients + body).
- Secondary CTAs:
  - **Copy message**
  - **Back** to variants

### 6) Receipt (“done”)
- Acknowledge the handoff: “Your messaging app is opened with the draft ready.”
- Provide fallback: **Copy again** + troubleshooting tip if the deep-link fails.

---

## Review feedback / gating — key screens and UX notes

### 1) NPS score screen
- Question: “How likely are you to recommend [business]…?”
- UI: 0–10 scale with clear labels.
- After selecting score, proceed immediately (or via Continue).

### 2) Positive outcome
- Goal: reduce friction while respecting platform limits (Google text cannot be pre-filled reliably).
- UI sections:
  - Short prompt to write 1–2 sentences of feedback (or allow skipping if policy allows).
  - Primary CTA: **Copy**
  - Clear instruction copy: “Paste this into Google, then tap the link below.”
  - Google review link button (opens browser).
- Optional enhancement: “Copy + open Google” combined action (later).

### 3) Negative outcome
- Reassuring copy: “Thanks — this goes only to the business.”
- Simple textarea + submit.
- No Google redirect.

### 4) Receipt (“done”)
- Thank-you message + optional “You can close this page.”

---

## Shared states + components

### Loading
- Token verification
- AI generation / revision (spinner + “this usually takes ~10s” style microcopy)

### Error states
- Network error: retry CTA
- Rate-limited: “Try again in a few minutes”
- Server error: retry + fallback to copy raw input (referral) or submit later (feedback)

### Brand/system elements
- Lightweight header: business name + “Powered by Rave” (or configurable)
- Legal/footer links if needed (privacy / terms)

