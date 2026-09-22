# Portfolio Build & Interaction Plan

## Recommended Build Order

### 1. Project Foundation

-   Set up Next.js, TypeScript, and Tailwind CSS.
-   Configure linting, formatting, path aliases, metadata, and core
    project structure.
-   Establish the content/assets structure early.

### 2. Architecture & UI Guidelines

Define component organization, naming, responsive behavior, layout/grid
rules, spacing, typography, radii, shadows, accessibility standards,
theme behavior, motion principles, media handling, and case-study
architecture.

### 3. Design Tokens & Themes

-   Define CSS variables and semantic color tokens.
-   Establish light and dark themes.
-   Define typography, spacing, radius, border, shadow, and surface
    tokens.
-   Components should depend on semantic tokens rather than raw colors.

### 4. Gradient System

Create reusable variants for: - Ambient page backgrounds -
Hero/background gradients - Buttons - Gradient text - Card/glow
accents - Light and dark modes

Ambient gradients should use large, heavily blurred fields rather than
obvious gradient bands.

### 5. Component Library

Build reusable UI before complete pages.

Core components: - Button - Badge / Tag - Card - Section / Container -
Typography - Tabs / Filters - Dialog / Sheet - Tooltip / Popover -
Carousel - Media viewer / Lightbox - Theme toggle - Form controls

Portfolio-specific patterns: - CaseStudyCard - FeaturedWork -
ExperienceItem - Testimonial - MediaCarousel - AmbientGradient -
SectionHeading - Stat - CapabilityTags

### 6. Internationalization

Set up `next-intl` before writing large amounts of page copy: - Locale
routing - Translation files - Navigation - Page copy - Metadata - AI
assistant UI strings

### 7. Motion Foundation

Set up Motion for React and reusable conventions for: - Enter/exit
transitions - Staggered reveals - Hover/tap feedback - Layout
transitions - Scroll-triggered animation - Scroll-linked animation -
Reduced-motion preferences

### 8. Global Navigation & Footer

Build the floating/glass desktop navbar, mobile navigation, theme/locale
controls, footer, and any shared page transitions.

### 9. Homepage

Build: - Hero - Featured-work carousel - Systems-thinking section -
Modern workflow / AI section - CTA - AI assistant entry point

### 10. About

Build: - Intro + portrait - Skills & technologies - Condensed experience
timeline - Beyond the Screen photography - Education - Testimonials -
CTA

### 11. Contact

Keep intentionally simple: introduction, contact methods, social links,
form if needed, and availability/context.

### 12. Case Study Listing

Build: - Featured and standard project cards - Capability filters -
Varied editorial layout - Animated filtering/layout transitions -
Project imagery - Role/contribution and capability metadata

### 13. Case Study Detail System

Build one reusable case-study architecture supporting: - Hero - Overview
/ role / scope - Problem - Process - Decisions - Results - Featured
work - Screenshot galleries - Video - Tall screenshots - Captions -
Lightbox - Related work - Optional custom sections

Build a real case study against the system before assuming the template
is finished.

### 14. AI Portfolio Assistant

Build after the core portfolio works independently.

Desktop: floating, expandable/minimizable panel.\
Mobile: full-screen view or sheet.

Functionality: - Answer questions about experience, projects, skills,
and approach - RAG over approved portfolio content - Suggested prompts -
Potential navigation actions - Scope restrictions - Rate limiting and
usage protection

------------------------------------------------------------------------

# Motion & Interaction Plan

## Motion Philosophy

Use motion at four levels:

**Ambient** --- atmosphere and visual identity\
**Functional** --- communicates state and interaction\
**Narrative** --- explains work and decisions\
**Delight** --- subtle moments that reward exploration

Most motion should be restrained and functional. Save larger
scroll-driven sequences for moments where animation helps explain the
work.

## Global / Ambient

-   Slowly drift and morph ambient gradient fields.
-   Add very subtle scroll parallax where appropriate.
-   Transition ambient colors with light/dark themes.
-   Use restrained page/section entrance animations.
-   Respect `prefers-reduced-motion`.

## Navigation

-   Increase glass/blur opacity after scrolling away from the top.
-   Subtly adjust navbar size/elevation on scroll.
-   Animate active navigation states.
-   Use polished mobile menu/sheet transitions.

