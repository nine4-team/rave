# Visual Parity Audit: Prototype vs Mobile

This document outlines the visual discrepancies between the web prototype (`prototype/src`) and the mobile application (`apps/mobile/src`). The goal is to align the mobile app's visual execution with the prototype's design.

**Note:** Comparison format is **Prototype Value** (Target) vs **Mobile Value** (Current).

## 1. Global Theme & Typography

- [x] **Body Text Size**
    - **Prototype**: `text-sm` (14px) is the standard body size.
    - **Mobile**: Uses `tokens.fontSizes.base` / `tokens.fontSizes.sm` (14px).
    - **Match**: Body text scale aligned.
- [x] **Date/Caption Text Size**
    - **Prototype**: `text-xs` (12px).
    - **Mobile**: Uses `tokens.fontSizes.xs` (12px).
    - **Match**: Caption scale aligned.
- [x] **Spacing Scale**
    - **Prototype**: Tailwind `p-4` (16px), `p-5` (20px), `p-6` (24px).
    - **Mobile**: `xl` (16px), `xxl` (20px), `xxxl` (24px).
    - **Match**: Spacing scale aligned.
- [x] **App Background Color**
    - **Prototype**: `bg-[#f7f8fa]`.
    - **Mobile**: `tokens.colors.actionBackgroundSubtle` (`#F7F8FA`).
    - **Match**: App background color aligned.

## 2. Navigation & App Shell

- [x] **Bottom Navigation Icon Size**
    - **Prototype**: `w-6 h-6` (24px).
    - **Mobile**: `tokens.iconSizes.lg` (24px).
    - **Match**: Icon size aligned.
- [x] **Bottom Navigation Padding**
    - **Prototype**: `px-6 py-4` (24px, 16px).
    - **Mobile**: `paddingVertical: xl` (16px), `paddingHorizontal: xxxl` (24px).
    - **Match**: Bottom nav container uses 24px horizontal padding.
- [x] **Header Padding**
    - **Prototype**: `py-4` (16px).
    - **Mobile**: `paddingVertical: xl` (16px).
    - **Match**: Padding aligned.
- [x] **Stage Tabs (Reviews/Referrals)**
    - **Prototype**: Text size `text-sm` (14px).
    - **Mobile**: Text size `tokens.fontSizes.base` (14px).
    - **Match**: Tab label size aligned.
- [x] **Header Title Size**
    - **Prototype**: `text-lg` (18px).
    - **Mobile**: `tokens.fontSizes.lg` (18px).
    - **Match**: Header title aligned.
- [x] **Stage Tab Horizontal Padding**
    - **Prototype**: `px-4` (16px).
    - **Mobile**: `paddingHorizontal: xl` (16px).
    - **Match**: Tab padding aligned.
- [x] **Stage Tabs Container Horizontal Padding**
    - **Prototype**: `px-4` (16px) on the tabs container.
    - **Mobile**: `paddingHorizontal: xl` (16px).
    - **Match**: Tabs container padding aligned to 16px.
- [x] **Stage Tab Vertical Padding**
    - **Prototype**: `py-3` (12px).
    - **Mobile**: `paddingVertical: lg` (12px).
    - **Match**: Tab vertical padding aligned to 12px.
- [x] **Stage Tab Font Weight**
    - **Prototype**: Inactive `font-medium` (500), Active `font-bold` (700).
    - **Mobile**: Inactive `fontWeight: '500'`, active `fontWeight: '700'`.
    - **Match**: Tab weights aligned.
- [x] **Bottom Navigation Label Size**
    - **Prototype**: `text-xs` (12px).
    - **Mobile**: `tokens.fontSizes.xs` (12px).
    - **Match**: Label size aligned.
- [x] **Bottom Navigation Label Weight**
    - **Prototype**: `font-medium` (500) for inactive labels; active uses `font-semibold`.
    - **Mobile**: Inactive labels use `fontWeight: '500'`, active uses `600`.
    - **Match**: Inactive label weight aligned to 500.
- [x] **Bottom Navigation Item Padding**
    - **Prototype**: `px-4 py-2` (16px, 8px) per tab button.
    - **Mobile**: `paddingHorizontal: xl` (16px), `paddingVertical: sm` (8px).
    - **Match**: Bottom nav item padding aligned.
- [x] **Stage Definition Padding**
    - **Prototype**: `px-6 py-3` (24px, 12px).
    - **Mobile**: `paddingHorizontal: xxxl` (24px), `paddingVertical: lg` (12px).
    - **Match**: Stage definition padding aligned.
