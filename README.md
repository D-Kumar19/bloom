# Bloom

Bloom is a small web app for building and sharing digital bouquets. Pick a pre-made bouquet, write a note, choose a backdrop and optional ambient sound, then share a link. The whole bouquet lives in the URL. No account, no database for the message itself.

Sending flowers over the internet is objectively silly. It is also, occasionally, exactly right.

## What it does

- Browse 15 bouquets across four moods and write a rich-text note on one of nine card styles
- Pick a still or animated backdrop plus optional ambient sound
- Share a compressed link; recipients tap through a staged reveal (bouquet, card, message)
- Save the moment as an image; soundtrack starts on the recipient's first tap

## Try it

```bash
pnpm install && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## How the link works

Bloom encodes the full bouquet state into the `?b=` query parameter using [lz-string](https://github.com/pieroxy/lz-string). The server never stores your message. That is why links do not expire: the bouquet is the link. If you change `NEXT_PUBLIC_SITE_URL`, copied links point at whatever origin you configured, not necessarily where you built the bouquet.

## Deploy

**Vercel (recommended):** push to GitHub, import at [vercel.com/new](https://vercel.com/new), set `NEXT_PUBLIC_SITE_URL` to your production domain, deploy. CI runs type-check, lint, test, and build via `.github/workflows/ci.yml`.

**Docker:**

```bash
docker build -t bloom .
docker run --rm -p 3000:3000 -v bloom-data:/app/data bloom
```

Mount `/app/data` if you want the landing-page counter to survive restarts.

## Project layout

```
app/
  page.tsx              Landing
  create/               5-step builder
  bouquet/              Recipient reveal + OG image route
  pre-release/          Footer links not ready for launch
  api/count/            Bouquet counter API
components/
  builder/              Gallery, message form, theme picker, share step
  bouquet/              Hero, hanging frame, soundtrack control
  backdrop/             Themes, decorations, petals, preview layers
  cards/                Message cards
  landing/              Pre-release homepage sections
lib/
  bouquets/             15-bouquet catalog
  sharing/              URL encode/decode, share copy
  themes/               11 backdrops (5 still, 6 animated)
  message/              Rich text, validation, inspiration
  soundtracks/          Ambient audio playback
public/
  bouquets/             Hero + thumbnail images
  sounds/               Ambient loops
data/
  bouquet-count.json    Landing-page counter (filesystem)
config/
  eslint, prettier, vitest
```

Tests live next to source as `*.test.ts` / `*.test.tsx`.

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm test:run` | Run tests once |
| `pnpm lint` | ESLint |
| `pnpm type-check` | TypeScript |

## Environment variables

Copy `.env.example` to `.env.local` for local development.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Origin used in copied share links and OG metadata. Set this to your production domain before sending links to real humans. |

## Status

Pre-release footer areas intentionally route to `/pre-release`. The flower catalog and extra landing sections are in the tree but not linked from the main nav yet.

## License

Private / pre-release.
