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
  - Settings and scorecard (prototype -> mobile)

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
  - Archive action, message preview (prototype-aligned)
- `apps/mobile/src/screens/RequestDetailScreen.tsx`
  - Review timeline (next action + history)
  - Referral message sequence + referral data
- Navigation shell now mirrors prototype tabs + bottom nav (icons + labels).
- Request list view exists with stage filters and empty states.
- Settings/scorecard UI now mirrors the prototype content and structure.

## Drift Summary (Delta to Reconcile)
1) **Navigation/Information Architecture**
   - ✅ Mobile now includes tabs + bottom nav to match prototype.
   - Icons for bottom nav and flat icons for “New Request” CTAs added.

2) **Request Card Structure**
   - Mobile now matches prototype card layout (archive action, message preview).
   - Status/type row and action-needed badge removed from mobile for parity.

3) **Request Detail Content**
   - Prototype uses review timeline + message sequence + referral data.
   - Mobile now mirrors this content order and sections.

4) **Settings + Scorecard**
   - ✅ Mobile now includes full settings + scorecard UI parity from the prototype.
   - Decision: port from prototype to mobile (no removals).

5) **Data Model Assumptions**
   - Mobile uses `contactSnapshot`, `actionRequired`, etc.
   - Prototype now uses shared types and `contactSnapshot`.

## Reconciliation Decisions (Proposed Defaults)
- Treat the prototype as the UI source-of-truth unless the main app already matches it with improved implementation quality.
- For any area where the main app already reflects the prototype UI, keep the main app behavior and adjust the prototype to match.
- Settings/scorecard are in scope and are ported to mobile (no removals).

## Implementation Steps
### Phase 1: Baseline Alignment (High Priority)
1) **Request Card parity**
   - ✅ Mobile matches the prototype card layout and elements.
   - ✅ Request preview cards now match prototype layout, spacing, and typography.
   - If mobile already reflects the prototype UI with better structure, keep mobile as reference and update prototype to match.
   - Archive action retained for now; needs product confirmation.

2) **Request Detail parity**
   - ✅ Mobile matches the prototype detail content order and sections.
   - ✅ Request detail cards now align with prototype styling and structure.
   - ✅ Status/type/date formatting aligned with prototype.

3) **Data model normalization**
   - ✅ Prototype `Request` type now uses the shared model.
   - ✅ `contactSnapshot` is used consistently (prototype + mobile).

### Phase 2: Navigation & IA Alignment
4) **Tabs and bottom nav**
   - Define the target IA in a short decision note:
     - Option A (keep): top tabs + bottom nav remain in prototype and are ported to mobile.
     - Option B (remove): prototype navigation collapses to mobile-style flow.
   - Decision: Option A. Prototype navigation is source-of-truth; port tabs + bottom nav to mobile.
   - Inventory screens impacted:
     - Prototype: scorecard, reviews, referrals, settings (tabs + bottom nav).
     - Mobile: request list + request detail (single stack).
   - Implementation actions by option:
     - Option A: add tab/navigation shell to mobile, map prototype tabs to mobile routes, and ensure request list is the default entry.
     - Option B: remove prototype tabs + bottom nav, expose request list as the root, and keep request detail as modal/stack.
   - Status:
     - ✅ Mobile now defaults to Scorecard tab (prototype entry).
     - ✅ Stage sub-tabs for reviews/referrals implemented.
     - ✅ Bottom nav matches prototype structure with icons + labels.
     - ✅ New request CTA includes flat icons (review/referral).
     - ✅ Request detail opens from list with back navigation.
   - Validation:
     - Navigation matches across apps for the chosen option.
     - Entry point and back behavior are consistent with the mobile flow.
     - Visual parity audit still required for spacing/typography/icon sizing.

### Phase 3: Settings & Scorecard Parity
5) **Feature parity**
  - ✅ Mobile now includes Settings + Scorecard UI parity (appearance, business description, tone examples, Google URL, emoji threshold, cadence controls, and scorecard metrics).
  - Prototype remains the UI source-of-truth; mobile mirrors content and structure.
  - Wiring status: theme toggle wired on mobile (system/light/dark); settings persistence still pending.

### Phase 4: UI Tokens & Styling
6) **Token alignment**
   - Move shared colors/spacing into `packages/shared` or a UI package.
   - Ensure both apps consume the same palette and typography scale.
   - **Status (mobile only):** centralized tokens added in `apps/mobile/src/theme/tokens.ts`.
   - **Status (mobile only):** core mobile screens/components now consume tokens for colors, spacing, and typography.
  - **Outstanding:** settings persistence + shared token distribution still pending.

## Deliverables
- Updated main app UI aligned to prototype for request list/detail/settings/scorecard.
- Decision recorded: settings/scorecard are ported from prototype to mobile.
- Shared token usage checklist.

## Validation Checklist
- Request card layout, labels, and status match the prototype (unless main app already reflects it).
- Request detail matches the prototype content order and sections (unless main app already reflects it).
- Settings and scorecard match the prototype copy, sections, and layout.
- Visual style aligns (spacing, typography, colors).
- Bottom nav icons + labels match prototype.
- New request CTA iconography matches prototype.
- No prototype-only UI remains in core flows unless explicitly approved.

## Notes / Open Decisions
- Should archive action be part of core flow?
- Settings/scorecard data wiring (persistence + backend) is still TBD.
- Theme toggle wiring (dark mode + system preference) is still TBD.
- Should request history be represented as timeline or message sequence?