- [x] **New Request Bar Padding**
    - **Prototype**: `px-6 py-3` (24px, 12px).
    - **Mobile**: `paddingHorizontal: xxxl` (24px), `paddingVertical: lg` (12px).
    - **Match**: New request bar padding aligned.

## 3. Request Card (List Item)

- [x] **Card Border Radius**
    - **Prototype**: `rounded-lg` (8px) on `.card` containers.
    - **Mobile**: `tokens.radii.lg` (8px).
    - **Match**: Card radius aligned.
- [x] **Archive Button Style**
    - **Prototype**: `p-2`, `rounded` (4px), transparent by default, `hover:bg-[#f0f0f0]`.
    - **Mobile**: `padding: sm` (8px), `borderRadius: sm` (4px), transparent.
    - **Match**: Ghost button style aligned.
- [x] **Message Preview Date Size**
    - **Prototype**: `text-xs` (12px).
    - **Mobile**: `tokens.fontSizes.xs` (12px).
    - **Match**: Caption size aligned.
- [x] **Message Preview Container**
    - **Prototype**: `bg-[#fafafa]` (matches mobile `surfaceAlt`), `p-3` (12px).
    - **Mobile**: `padding: lg` (12px).
    - **Match**: These seem aligned, but check visual density.

## 4. Request List Screen

- [x] **Screen Padding**
    - **Prototype**: `px-6 py-8` (24px, 32px).
    - **Mobile**: `paddingHorizontal: xxxl` (24px), `paddingVertical: huge` (32px).
    - **Match**: List padding aligned.
- [x] **Empty State Card Radius**
    - **Prototype**: `rounded-2xl` (16px).
    - **Mobile**: `tokens.radii.xl` (16px).
    - **Match**: Radius aligned.
- [x] **Empty State Padding**
    - **Prototype**: `py-12` (48px).
    - **Mobile**: `paddingVertical: 48` (48px).
    - **Match**: Padding aligned.
- [x] **Empty State Title Size**
    - **Prototype**: `text-lg` (18px).
    - **Mobile**: `tokens.fontSizes.lg` (18px).
    - **Match**: Title size aligned.
- [x] **Empty State Description Size**
    - **Prototype**: `text-base` (16px).
    - **Mobile**: `tokens.fontSizes.xl` (16px).
    - **Match**: Description size aligned.
- [x] **List Item Gap**
    - **Prototype**: `gap-4` (16px).
    - **Mobile**: `gap: xl` (16px).
    - **Match**: Item spacing aligned.

## 5. Scorecard Overview

- [x] **Screen Padding**
    - **Prototype**: `px-6 py-8` (24px, 32px) on the main content container.
    - **Mobile**: `paddingHorizontal: xxxl` (24px), `paddingVertical: huge` (32px).
    - **Match**: Scorecard padding aligned to 24px/32px.
- [x] **Metric Value Spacing**
    - **Prototype**: Value text has `mt-2` (8px) from label.
    - **Mobile**: `gap: sm` (8px) between label and value.
    - **Match**: Metric label/value spacing aligned to 8px.
- [x] **Card Border Radius**
    - **Prototype**: `rounded-2xl` (16px).
    - **Mobile**: `tokens.radii.xl` (16px).
    - **Match**: Card radius aligned.
- [x] **Card Padding**
    - **Prototype**: `p-5` (20px).
    - **Mobile**: `padding: xxl` (20px).
    - **Match**: Card padding aligned.
- [x] **Metric Label Size**
    - **Prototype**: `text-sm` (14px) uppercase with tracking.
    - **Mobile**: `tokens.fontSizes.sm` (14px).
    - **Match**: Label size aligned.
- [x] **Metric Value Size**
    - **Prototype**: `text-3xl` (30px).
    - **Mobile**: `tokens.fontSizes.xxxl` (30px).
    - **Match**: Value size aligned.

## 6. Request Detail Screen

- [x] **Screen Title (Contact Name)**
    - **Prototype**: `text-2xl` (24px) bold.
    - **Mobile**: `fontSize: 24` with `fontWeight: '700'`.
    - **Match**: Title size aligned.
- [x] **Header Subtext (Created Date)**
    - **Prototype**: `text-sm` (14px).
    - **Mobile**: `tokens.fontSizes.base` (14px).
    - **Match**: Subtext size aligned.
- [x] **Header Padding**
    - **Prototype**: `px-6 py-4` (24px, 16px).
    - **Mobile**: `paddingHorizontal: xxxl` (24px via container) + `paddingVertical: xl` (16px).
    - **Match**: Header padding aligned.
- [x] **Status Bar Text**
    - **Prototype**: `text-sm` (14px).
    - **Mobile**: `tokens.fontSizes.base` (14px).
    - **Match**: Status text size aligned.
