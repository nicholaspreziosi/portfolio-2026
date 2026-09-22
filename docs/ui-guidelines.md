# UI Guidelines

Visual and interaction rules for the portfolio. File layout, naming, and the case-study data model are in [architecture.md](./architecture.md). Motion choreography for specific pages is in [portfolio-build-interaction-plan.md](./portfolio-build-interaction-plan.md).

Components are local to this repo, in `src/ui`. Style them with Tailwind and the semantic tokens in `globals.css`.

## Styling

- Prefer Tailwind utilities on the component.
- Use an inline style or a custom CSS rule only when a utility cannot express the behavior (for example a scroll-linked value or a blurred gradient field).
- Keep class lists readable. Extract a component when a class string is copied with small variations.
- One-off visual treatments belong in a token or a named variant.

## Design tokens

Tokens are defined in a later step. Until they exist, new UI should still be written so colors, type, radius, and shadow can be swapped for tokens without a redesign.

- Read color, type, radius, border, shadow, and surface from semantic tokens (`background`, `foreground`, `muted`, `border`, `accent`, and the surface roles added with the theme).
- Components depend on those roles. A button, card, or heading does not embed a hex value, a raw shadow, or a one-off font size.
- Add a token when a role is missing. Duplicate a nearby hex instead of inventing a second source of truth.
- Spacing uses Tailwind’s default 4px scale.

## Theme

Light and dark are both designed. Dark is a second set of semantic values, applied together with type, borders, surfaces, and ambient gradients.

- The active theme is a class or `data-theme` on `<html>`, and `color-scheme` matches it.
- Theme changes animate surfaces, text, borders, and ambient gradients as one transition.
- The View Transition API is appropriate for that cross-fade once the token themes exist. It is optional polish, not a requirement for the first theme toggle.
- Text and controls stay readable while gradients move behind them. Gradient fields are atmosphere. They are not the surface color of body copy.
- Honor the system preference on first visit, and keep an explicit toggle in the shell.

## Typography

- UI text uses the sans font already wired in the root layout (`--font-geist-sans`). Mono is for short meta: years, labels, code.
- Use a short type scale: eyebrow, body, title, and display. Page sections pick from that scale.
- Display type can be tight and large. Body copy stays at a comfortable measure, about 60–75 characters.
- Eyebrows are short, tracked-out labels. They do not replace headings.
- Headings stay in document order (`h1` then `h2` …) even when the visual size differs.
- Gradient text is a named treatment for a few words, not for paragraphs.

## Spacing

- Use the default scale: `gap-4`, `p-6`, `py-16`, and the same values at breakpoints (`md:py-24`).
- Arbitrary spacing (`p-[13px]`, `mt-[22px]`) is for a measured optical exception, and it should be rare.
- Similar elements share the same gap. Cards in one group, stack sections with one vertical rhythm, and keep that rhythm on every page.
- Section padding is part of `Section`. Pages should not invent a new page inset per route. Horizontal page inset lives on `Container`.

## Layout and grid

- Every page is a column of sections inside the shell: navigation, main, footer.
- `Container` sets the content width and horizontal padding. `Section` sets vertical padding and an optional id for in-page links.
- Wide media (hero, gallery, photography) may break out of the container. Body copy and UI controls stay in it.
- Use flex and grid. Reach for a fixed width only for a control, a dialog, or a device frame around a screenshot.
- The listing may use a varied editorial grid (a featured study spanning more columns than a standard card). The detail page is a single reading column with media breaks.
- Primary actions are the filled button. Secondary actions are quiet. A section has one primary action at most.

## Radii, borders, and shadows

- Radii come from a small set: sharp, small, medium, large, and full. Cards, inputs, and buttons each have one assigned radius.
- Borders use the `border` token at 1px. Use a stronger border only for focus or a selected state.
- Shadows express elevation for floating surfaces: the navigation bar, dialogs, sheets, and menus.
- Cards rest flat. A hover shadow or a soft glow is feedback, and it uses the shared shadow token.
- Ambient color is a blurred gradient field, not a drop shadow and not a striped gradient band.

