# Architecture

Guidelines for how this portfolio is organized. Visual and interaction rules live in [ui-guidelines.md](./ui-guidelines.md). The build sequence lives in [portfolio-build-interaction-plan.md](./portfolio-build-interaction-plan.md).

Published pages are composed from content JSON and the design system in `src/ui`. Domain logic, external integrations, and mutations live in `src/contexts` and follow [backend-architecture.md](./backend-architecture.md).

## Stack

- Next.js App Router and TypeScript
- Tailwind CSS v4
- Content as JSON under `src/content`, loaded by `src/lib/content`
- Motion for React, `next-intl`, and theme tokens arrive in later foundation steps

Path alias: `@/*` maps to `src/*`.

## Directory map

```text
src/
  app/                     routes, layouts, metadata
  content/                 source-of-truth JSON
    case-studies/          one file per case study
    profile.json
    experience.json
    testimonials.json
  lib/content/             types and loaders for published content
  contexts/                domain, application, infrastructure, dependency container
  ui/
    components/            shared primitives
    patterns/              portfolio compositions
    shell/                 navigation, footer, providers
    motion/                tokens, variants, primitives
    case-studies/          detail sections and bespoke sequences
public/
  images/                  photography, portraits, screenshots
  videos/                  screen recordings
  fonts/                   self-hosted fonts, when needed
```

Add a folder when a real repeated need shows up. Keep one-off page sections next to the route until a second page needs them.

## Layers

| Layer | Owns | Does not own |
| --- | --- | --- |
| `src/content` | Copy, metadata, media references | Markup, styles, motion, business rules |
| `src/lib/content` | Types, reading JSON, published/featured filters | Rendering, external I/O |
| `src/contexts` | Domain models, application services, repositories, errors | JSX, Tailwind, page copy |
| `src/app` | Routes, metadata, loading content, composing the page | Reusable primitives, direct repository access |
| `src/ui` | Components, motion, shell | Content authoring, domain rules |

Published content flows in one direction:

```text
JSON → getCaseStudy / getProfile / … → page → UI props
```

Pages load that content on the server and pass it down. Client components receive props. They do not import JSON or call the filesystem loaders.

Backend operations use the contexts flow. The full rules for models, value objects, domain services, repository interfaces, application services, infrastructure, mappers, dependency injection, `Result<T>`, and `DomainError` are in [backend-architecture.md](./backend-architecture.md).

```text
User action → server action or hook → application service → repository → external system
```