- [x] **Header Actions (Archive + Close)**
    - **Prototype**: Header includes Archive and Close icon buttons (`p-2`, `w-6 h-6`).
    - **Mobile**: Actions sit alongside the sticky contact-name header.
    - **Match**: Actions sit with the sticky contact header.
- [x] **Header Action Button Radius**
    - **Prototype**: `rounded-lg` (8px).
    - **Mobile**: `borderRadius: lg` (8px) on header icon buttons.
    - **Match**: Header action radius aligned.
- [x] **Header Title Content**
    - **Prototype**: No extra title; header title is the contact name.
    - **Mobile**: Contact name anchors the header title.
    - **Match**: Header title uses contact name.
- [x] **Detail Header Content Placement**
    - **Prototype**: Sticky header contains contact name + created date + action buttons.
    - **Mobile**: Sticky header includes contact name, date, and actions.
    - **Match**: Detail header is sticky and aligned.

## 7. Review Flow (Detail Content)

### Next Action Card
- [x] **Card Title Bar ("Next")**
    - **Prototype**: `text-base` (16px) with `font-semibold`.
    - **Mobile**: `fontSize: xl` (16px) with `fontWeight: '600'`.
    - **Match**: Title bar aligned.
- [x] **Next Action Label + Button Text**
    - **Prototype**: Caption uses `nextActionLabel` (e.g. "Reply on Google") in `text-xs`; primary button label is context-aware.
    - **Mobile**: Caption uses `action.label` in `text-xs`; primary button label matches context.
    - **Match**: Caption and button labels aligned.
- [x] **Action Buttons Layout**
    - **Prototype**: Buttons are `flex-1` (equal width).
    - **Mobile**: Buttons use `flex: 1`.
    - **Match**: Buttons fill width evenly.
- [x] **Delete Button**
    - **Prototype**: `p-2`, `rounded`, icon `w-4 h-4` (16px).
    - **Mobile**: `p-2`, 16px icon, `borderRadius: sm` (4px).
    - **Match**: Delete button aligned.
- [x] **Message Bubble Text**
    - **Prototype**: `text-sm` (14px).
    - **Mobile**: `fontSize: base` (14px) - **Match**.
- [x] **Referral Next Action Label**
    - **Prototype**: "Request a referral" card has no caption label above the message.
    - **Mobile**: Hides the caption label for `request-referral` state.
    - **Match**: Referral card layout aligned.
- [x] **Action Button Vertical Padding**
    - **Prototype**: `py-2` (8px) on primary/secondary buttons.
    - **Mobile**: `paddingVertical: sm` (8px).
    - **Match**: Button vertical padding aligned to 8px.

### History Timeline
- [x] **Header Padding**
    - **Prototype**: `px-4 py-3` (16px, 12px).
    - **Mobile**: `paddingHorizontal: xl` (16px), `paddingVertical: lg` (12px).
    - **Match**: Seems consistent.
- [x] **Timeline Item Padding**
    - **Prototype**: `p-5` (20px).
    - **Mobile**: `padding: xxl` (20px).
    - **Match**: Seems consistent.
- [x] **Timeline Icons**
    - **Prototype**: `w-5 h-5` (20px).
    - **Mobile**: `size={20}` (20px).
    - **Match**: Icon size aligned.
- [x] **History Item Body Text**
    - **Prototype**: `text-sm` (14px).
    - **Mobile**: `tokens.fontSizes.base` (14px).
    - **Match**: Body text aligned.
- [x] **Feedback Body Layout**
    - **Prototype**: Emoji icon + rating row, divider, and feedback text.
    - **Mobile**: Uses icon row + divider + feedback text.
    - **Match**: Feedback layout aligned.

## 8. Message Sequence Section

- [x] **Empty State**
    - **Prototype**: No empty-state message when there are no sent messages.
    - **Mobile**: No empty-state message rendered.
    - **Match**: Behavior aligned.
- [x] **Section Divider Label Size**
    - **Prototype**: `text-xs` (12px) with `tracking-wide`.
    - **Mobile**: `tokens.fontSizes.xs` (12px) with `letterSpacingBase`.
    - **Match**: Divider label styling aligned.
- [x] **Action Buttons Sizing**
    - **Prototype**: Text `text-sm` (14px), icons `w-4 h-4` (16px), delete button `p-2`.
    - **Mobile**: `fontSize: base` (14px), icons 16px, delete button padding 8px.
    - **Match**: Actions aligned.
- [x] **Action Button Vertical Padding**
    - **Prototype**: `py-2` (8px) on primary/secondary buttons.
    - **Mobile**: `paddingVertical: sm` (8px).
    - **Match**: Button vertical padding aligned to 8px.

