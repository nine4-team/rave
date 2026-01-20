# Mobile UI Screen Audit (apps/mobile)

## Scope
- **Source of truth:** `apps/mobile` only (React Native).
- **Goal:** inventory existing mobile screens and compare against `docs/01-features.md`.
- **Output:** identify navigation gaps and list them in **Not yet implemented**.

## Existing Screens (Mobile App)
Derived from `apps/mobile/App.tsx` and `apps/mobile/src/screens`.

### Top-level tabs
- **Scorecard**: scorecard overview metrics.
- **Reviews**: request list filtered by review stages.
- **Referrals**: request list filtered by referral stages.
- **Settings**: settings form (appearance + business context + cadence controls).

### Screens / Views
- **Request list**: list of requests by stage with empty state.
- **Request detail**: timeline or message sequence + referral data (based on request type).

### UI Sections (within screens)
- **Stage tabs + stage description** on Reviews/Referrals.
- **New request CTA bar** on Reviews/Referrals.
- **Scorecard cards** for Reviews and Referrals metrics.
- **Settings sections**: appearance, business description, tone examples, Google URL, emoji threshold, cadence controls.

## Feature Coverage Check (Mobile UI)
Mapping to `docs/01-features.md`.

### Implemented (UI exists in mobile)
- **Scorecard dashboard** (metrics cards and time-agnostic totals).
- **Review/Referral request lists** with stage filters and empty states.
- **Request detail** view with review timeline or referral data/message sequence.
- **Settings UI** for tone, business description, Google URL, emoji threshold, cadence controls, theme preference.

### Partial (UI exists but missing flow coverage)
- **New request CTA** appears, but no creation flow or navigation beyond the CTA.
- **Scorecard time filter** is specified in features but not present in the mobile UI.

## Not Yet Implemented (UI / Navigation Gaps)
These are feature-driven screens or flows described in `docs/01-features.md` that do not exist in `apps/mobile`.

### Core request creation + messaging
- **Contact sync / import** screen and permissions flow.
- **Contact selection** list and multi-select UI.
- **Review/Referral request creation** flow (context entry, voice dictation, generate draft).
- **Send** action wiring from the request detail (open native SMS/email composer).
- **Revise** action wiring from the request detail (inline or modal revise box with AI spinner).

### Feedback + outcome tracking
- **Emoji feedback form** screens (rating + positive/negative outcome screens).
- **Action-required** prioritization UI (badge + dismiss) if still desired.

### Referrer experience (mobile entry points)
- **Create referral link** flow and share UI from the owner app.
- **Deep-link handoff** UX to the referrer web flow (UI confirmation/receipt).

### Settings persistence + system flows
- **Save confirmation and persistence** indicators for settings fields.
- **Theme preference persistence** feedback beyond in-memory selection.

## Navigation Gaps Summary
Mobile navigation currently exposes **Scorecard**, **Reviews**, **Referrals**, and **Settings** only. There are no routes or entry points for:
- Contact sync/selection
- Request creation
- Feedback form
- Referral-link creation and handoff

## Data Model Notes (Non-UI)
- Feedback capture for the Alex Rivera example appears in request detail mock data, but no persistent data structures exist yet. UI is in place; storage and schema work remain.

## Next Design Steps
- Define mobile navigation for the missing flows (stack + modal map).
- Add the missing screens to the **Not yet implemented** backlog with owners.
