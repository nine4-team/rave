# Rave Features (Working Notes)

## Product Summary
- Mobile-first convenience app for small business owners to generate Google reviews and referrals.
- Core flow: sync contacts → select contact → tap Review or Referral → generate the next message → user sends from native SMS/email app (not sent inside Rave).
- **Hybrid architecture**: React-Native owner app + lightweight public web surface for **referrers** (no install, no account, single-use links).
- **Firebase backend**: Auth + Firestore + Cloud Functions for AI and link workflows.

## Primary User Actions (Owner App)
- Sync contacts and select one or more contacts.
- Generate a **Review Request** message.
- Generate a **Referral Request** message.
- Add optional context by **voice dictation** (Swift dictation widget for React Native) or typing.
- Review and send a drafted message outside the app.

## Scorecard Dashboard (Owner App)
- **Top-level tab** on the main nav, separate from Reviews/Referrals lists.
- Shows three KPI cards: **Reviews**, **Referrals**, and **NPS**.
- Scorecard is **summary-only**; request-level actions and drafts live in the request detail view.
- **Reviews card** includes:
  - **Requests** (sent requests only; excludes status = "new")
  - **Reviews** (reviewed + replied)
  - **Conversion** (completed / requests)
- **Referrals card** includes:
  - **Requests** (sent requests only; excludes status = "new")
  - **Intros** (introduced + thanked)
  - **Conversion** (completed / requests)
- **NPS card** includes:
  - **Total Responses** (count of NPS scores submitted)
  - **NPS Score** (% Promoters - % Detractors, range -100 to +100)
  - **Average Score** (mean of all NPS scores, 0–10)
  - Breakdown: **Promoters** (9–10), **Passives** (7–8), **Detractors** (0–6)
- **Time filter** controls the time window for all scorecard metrics:
  - Default: **Last 30 days**
  - Presets: **Last 7 / 30 / 90 days**, plus **All time**
  - Optional: **Custom range** (start + end date)
- Scorecard metrics exclude **archived** requests.

## Next Actions + Action Required
- **Action required** is owner-only and means **action is needed now**.
- Next actions are:
  - **Send message** (initial request or follow-up)
  - **Reply on Google** (after positive feedback)
  - **Create referral request** (final review stage after reply)
- When a request is created, the default next action is the **initial “Send message” draft** and it remains the next action until the owner **sends** it or **dismisses/deletes** it.
- Request detail shows a **Next** card with the next draft message and actions:
  - **Send**, **Revise**, **Delete** (message-only actions)
- Requests with action required bubble to the top and show an **Action Needed** badge.
- Users can **dismiss/delete** a next action; this clears the badge.

## Message Generation
- Lightweight LLM call generates message drafts.
- Settings allow example outreach messages to align with user tone; these are injected into the prompt when present.
- Settings store Google My Business review URL; included in prompt and/or appended to messages.

## Gen AI Surface Areas
- **Owner initial drafts**: review/referral message from contact + business context.
- **Owner revisions**: polish edits while preserving intent and length.
- **Referrer web flow**: generate tone variants + one-sentence surgical revision.
- **Google review replies**: owner-facing reply suggestions to published reviews.

## History
- History shows **sent messages** with timestamps and message body.
-probably messages should have at least 'draft' and 'sent' statuses.
- Review requests include feedback history:
  - **NPS score** (0–10) and optional feedback text.
  - **Google review posted** event when confirmed.
- Referral requests include referral history:
  - **Referrer input** (raw text).
  - **Intro sent** (final message).
  - **Intro marked successful** (optional user note).

## Cadences and Follow-Ups
- Built-in follow-up sequences stored in Settings.
- **Sequences are templates**, composed of draft templates for each step in the pipeline.
- A **draft** is an **unsent message** created from a draft template and attached to a request.
- **Revise** updates only the request’s draft (templates are unchanged).
- When sent, a draft becomes a **sent message** and appears in **History**.
- **Cadence start + advancement rules**
  - When a new request is created, the contact sits on the **current next action**, which is the **initial request message** (the first “Send message” draft). The request stays on that next action until the owner takes it (sends or deletes/dismisses it).
  - The cadence “clock” **does not start** just because a request exists. Cadence is only relevant when **follow-up is required**.
  - If the owner **has not sent** the current next-action draft, the system should **not auto-advance** or replace it with the next message when the cadence interval elapses. The next action remains the same draft until acted on.
  - Once the owner **sends** the current message, the cadence interval begins (e.g., set/compute `lastMessageSentAt` → `nextScheduledAt`). When the interval elapses, the **next follow-up draft** may be generated/queued as the next action.
- **Stage 1 goal**: drive contact to complete the NPS feedback form.
- **Stage 2 goal**: if NPS score ≥ threshold and no review detected, nudge to paste their own (already-copied) text into Google.
- User-controllable cadence settings **per message** (intervals between steps; not one global interval).
- Drafts can be scheduled or queued for follow-up reminders.
- **Smart reuse**: once feedback is captured, later messages auto-insert the user's own positive text + Google link to reduce friction.

## Review vs Referral Objects
- Open decision: separate **ReviewRequest** and **ReferralRequest** objects, or a unified **Request** with type = review/referral.
- Potential interaction between review and referral flows depending on outcomes.

## Outcome Tracking
- **Referrals:** user marks a referral as successful in the UI.
- **Reviews (initial):** user marks review as completed.
- **Reviews (future):** integrate with Google Business Profile to fetch incoming reviews and map them to requests.
- Potential heuristic: infer reviewer identity by matching review timestamps to sent requests.

