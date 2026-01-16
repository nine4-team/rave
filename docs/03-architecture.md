# Architecture (Firebase + Gen AI)

This document captures the high-level system design for the Rave mobile app, the public referrer web surface, and the Firebase-backed AI services.

---

## Core Components

### 1. Owner App (React Native)
- Primary experience for owners to create review/referral requests.
- Uses Firebase Auth for sign-in and Firestore for data persistence.
- Triggers AI generation and revision via Cloud Functions.
- Launches native SMS/email composer (no in-app sending).

### 2. Referrer Web App (Vite + React)
- Public, single-use link experience for referrers (no account).
- Hosted on Firebase Hosting.
- Calls Cloud Functions for AI variant generation and surgical revisions.
- Deep-links to native SMS for final sending.

### 3. Firebase Backend
- **Auth**: Owner authentication; referrer flows are unauthenticated but link-scoped.
- **Firestore**: Stores `Request`, `MessageSequence`, `TextDraft`, `ReviewFeedback`, `ReferralData`, `Outcome`.
- **Cloud Functions**:
  - AI generation and revision orchestration.
  - Single-use referral link creation/verification.
  - Review reply suggestions.
  - Optional audit/logging and rate limiting.
- **Hosting**: Serves the referrer web app and any public feedback/emoji pages.

---

## Gen AI Workflows

### A. Owner Initial Draft (Review or Referral)
1. Owner taps **Generate** in RN app.
2. App calls `functions.generateInitialDraft(...)`.
3. Function composes prompt from business description, tone examples, request type, and contact context.
4. Response stored as `TextDraft` and returned to app for display.

### B. Owner Revision Flow
1. Owner edits or dictates text and taps **Revise**.
2. App calls `functions.reviseDraft(...)` with user edits and original draft.
3. Function returns polished version; stored in `TextDraft.revisions.aiRevisions` and replaces `TextDraft.content`.

### C. Referrer Web Flow (Public Link)
1. Owner requests intro → `functions.createReferralLink(...)` creates a single-use token.
2. Referrer opens link → app validates token via `functions.verifyReferralLink(...)`.
3. Referrer submits raw input → `functions.generateReferralVariants(...)` returns 3 tones.
4. Optional one-sentence context → `functions.surgicalRevision(...)` returns revised final message.

### D. Google Review Reply Suggestions
1. Owner selects a published review in-app.
2. App calls `functions.generateReviewReply(...)` with review text + business tone settings.
3. Reply suggestion saved for copy/paste or editing.

---

## Data Ownership and Access

- **Owners**: authenticated; read/write their own `Request` objects and related data.
- **Referrers**: unauthenticated; limited to a single referral flow scoped by one-time token.
- **Security rules**:
  - Owner data is partitioned by `ownerId`.
  - Public link access validated server-side in Cloud Functions.
  - Referrer writes restricted to a limited subset of `ReferralData`.

---

## Suggested Cloud Function Surface

- `generateInitialDraft(requestType, ownerContext, contactContext, toneExamples)`
- `reviseDraft(originalText, userEdits, ownerContext)`
- `createReferralLink(requestId, referrerId, expiresAt)`
- `verifyReferralLink(token)`
- `generateReferralVariants(rawInput, ownerContext)`
- `surgicalRevision(baseVariant, oneSentenceContext)`
- `generateReviewReply(reviewText, ownerContext, toneExamples)`

---

## Notes

- The current scaffolding (RN owner app + Vite referrer web) is compatible with Firebase Hosting and Cloud Functions.
- No Firebase-specific constraints conflict with the existing app structure; integration will mostly be configuration and API wiring.

