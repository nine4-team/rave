# New Request CTA (Mobile) — Contextual + Global Action

## Goal
Make “New request” **always findable** without adding a new tab or increasing bottom tab complexity.

## Current state (in-app)
- **Contextual CTAs** already exist inside:
  - **Reviews** tab (create review request)
  - **Referrals** tab (create referral request)

## Proposed approach
Keep the contextual CTAs, and add a **global top-right action button** that opens an **action sheet** (aka “bottom sheet”).

### Entry points
- **Reviews tab**: existing contextual CTA remains.
- **Referrals tab**: existing contextual CTA remains.
- **All tabs** (Scorecard / Reviews / Referrals / Settings): add a top-right **“+”** action button in the header.

### Global “+” behavior (action sheet)
When tapping the top-right “+”, show an action sheet with **the same labels and icons used by the contextual CTAs** (for consistency).

**Action sheet options (order can be tuned):**
- **[icon]** `<Same text as Reviews CTA>` (Title Case)
- **[icon]** `<Same text as Referrals CTA>` (Title Case)
- **Cancel**

Notes:
- Use the **exact same iconography** and **exact same copy** as the contextual buttons (no new wording).
- The action sheet should be visually lightweight and dismissible (tap outside / swipe down).

## Navigation + flow notes
- Selecting an option routes into the **request creation flow** for that type.
- Contextual CTAs can continue to route directly into their respective typed flow (no “choose type” step).
- The global “+” provides discoverability without forcing extra steps in the common case.

## Edge cases
- If the request creation flow requires contact permissions, the global “+” should still be usable; permissions are requested **inside the flow**, not at the tab level.

## Future enhancements (optional)
- If you later want “fast paths,” the action sheet can remember last-used type and reorder options.