## Gating Mechanism for Reviews
- Instead of sending the Google review URL directly, send a link to an in-app or hosted **NPS feedback form**.
- **Two-screen feedback flow**:
  1. **NPS score screen**: 0–10 scale asking "How likely are you to recommend [business] to a friend or colleague?" Default threshold = 9 (Promoters: 9–10). User can change threshold in settings.
  2. **Positive outcome screen** (≥ threshold): prominent **Copy** button that copies the user's own feedback text to clipboard plus short instructions: "Paste this into Google and tap the link below to leave your review."
  3. **Negative outcome screen** (< threshold): private feedback capture only; no Google redirect.
- **Copy-then-navigate UX**: we can auto-copy the text and immediately open the Google review URL in the browser, but we still show explicit instructions so users understand they must paste. (Safest: copy + instructions + link; optional auto-open.)
- **Cadence integration**: the first follow-up sequence's only goal is to get the contact to complete the NPS form. Once that screen is submitted, the sequence advances. If the outcome was positive and no Google review has been detected, subsequent messages include the user's own feedback text (retrieved from the submitted form) plus the Google review link, making copy-paste effortless.

## Referral Flow (Web Surface for Referrers)
- Owner taps "Request Intro" in RN app → system creates secure, single-use referral link (expires in 7 days) and sends it to referrer via SMS/email.
- Referrer opens link → lightweight **micro-web-app** (no install, no account):
  1. **Prompt screen**: "Jamie asked if you'd be open to making a quick intro. Say it however you want — we'll help clean it up."
  2. **Input options**: voice (Web Speech API) or type.
  3. **LLM polish**: turns raw referrer input into concise, send-ready group message while preserving their voice.
  4. **Choose-or-tweak model** (no blank-page editing):
     - **Default view**: three send-ready variants (Casual / Professional / Warm). Tapping any variant skips editing and goes straight to Preview & Send.
     - **Revision option**: button labeled **"Make this sound more like me"**. Tapping it asks for **one sentence of context** (voice or type). LLM surgically injects that context—structure unchanged, length unchanged—then returns the updated message.
  5. **Preview & Send**: show final message; **"Send as group text"** button deep-links into native SMS with recipients + message pre-filled (referrer taps Send). Alternative: server-side send after explicit consent (V2).
- **Message reuse**: if referrer allows, capture their polished text for future owner prompts (opt-in).

## Owner Settings (Review & Referral Context)
- **Business Description** – free-text field (1–2 sentences, plain language). Used in every LLM prompt so generated messages always explain what the business does without extra typing. Example: "I run a mobile dog-grooming service in North Austin."
- **Tone Examples** – optional sample sentences the owner might actually say; injected into prompts to keep generated messages aligned with their voice.
- **Google Business Profile URL** – stored for automatic inclusion in review requests.
- **NPS threshold** – which NPS score (0–10) counts as "positive"; default = 9 (Promoters: 9–10).
- **Cadence controls** – per-message intervals between follow-ups, max attempts, etc.

## Can We Auto-Fill Google Review Text?
- Likely **not possible** to automatically drop text into Google's review text input due to:
  - Cross-origin restrictions and security controls.
  - No supported prefill parameters for the review text in the Google review URL.
- Best viable approach: show the drafted review text to the user and provide **copy to clipboard** before redirecting to Google.

## Future Expansion Ideas
- In-app list of incoming Google reviews.
- AI-assisted responses to reviews.
- Deeper analytics on review/referral performance.

## Open Questions / Decisions
- Drafts: single draft vs cadence sequence objects.
- Data model: separate Review/Referral objects vs unified Request type.
- How to model outcomes and attribution for reviews/referrals.
- UX for marking referral success.
- Whether gating form lives inside app or as a simple hosted web page.
- **NPS threshold default**: 9 (Promoters)—keep or allow user to set lower?
- **Auto-open browser after copy**: yes/no toggle in settings?
- **Copy instructions**: short inline text vs richer graphic card?
- **Revise container**: inline expando vs modal vs new screen?
- **Spinner style**: skeleton line vs pulsing dot vs full overlay?
- **Referrer web app**:
  - Deep-link vs server-side send for V1?
  - Opt-in to store polished text for reuse?
  - Maximum recording length / text length?
  - Branding: owner logo + color or generic Rave styling?
- **Repeat referrals (easiest path)**:
  - **V1 (no portal)**: owner simply taps "Request Intro" again → new single-use link sent to same referrer. Referrer repeats the same 3-step flow (speak/type → preview → send). No extra UI, no referrer memory.
  - **V2 (mini-portal)**: if referrer has opted into their persistent portal, owner can choose to send the request **through the portal** instead of a one-off link. Portal surfaces the new request at the top with a one-tap "Reuse last message" button (pre-fills their previous polished text as a starting point). Still three taps max: adjust → preview → send.

## Example Referrer Message Variants
**Casual**  
"Hey Alex — looping you in with Jamie. I worked with Jamie recently and thought you two should connect. Jamie helps small businesses get more Google reviews and referrals. No pressure at all, just figured I'd intro you both."

**Professional**  
"Hi Alex — I wanted to introduce you to Jamie. Jamie runs Rave, which helps small businesses generate more reviews and referrals. I've had a great experience and thought it might be helpful to connect you two."

**Warm / Friendly**  
"Hey Alex! This is Jamie — I've been working with them and had a great experience. Thought you two might be a good fit so I wanted to make an intro. I'll let you take it from here 😊"

## Surgical Revision Example
Referrer taps **"Make this sound more like me"** and adds:  
"Alex owns a gym and has been trying to grow memberships."

Revised message (Casual base):
"Hey Alex — looping you in with Jamie. Alex owns a gym and has been trying to grow memberships, so I thought you two should connect. Jamie helps small businesses get more Google reviews and referrals. No pressure at all, just figured I'd intro you both."

Structure, length, and tone stay identical—only the single context sentence is injected.