## Homepage

### Hero

-   Stagger eyebrow, headline, supporting copy, stats, and CTAs.
-   Keep text stable while ambient gradients move behind it.

### Featured Work

-   Drag/swipe carousel.
-   Shared-layout transitions between projects.
-   Animate media and accompanying copy together.
-   Subtle image scaling or video previews on interaction.

## Case Study Listing

-   Animate cards into new positions when capability filters change.
-   Avoid abrupt hide/show behavior.
-   Use subtle image zoom or alternate-media previews on desktop hover.
-   Support swipeable media on mobile.

## Case Study Details

### Signature K Lab Sequence

Create a scroll-driven visual explanation:

**Tokens → Primitives → Components → Patterns → Products**

As the user scrolls, foundations appear, primitives assemble into
components, components form reusable page patterns, and those patterns
transition across real K Lab products.

The animation should demonstrate the system rather than merely decorate
the page.

### Rebrand Sequence

For the K Lab marketing website:

**V1 → Design Tokens → V2**

Use a scroll-driven or interactive before/after transformation to show
how the token architecture supported the rebrand.

### Media

-   Expand screenshots into the lightbox with shared-layout transitions.
-   Support keyboard navigation and swipe.
-   Allow zoom/pan where useful.
-   For selected tall screenshots, scroll the page inside a fixed
    browser/device viewport.
-   Use short screen recordings to demonstrate interactions.

## About

### Portrait

-   Subtle fade/scale entrance.
-   Ambient gradient motion behind the hero.

### Experience

-   Draw/progress the timeline as the user scrolls.
-   Activate roles as they enter the viewport.

### Beyond the Screen

-   Use larger surfing, snowboarding, and landscape photography.
-   Gentle image reveals, scaling, or parallax.
-   Consider an editorial/full-width layout instead of standard cards.
-   Keep copy short and let imagery carry the section.

## Testimonials

-   Drag/swipe carousel.
-   Natural snapping.
-   Avoid forced auto-rotation.

## AI Assistant

Use a continuous transition:

**Floating button → compact state → expanded assistant**

-   Desktop: floating panel.
-   Mobile: sheet/full-screen.
-   Potential action chips can navigate to relevant portfolio content.

## Theme Transition

-   Transition surfaces, typography, borders, and ambient gradients
    together.
-   Consider the View Transition API for a polished light/dark
    transformation.

## Interaction Restraint

Aim roughly for: - **80%:** subtle product-style motion - **20%:**
expressive/narrative motion

Major scroll-driven sequences should communicate something meaningful.

------------------------------------------------------------------------

# Implementation Feedback

Your proposed order is strong. I would make a few adjustments:

## Treat Steps 2--5 as One Foundation Phase

Architecture, tokens, gradients, themes, and components influence one
another. The dependency should roughly be:

**Architecture → Tokens/Themes → Gradient System → Components → Pages**

## Add Content Architecture Early

Define a project/case-study data model before the listing/detail pages.
This makes filtering, localization, featured-work carousels, related
projects, and the AI knowledge base easier to maintain.

## Validate With a Real Case Study Earlier

Don't build every generic case-study component in isolation. Build the
reusable system, then use K Lab to stress-test it because it contains
the widest variety of content and media.

## Design Motion Before Adding Motion

Setting up Motion at step 7 is good, but define the motion philosophy
during the UI-guidelines phase. This prevents animation from becoming
miscellaneous effects added at the end.

## Keep the AI Assistant Late

The assistant belongs near the end. The portfolio should be complete
without it, and finished content gives the RAG system a stable source of
truth.

## Suggested Phases

**Phase 1 --- Foundation**\
Next.js → architecture → tokens/themes → gradients → components → i18n →
motion

**Phase 2 --- Shell**\
Navigation → footer → global responsive behavior

**Phase 3 --- Core Pages**\
Homepage → About → Contact

**Phase 4 --- Portfolio System**\
Case-study data model → listing → detail system → real case studies

**Phase 5 --- Enhancement**\
Advanced scroll sequences → media polish → AI assistant →
accessibility/performance/SEO QA

# Motion Architecture

Treat motion as part of the design system rather than adding one-off animation values throughout individual pages.

The hierarchy should be:

**Motion Tokens → Motion Primitives → Component Motion → Bespoke Narrative Motion**