## 9. Referral Data Section

- [x] **Header Title Size**
    - **Prototype**: Default size (16px) with `font-semibold`.
    - **Mobile**: `tokens.fontSizes.xl` (16px).
    - **Match**: Header title aligned.
- [x] **Section Title Size**
    - **Prototype**: Default size (16px) with `font-semibold`.
    - **Mobile**: `tokens.fontSizes.xl` (16px).
    - **Match**: Section title aligned.
- [x] **Row Value Size**
    - **Prototype**: `text-sm` (14px) with `font-medium`.
    - **Mobile**: `tokens.fontSizes.sm` (14px).
    - **Match**: Row values aligned.
- [x] **Message Box Radius**
    - **Prototype**: `rounded` (4px).
    - **Mobile**: `tokens.radii.sm` (4px).
    - **Match**: Radius aligned.
- [x] **Variant Card Radius**
    - **Prototype**: `rounded` (4px).
    - **Mobile**: `tokens.radii.sm` (4px).
    - **Match**: Radius aligned.
- [x] **Variant Body Text Size**
    - **Prototype**: `text-sm` (14px).
    - **Mobile**: `tokens.fontSizes.sm` (14px).
    - **Match**: Variant body text aligned to 14px.
- [x] **Customization Box Colors**
    - **Prototype**: `bg-[#FFF8E1]`, border `#FFF0B5`, text `#B06E00`.
    - **Mobile**: `backgroundColor: #FFF8E1`, `borderColor: #FFF0B5`, text uses `tokens.colors.warning`.
    - **Match**: Colors aligned.
- [x] **Final Message Border Color**
    - **Prototype**: Border `#D4C4B0`.
    - **Mobile**: `borderColor: #D4C4B0`.
    - **Match**: Border color aligned.
- [x] **Send Status Pending Color**
    - **Prototype**: Pending text `#FFC107`.
    - **Mobile**: Uses `tokens.colors.warningPending` (`#FFC107`).
    - **Match**: Pending status uses `#FFC107`.
- [x] **Send Status Icon Size**
    - **Prototype**: `w-4 h-4` (16px).
    - **Mobile**: `size={16}`.
    - **Match**: Status icons aligned to 16px.
- [x] **Send Status Container Radius**
    - **Prototype**: No extra rounding on the send-status section.
    - **Mobile**: No extra rounding on the send-status section.
    - **Match**: Status section has no extra rounding.

## 10. Settings Panel

- [x] **Settings Screen Padding**
    - **Prototype**: `px-6 py-8` (24px, 32px) on the settings tab container.
    - **Mobile**: `paddingHorizontal: xxxl` (24px), `paddingVertical: huge` (32px).
    - **Match**: Settings padding aligned to 24px/32px.
- [x] **Appearance Title Size**
    - **Prototype**: `text-lg` (18px).
    - **Mobile**: `tokens.fontSizes.lg` (18px).
    - **Match**: Heading size aligned.
- [x] **Input Card Padding**
    - **Prototype**: `p-4` (16px).
    - **Mobile**: `padding: xl` (16px).
    - **Match**: Input card padding aligned.
- [x] **Input Field Vertical Padding**
    - **Prototype**: `py-2` (8px).
    - **Mobile**: `paddingVertical: sm` (8px).
    - **Match**: Input vertical padding aligned to 8px.
- [x] **Save Button Horizontal Padding**
    - **Prototype**: `px-4` (16px) for `.btn-secondary`.
    - **Mobile**: `paddingHorizontal: xl` (16px).
    - **Match**: Save button padding aligned to 16px.

## 11. "Alex Rivera" Example Specifics

- [x] **Avatar**
    - **Prototype**: `bg-[#D4C4B0]`, Text `#6B5D47`.
    - **Mobile**: Uses tokens `avatarBackground`, `avatarText`.
    - **Check**: Verify tokens match these hex values exactly. (Tokens file: `avatarBackground: '#D4C4B0'`, `avatarText: '#6B5D47'` - **Match**).
- [x] **Status Badge (In List/Header)**
    - **Prototype**: Status is plain text with `font-semibold` in detail and list.
    - **Mobile**: Plain text with `fontWeight: '600'`.
    - **Match**: No badge styling needed for parity.

## Summary of Token Alignment

- [x] `tokens.fontSizes.sm` aligned to 14px; `tokens.fontSizes.xs` aligned to 12px.
- [x] `tokens.iconSizes.md` aligned to 20px; `tokens.iconSizes.lg` aligned to 24px.
- [x] `tokens.radii.lg` aligned to 8px.
- Remaining gaps are component-level sizing/padding differences called out above.