## Responsive behavior

Design the small screen first, then add layout at `sm`, `md`, and `lg`.

| Surface | Small | `md` and up |
| --- | --- | --- |
| Navigation | Menu opens a sheet | Floating glass bar |
| Featured work and testimonials | Swipe | Drag, with visible adjacent slides |
| Case study listing | Single column, swipeable card media | Editorial grid, hover media preview |
| Case study detail | Stacked, full-bleed media | Reading column, media can go wide |
| AI assistant (later) | Sheet or full screen | Floating panel |
| Dialogs | Usable at full width with page inset | Centered, max width |

- Navigation, filters, dialogs, carousels, and cards are checked at a phone width and at a desktop width before a page is done.
- The capability filter is a control that wraps or becomes a horizontally scrollable row. It does not overflow the viewport.
- Hover-only behavior has a focus and a touch equivalent. Image zoom on hover still shows the same media on a tap or keyboard focus.

## RTL support

Locale direction comes from the active `next-intl` locale. The document sets `dir="rtl"` or `dir="ltr"` on `<html>`. Components do not hardcode a direction.

- Use logical direction classes: `start`, `end`, `ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`, `inset-s`, `inset-e`, `rounded-s-*`, and `rounded-e-*`.
- Physical classes (`left`, `right`, `ml-*`, `mr-*`, `pl-*`, `pr-*`, `text-left`, `text-right`) are for a layout that is intentionally tied to the screen, such as a device frame or a screenshot that must not mirror.
- Absolute and fixed positioning uses `inset-inline-start` and `inset-inline-end` (Tailwind `start-*` / `end-*`) rather than `left` or `right`.
- Inline icons that point along the writing direction (arrows, chevrons, back, next) use `rtl:rotate-180` or a logical icon so they follow the locale. Icons that depict a physical object stay as drawn.
- Horizontal groups (navigation, carousels, galleries, button rows) use flex or grid with logical alignment. The first item is at the start edge, and “next” moves toward the end edge.
- Focus order follows the DOM, which follows reading order. Do not reorder controls visually in a way that breaks that sequence in RTL.

## Motion

Motion has four jobs:

| Level | Job | Examples |
| --- | --- | --- |
| Ambient | Atmosphere | Drifting gradient fields, a little parallax |
| Functional | State | Hover, press, open, close, filter, theme |
| Narrative | Explain the work | K Lab system sequence, rebrand sequence |
| Delight | Reward a moment | A small shared-layout move into a study |

About 80% of motion is quiet and functional. The remaining 20% is narrative, and it earns the extra movement by explaining a decision or a system. A section does not get an entrance animation only because it can.

### Principles

1. Motion communicates hierarchy, state, spatial relationship, or meaning.
2. Timing and easing come from the shared motion tokens.
3. Entrances are subtle and run once when the element enters.
4. Strong scroll-driven sequences explain something.
5. Motion never delays a click, a type, or a scroll.
6. A component owns the motion that belongs to its behavior.
7. `prefers-reduced-motion` is always respected.
8. A few shared patterns beat a new curve on every page.

### What moves

- Ambient gradients drift slowly and recolor with the theme.
- Page and section entrances are short fades with a small offset, staggered where a group appears together (hero eyebrow, title, copy, actions).
- The navigation bar strengthens its blur and elevation after the page leaves the top, and the active item animates between links.
- Listing cards move to their new positions when a capability filter changes. They do not pop in and out.
- Carousels drag and snap. They do not auto-rotate.
- Screenshots expand into the lightbox with a shared-layout transition.
- The experience timeline draws as it enters, and the active role changes with scroll.
- Photography in Beyond the Screen may reveal, scale slightly, or parallax. Copy stays short.
- The assistant, when it exists, animates continuously from button to compact panel to expanded panel.

Bespoke sequences stay custom components, as described in the architecture doc. They still use the motion tokens.