## 1. Motion Tokens

Create a small TypeScript foundation for shared timing, easing, spring, and transition values.

Suggested structure:

```text
motion/
├── tokens.ts
├── variants.ts
├── Reveal.tsx
├── Stagger.tsx
├── Parallax.tsx
└── MotionProvider.tsx
```

Example token categories:

```ts
export const duration = {
  fast: 0.15,
  default: 0.3,
  slow: 0.6,
}

export const easing = {
  standard: [0.4, 0, 0.2, 1],
  enter: [0, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1],
}

export const transition = {
  default: {
    duration: duration.default,
    ease: easing.standard,
  },
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
}
```

Use semantic names that describe the purpose of motion rather than implementation details.

## 2. Reusable Motion Variants

Define common variants such as:
- Reveal
- Fade
- Scale
- Stagger
- Enter / Exit
- Shared spring transitions

Example:

```ts
export const reveal = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.default,
  },
}
```

Avoid repeatedly defining arbitrary values such as `opacity`, `y`, duration, and easing inside page components.

## 3. Motion Primitive Components

Create thin wrappers around repeated animation behavior.

Initial primitives should stay small:

### `Reveal`
For standard scroll-triggered content entrances.

```tsx
<Reveal>
  <SectionHeading />
</Reveal>
```

### `Stagger`
For groups whose children should enter sequentially.

```tsx
<Stagger>
  <Reveal><Card /></Reveal>
  <Reveal><Card /></Reveal>
  <Reveal><Card /></Reveal>
</Stagger>
```

### `Parallax`
For subtle decorative or photographic depth where appropriate.

Do not create a large library of motion wrappers upfront. Start with a few real repeated needs and add abstractions only when repetition emerges.

## 4. Component-Level Motion

Motion that is intrinsic to a UI component should live inside that component.

Examples:
- `CaseStudyCard` owns its hover/focus/media behavior.
- `Dialog` owns its enter/exit transition.
- `Sheet` owns its mobile transition.
- `Navbar` owns its scroll-state transition.
- `MediaLightbox` owns its expansion and navigation transitions.
- `Carousel` owns drag/swipe and slide transitions.
- `ThemeToggle` owns its interaction feedback.

Consumers should not need to wrap these components in additional animation utilities to achieve their expected behavior.

## 5. Bespoke Narrative Motion

Large storytelling interactions should remain custom components rather than being forced into generic abstractions.

Examples:

```text
case-studies/
├── KLabSystemSequence.tsx
└── KLabRebrandSequence.tsx
```

These components can consume global motion tokens while owning their specific choreography.

Examples include:
- **Tokens → Primitives → Components → Patterns → Products**
- **K Lab Website V1 → Design Tokens → V2**

Do not build a universal abstraction for every possible scroll-driven sequence.

## 6. Reduced Motion

Respect `prefers-reduced-motion` throughout the system.

Expected behavior:
- Reveals become instant or nearly instant.
- Parallax is disabled.
- Ambient gradients stop or simplify.
- Large scroll-driven sequences fall back to clear static states.
- Essential state changes remain understandable without animation.

Centralizing motion behavior should make reduced-motion support a system-level concern rather than something implemented page-by-page.

## 7. Motion Rules for AI-Assisted Development

Document motion conventions so coding agents follow the same system.

Agents should:
- Reuse existing tokens and variants before creating new ones.
- Reuse motion primitives for common behavior.
- Keep intrinsic motion inside the relevant UI component.
- Avoid arbitrary durations, easing curves, offsets, or springs.
- Avoid adding animation solely because a section can be animated.
- Respect reduced-motion behavior.
- Reserve bespoke scroll choreography for interactions that communicate a meaningful concept.

## 8. Motion Design-System Principles

1. Motion should communicate hierarchy, state, spatial relationships, or meaning.
2. Most transitions should use shared timing and easing tokens.
3. Entrance animations should be subtle and generally occur once.
4. Strong scroll-driven sequences should explain something.
5. Motion should never delay or block interaction.
6. Components should own motion intrinsic to their behavior.
7. Reduced-motion preferences must always be respected.
8. Consistency matters more than the number of animation styles.

The goal is for motion to follow the same systems approach as the rest of the portfolio:

**tokens → primitives → reusable patterns → bespoke compositions**