Hooks resolve services from the dependency container with `useMemo`. They do not construct repositories or call `container.get()` at module scope. Pages call server actions for mutations and remote reads. Server actions resolve the application service. They do not import infrastructure implementations.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/contact` | Contact |
| `/work` | Case study listing |
| `/work/[slug]` | Case study detail |

`app/**/page.tsx` files stay thin: load content, export metadata, render a view or a short composition of patterns. Interactive pieces are client components in `src/ui`.

Locale routing (`next-intl`) is added before large amounts of page copy are written. Until then, user-facing strings that are not content JSON stay in one place per page so they can move into message files later.

## Component organization

Build shared UI before finishing pages. Two levels:

**Primitives** in `src/ui/components/` — generic, no portfolio copy:

Button, Badge, Card, Section, Container, Tabs, Dialog, Sheet, Tooltip, Carousel, MediaLightbox, ThemeToggle, and the few form controls the contact page needs.

**Patterns** in `src/ui/patterns/` — portfolio compositions that use primitives:

CaseStudyCard, FeaturedWork, ExperienceItem, Testimonial, MediaCarousel, AmbientGradient, SectionHeading, Stat, CapabilityTags.

Shell chrome (floating navigation, mobile sheet, footer, theme and locale controls) lives in `src/ui/shell/`.

A pattern owns the motion that is part of its behavior. Callers pass content and variants. They do not reimplement hover, drag, or enter/exit on the outside.

Promote a local component into `components/` or `patterns/` when a second page needs the same behavior. A visual tweak is a variant or a token change, not a second component.

### Naming

| Kind | Pattern | Example |
| --- | --- | --- |
| Component file and export | PascalCase, file matches export | `CaseStudyCard.tsx` |
| Props | `{Name}Props` | `CaseStudyCardProps` |
| Hook | `use` + PascalCase, camelCase file | `useTheme.ts` |
| Content type | PascalCase in `types.ts` | `CaseStudy`, `MediaAsset` |
| Content file | kebab-case slug | `k-lab.json` |
| Route folder | kebab-case URL segment | `work/[slug]` |

One component per file. Colocate a component-only helper in the same folder. Shared types for content stay in `src/lib/content/types.ts`.

## Case study architecture

`CaseStudy` in `src/lib/content/types.ts` is the contract for listing, detail, featured work, related projects, and later the assistant knowledge base.

Each published study is one JSON file in `src/content/case-studies/`. Loaders expose:

- `getCaseStudies()` — published studies, newest year first
- `getCaseStudy(slug)`
- `getFeaturedCaseStudies()` — published and `featured`

### Fields

Required for every published study: `slug`, `title`, `summary`, `year`, `role`, `capabilities`, `featured`, `published`, `hero`, `overview`.

Optional, in the order the detail page renders them when present: `client`, `scope`, `problem`, `process`, `decisions`, `results`, `sections`, `gallery`, `relatedSlugs`.

`sections` is the extension point for a study that needs a block the shared template does not name. A section has `id`, `title`, `body`, and optional `media`. Use it for custom narrative. Do not fork the detail page per project.

### Capabilities

```text
product-design | design-systems | frontend-engineering | ai | brand | research
```

The listing filters on these values. Cards and filters read the same union. Adding a capability means updating the type, the content, and the filter labels together.

### Detail composition

`/work/[slug]` renders one template, in this order, skipping empty optional blocks:

1. Hero (`hero` media, title, year, role)
2. Overview, role, and scope
3. Problem
4. Process
5. Decisions
6. Results
7. Custom `sections`
8. Gallery (images, video, tall screenshots, captions, lightbox)
9. Related work (`relatedSlugs` resolved through the loader)

Media on any block uses `MediaAsset` (`src`, `alt`, `kind`, optional `caption`, `width`, `height`). `kind` is `image`, `video`, or `tall-screenshot`. Presentation rules for each kind are in the UI guidelines.

### Bespoke sequences

A scroll-driven sequence that explains one project stays a custom component under `src/ui/case-studies/`. It may use motion tokens. It is not a generic primitive.

Planned examples:

- `KLabSystemSequence` — tokens, primitives, components, patterns, products
- `KLabRebrandSequence` — site v1, design tokens, site v2

Mount these from that study’s `sections` (or a dedicated optional field if the sequence is not representable as body plus media). Other studies use the shared template only.

Build the template, then implement one real study against it before treating the system as done. K Lab is the stress test: it has the widest mix of media and custom sequences.

## Motion architecture

Motion is part of the system. The code hierarchy matches the design hierarchy:

```text
motion tokens → variants and primitives → component motion → bespoke sequences
```

```text
src/ui/motion/
  tokens.ts            duration, easing, spring, transition
  variants.ts          reveal, fade, scale, stagger, enter/exit
  Reveal.tsx
  Stagger.tsx
  Parallax.tsx
  MotionProvider.tsx
```

Token names describe purpose (`duration.default`, `easing.enter`), not a one-off curve. Page code uses tokens and primitives. It does not declare new durations, offsets, or springs for a single section.

`MotionProvider` reads `prefers-reduced-motion` once and exposes it to primitives. Reduced motion is a property of the provider, not a check copied into every page.

Component-owned motion (card hover, dialog enter/exit, sheet, navbar scroll state, lightbox, carousel, theme toggle) lives inside that component and still consumes the tokens.

Start with `Reveal`, `Stagger`, and `Parallax`. Add another primitive only after the same behavior appears in more than one place.

## Theme and styles

Semantic color, type, radius, shadow, and surface tokens will live as CSS variables in `src/app/globals.css`, with light and dark values. Components reference those tokens through Tailwind. Raw hex values stay in the token file.

`AmbientGradient` is a pattern, not a one-off background on each page. Gradient variants (page, hero, button, text, card glow) are defined once and switched with the theme.

## Internationalization

`next-intl` owns locale routing, navigation labels, page copy, metadata, and assistant strings. Project facts (roles, case study bodies, testimonials) stay in content JSON so listing, detail, and the assistant share one source. When a string must change per locale, the JSON value becomes a message key rather than a second copy inside a component.

Layout direction uses logical CSS properties so a future RTL locale does not require a restyle. See the UI guidelines.

## State

Page state is the URL plus content JSON. Domain and server state follow [backend-architecture.md](./backend-architecture.md): application services return `Result<T>`, repositories throw domain errors, and hooks or React Query hold the client copy of that result.

| Need | Where it lives |
| --- | --- |
| Which study, which locale | Route |
| Theme | A small client store or cookie, applied on `<html>` before paint |
| Carousel index, dialog open, lightbox slide | Component state |
| Capability filter | URL search param, so a filtered listing can be shared |
| Assistant conversation | Local UI state, later |

Do not add a global client store for content that the server already loaded.
