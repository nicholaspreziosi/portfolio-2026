# Portfolio

Personal portfolio site for Nick Preziosi.

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS
- ESLint and Prettier

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                 | Description                  |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start the development server |
| `npm run build`        | Create a production build    |
| `npm run start`        | Serve the production build   |
| `npm run lint`         | Run ESLint                   |
| `npm run lint:fix`     | Fix ESLint issues            |
| `npm run format`       | Format files with Prettier   |
| `npm run format:check` | Check Prettier formatting    |

## Project structure

```text
src/
  app/                 App Router pages, layout, and global styles
  content/             Source-of-truth content (case studies, profile, etc.)
  lib/content/         Typed loaders for that content
  ui/                  Shared UI (added in later phases)
public/
  images/              Case study, about, and photography assets
  videos/              Screen recordings and motion assets
  fonts/               Self-hosted fonts, if needed
```
