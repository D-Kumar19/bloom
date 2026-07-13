# Bloom

Build and share digital bouquets with personal notes.
Everything stays in the URL. No account needed.

## Tech Stack

- Next.js 16 + TypeScript
- Tailwind CSS
- Framer Motion
- lz-string (URL encoding)

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/           → pages and API routes
components/    → React components by domain
lib/           → business logic, data, utilities
public/        → static assets (flower/greenery PNGs)
```

Tests are colocated as `*.test.ts` / `*.test.tsx` next to the files they cover.

## Scripts

```bash
pnpm dev          # development server
pnpm build        # production build
pnpm test:run     # run tests once
pnpm lint         # ESLint
pnpm type-check   # TypeScript
```