### Reduced motion

When `prefers-reduced-motion: reduce` is set:

- Reveals are instant or nearly instant.
- Parallax is off.
- Ambient gradients are still.
- Scroll sequences show a clear static frame.
- State changes (open, close, filter, theme, slide) still read clearly.

## Media

Content references files with `MediaAsset`. Files live in `public/images` and `public/videos`. The `src` in JSON is the public path.

- Every asset has `alt`. Decorative atmosphere (gradient fields) is CSS, not an unlabeled image.
- Set `width` and `height` when known so the layout does not jump.
- Raster content images use `next/image`. Fill the frame and use `object-cover` for cards. Use `object-contain` when cropping would hide the product UI.
- Captions render when `caption` is set, directly under the media, in the muted style.
- Card and hero video is a short, muted, `playsInline` preview. Longer recordings start on user input, with controls.
- The lightbox opens from a screenshot or video, traps focus, closes on Escape, and moves with arrow keys and swipe. Zoom and pan are available when the screenshot rewards it.
- A `tall-screenshot` scrolls inside a fixed browser or device frame. The page around the frame stays still while the shot scrolls.
- Listing cards may scale the image slightly on hover, or swap in the preview video. On a small screen the same media is swipeable inside the card.
- Photography (portrait, surfing, snowboarding, landscape) can go full width. Product screenshots stay in a frame so the UI is legible.

## Case studies

The listing and the detail page are two views of the same `CaseStudy` objects.

**Listing.** Featured studies are visually primary. Standard studies are quieter. Both show image, title, role, and capability tags. Filters use the capability union from the content type. Layout transitions follow the motion rules above.

**Detail.** Render the shared order from the architecture doc. Empty optional fields are omitted, not shown as blank headings. Related work uses `CaseStudyCard` and only links to published studies.

Custom sequences and extra narrative go through `sections` or a bespoke component for that slug. The rest of the page stays the shared template.

## Accessibility

- Use semantic elements: `header`, `nav`, `main`, `footer`, `section`, headings, lists, and buttons for actions. Links are for navigation.
- Every interactive control is reachable and operable by keyboard, with a visible focus ring using the focus token.
- Icon-only buttons, carousel controls, and the theme toggle have an accessible name.
- Dialogs and sheets trap focus and restore it to the trigger on close.
- Color is not the only signal for selection, errors, or filter state.
- Contrast holds in both themes for text, muted text, and controls.
- Media alternatives follow the media rules above. Critical information is in text, not only inside an image.

## Icons

- Use [Lucide](https://lucide.dev) for UI icons.
- Size icons consistently (one size for controls, one size for inline meta).
- An icon reinforces an action or a label. It does not decorate a heading on its own.

## Copy

- Write in plain sentences. Button labels say the action (“View project”, “Get in touch”).
- Project facts come from content JSON. Chrome and section labels will come from `next-intl` messages.
- Use the same words for the same things: case study, capability, work. The capability labels match the filter and the tags.

## States

Portfolio pages are mostly static content, so the states that matter are:

- **Loading** for a route or a video: reserve the media box at its aspect ratio. Use a quiet skeleton for a card grid if the listing ever streams.
- **Empty** for a filter with no studies: say that nothing matches and offer a way to clear the filter.
- **Missing media**: keep the title and text. Show a neutral surface in the media frame.
- **Form** on contact: show a pending state on submit, a specific error, and a clear success message.

## Forms

The contact form stays short: a few fields, one column, one submit button.

- Mark required fields.
- Errors sit by the field and say how to fix the value.
- Inputs use the shared form controls and the same radius, border, and focus ring as the rest of the system.

## Code quality

- Keep JSX shallow. Name a section component when a page file becomes a long list of blocks.
- Separate content loading (server page) from interaction (client component).
- Name components, props, and state for what they are in the portfolio (`featured`, `capabilities`, `lightboxIndex`).
- Reuse a token, a primitive, or a pattern before adding a new visual or motion value.
