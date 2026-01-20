# Contact Selection (Mobile) — Custom Picker Plan

## Goal
Enable selecting one or more contacts to create a new request, while clearly showing:
- **Who already has a request**
- The **request type** (via existing icons)
- The **current stage** (matching the tab stages in Reviews/Referrals)

This is intentionally **not** a standalone “Contacts” destination/tab—this is a **picker screen** within the creation flow.

## Why custom (not native contact picker)
We need row-level UI control to show product-specific metadata (request exists, type, stage). Native pickers generally don’t support this kind of customization consistently.

## Screen: Contact Picker

### Layout
- **Header**: “Select contacts” (or existing app pattern)
- **Search bar**: pinned at top
- **Stage-style tabs** (match the rest of the app’s tab styling):
  - Default: **Not Requested**
  - Secondary: **Requested**
  - Tertiary: **Set Aside** (see naming note below)

### Tabs (behavior)
- **Not Requested**:
  - Shows contacts with **no existing request** (for the relevant request type if you’re scoping by type).
  - This is the primary “I’m picking who to ask” workflow.
- **Requested**:
  - Shows contacts with **at least one request** already created.
  - Multiple requests per contact are acceptable (especially for referrals); this tab is where that complexity lives.
- **Set Aside**:
  - Shows contacts the user has intentionally marked as “probably not asking.”
  - Keeps “no” decisions out of the main Not Requested list.
  - Optional filter: **Show hidden** (see “Hide” below).

### Contact row design
Each row shows:
- **Primary**: Contact name
- **Secondary (optional)**: best available contact method (phone/email) or nothing (keep clean)

For contacts with an existing request (Requested tab), also show:
- **Leading icon** indicating request type:
  - **Star** = review request
  - **Handshake** = referral request
- **Stage label** in **Title Case**
  - The stage set must match the existing stage tabs in Reviews/Referrals for that request type.
  - Display as a subtle chip/badge, or a secondary line—keep it scannable.

### Selection behavior
#### Tap (baseline)
- Tap selects/deselects a contact (multi-select is supported).
- Bottom sticky CTA:
  - Disabled until \(n > 0\)
  - Label: “Continue” (or “Continue (n)”)

#### Swipe (MVP)
On **Not Requested** rows, enable quick triage via gestures:
- **Swipe right**: add to selection for this request (equivalent to “select”).
- **Swipe left**: move contact to **Set Aside**.

Notes:
- Provide a small visual affordance (icon + label) on swipe actions so it’s learnable.
- Allow undo immediately after the swipe (snackbar/toast or inline undo).

#### Swipe actions inside “Set Aside”
In **Set Aside**, treat rows as reversible “parking lot” items, plus an optional deeper “hide”:
- **Swipe right**: **Restore** (moves back to **Not Requested**)
- **Swipe left**: **Hide** (removes from Set Aside list by default; still recoverable)

“Hide” is not a destructive delete—it just marks the contact as **Hidden** so the picker stays clean.
To recover hidden contacts, enable **Show hidden** (toggle/filter) within the Set Aside tab and offer:
- **Restore** (back to Not Requested), or
- **Unhide** (back to Set Aside)

## Permissions + states
- If contacts permission is not granted:
  - Show a dedicated pre-permission screen or an inline empty state with:
    - “Allow Contacts” button
    - Brief explanation why (select recipients quickly)
    - Handle “denied” by deep-linking to OS settings
- Handle loading and empty states:
  - No contacts found (device has none / search yields none)
  - Search with zero results

## Data mapping requirements (implementation-facing)
To label “already has a request” and show type/stage, the picker needs a way to join:
- **Device contacts** (name + identifiers)
with
- **Existing requests** (recipient identity + request type + stage)

Recommended approach (conceptually):
- Normalize a recipient key (e.g., phone number in E.164 where possible, or email).
- Store that key on the request when created.
- In the picker, compute:
  - `hasExistingRequest`
  - `existingRequestType`
  - `existingRequestStage`

If a contact has multiple requests, choose a deterministic rule for the badge:
- Prefer **active/in-progress** over completed
- Prefer the **most recent** if multiple active

## Naming note: third tab
You suggested “Cold / Archived / Skipped / Set aside.” For an MVP that’s simple and non-judgmental, **Set Aside** is the cleanest label:
- It communicates “not now / likely not” without sounding permanent (like “Archived”) or harsh (like “Cold”).
- It also pairs naturally with the swipe left action (“set aside”).

If you want an even more explicit label later, alternatives:
- **Not Asking**
- **Not Now**
- **Skip**

## MVP scope decisions (captured)
- **No “Recents” section**
- **Yes**: clearly show “already has a request” in a separate section
- **Yes**: show stage + type for those entries
- **Yes**: tabs for **Not Requested / Requested / Set Aside**
- **Nice-to-have (if easy)**: “Hidden” as a sub-state of Set Aside with a **Show hidden** toggle
- Sorting can be simple for MVP (alphabetical); add advanced sorting later.

## Thoughts / recommendations
- Defaulting the tab to **Not Requested** keeps the picker focused on “who should I ask next?”.
- Since you’re okay with multiple requests, the **Requested** tab can remain selectable, but it should be explicit that you may be creating “another request” (copy or subtle helper text).

