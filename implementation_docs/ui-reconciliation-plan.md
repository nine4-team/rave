# Prototype UI Reconciliation Plan

## Goal
Bring the main app UI into alignment with the prototype UI, which currently reflects the newest improvements. Where the main app already implements those improvements (potentially with better engineering practices), preserve those implementations and use them as the reference for matching the prototype.

## Scope
- Prototype: `prototype/src` (web)
- Main app: `apps/mobile/src` (React Native)
- Primary screens/components:
  - Request list and card
  - Request detail
  - Navigation and tabs
  - Settings and scorecard (prototype-only)

## Inventory (Current Surface Area)
### Prototype
- `prototype/src/App.tsx`
  - Top tabs: scorecard, reviews, referrals, settings
  - Stage sub-tabs for reviews/referrals
  - Scorecard overview
  - Bottom nav
  - Request detail modal
- `prototype/src/components/RequestCard.tsx`
  - Archive action, message preview, minimal status
- `prototype/src/components/RequestDetail.tsx`
  - Review timeline, message sequence, referral data sections
- `prototype/src/components/SettingsPanel.tsx`
  - Theme, business description, tone examples, Google URL, emoji threshold, cadence controls

### Main App (Mobile)
- `apps/mobile/src/components/RequestCard.tsx`
  - Status/type row, action-required badge, message preview
- `apps/mobile/src/screens/RequestDetailScreen.tsx`
  - Next action card, history timeline
- No settings/scorecard screens (currently)

## Drift Summary (Delta to Reconcile)
1) **Navigation/Information Architecture**
   - Prototype has tabs + bottom nav; mobile does not.
   - Decision needed: remove from prototype or add to mobile.

2) **Request Card Structure**
   - Mobile includes status/type row and “Action Needed” badge.
   - Prototype has archive button and omits status/type row.

3) **Request Detail Content**
   - Prototype uses review timeline + message sequence + referral data.
   - Mobile uses next-action card + history timeline.

4) **Settings + Scorecard**
   - Prototype contains full settings and scorecard; mobile has none.
   - Decide whether to keep and port or remove.

5) **Data Model Assumptions**
   - Mobile uses `contactSnapshot`, `actionRequired`, etc.
   - Prototype uses `contactName` and direct fields.

## Reconciliation Decisions (Proposed Defaults)
- Treat the prototype as the UI source-of-truth unless the main app already matches it with improved implementation quality.
- For any area where the main app already reflects the prototype UI, keep the main app behavior and adjust the prototype to match.
- If settings/scorecard are confirmed in scope, port them to mobile; otherwise keep them prototype-only until a product decision is made.

## Implementation Steps
### Phase 1: Baseline Alignment (High Priority)
1) **Request Card parity**
   - Make mobile match the prototype card layout and elements.
   - If mobile already reflects the prototype UI with better structure, keep mobile as reference and update prototype to match.
   - Decide whether the archive action is part of the intended UX; if removed, document rationale.

2) **Request Detail parity**
   - Make mobile match the prototype detail content order and sections.
   - If mobile already reflects the prototype UI with better structure, keep mobile as reference and update prototype to match.
   - Align status/type labels and date formatting across both.

3) **Data model normalization**
   - Align the prototype `Request` type to the shared model (if possible) and keep mobile as implementation reference.
   - Use `contactSnapshot` and `actionRequired` consistently in both.

### Phase 2: Navigation & IA Alignment
4) **Tabs and bottom nav**
   - If tabs and scorecard are approved, add equivalents to mobile.
   - If not approved, remove from prototype and align navigation to mobile.

### Phase 3: Settings & Scorecard Decision
5) **Feature parity decision**
   - If keep: create mobile screens and shared copy + tokens.
   - If remove: delete prototype settings/scorecard UI and related states.

### Phase 4: UI Tokens & Styling
6) **Token alignment**
   - Move shared colors/spacing into `packages/shared` or a UI package.
   - Ensure both apps consume the same palette and typography scale.

## Deliverables
- Updated main app UI aligned to prototype for request list/detail.
- Decision memo for settings/scorecard (keep/port/remove).
- Shared token usage checklist.

## Validation Checklist
- Request card layout, labels, and status match the prototype (unless main app already reflects it).
- Request detail matches the prototype content order and sections (unless main app already reflects it).
- Visual style aligns (spacing, typography, colors).
- No prototype-only UI remains in core flows unless explicitly approved.

## Notes / Open Decisions
- Should archive action be part of core flow?
- Are tabs/scorecard part of the main product roadmap?
- Should request history be represented as timeline or message sequence?
