# Bloom project notebook

Start here when resuming work. This is the durable record of findings, open work,
and design decisions; chat history is not required to understand the next step.

## Current state

Updated: 2026-10-23. Original audit baseline: `4d610ab`.

- The account-free bouquet creation, sharing, and recipient reveal flow exists.
- The audit identified 13 findings: four high and nine medium.
- Reliability work is merged and deployed; v0.0.4 is published. CI01/B01-B10
  are closed with recorded local/hosted evidence and owner production sign-off.
  Redis counting and once-only copying are working. O01 retains the separate
  operational abuse-protection checks. See [counter policy](./counter.md)
  and the [backlog](./backlog.md) for evidence and limitations.
- **Current visual direction (owner decision, 2026-10-22):** keep the released
  UI and improve its experience incrementally. The "Color, delivered" experiment
  was rejected; do not merge its replacement UI. Preserve rounded controls,
  softness, and smooth interactions. D01-D06 have been rephrased and reopened
  for experience polish, not a wholesale redesign.
- Keep the current source layout. No framework migration or rewrite is approved.
- Email-ready sharing and optional accounts with a private animated bouquet
  journal are approved as final-phase standout features, after core fixes,
  experience polish. See the backlog; neither is being implemented now.
- Product discovery now includes editable occasion starters, clearer descriptions,
  gentle facts/humor, personal details, curated collections, and a final-phase
  owned domain (S03 deferred on 2026-10-22; keep the free Vercel address).
  Photo/voice uploads and pricing remain conditional research,
  not approved infrastructure or paid-feature commitments.
- Simplicity means a clear pipeline, not a three-screen target: five steps are
  welcome with one primary purpose each. Avoid multiple equal selection tasks
  disguised as one step. Advanced controls and future media must not burden the
  default experience; feature candidates may be dropped if they do.
- Keep the five-step flow; no redesign, accounts, email sending, or other
  deferred product features were added in the P0 implementation.

## Where things live

- [Audit](./audit.md): evidence, limitations, source entry points, and
  reconciliation of the owner's external 42-item checklist.
- [Backlog](./backlog.md): the single checklist for implementation status.
- [Experience improvement plan](./redesign-plan.md): current polish direction,
  approval boundaries, and clearly separated historical redesign evidence.
- [Product direction](./product-direction.md): purpose, feature evaluation,
  staged rollout, and media/cost boundaries.
- [Glossary](./CONTEXT.md): gift, occasion starter, keepsake, and journal terminology.
- Public contact now has an owner-approved address and a real Contact page.
  Templates are tracked by L01; standalone Wander destinations by L10.
  Their footer links now lead to matching sections on a shared Explore guide,
  with builder and contact links rather than unavailable labels.

## Resume here

v0.0.4 is published. CI01/B01-B10 are closed with recorded local/hosted
verification and owner production sign-off; O01 tracks remaining operational
hardening. Earlier deployment-pending notes below are historical.

Current branch: `feat/experience-polish`, based on released main, not the
rejected replacement UI. A first D01-D06 batch improves contrast, rounded
selection controls, keyboard mood navigation, full portrait fit, and access to
sharing. See the [batch evidence and remaining checks](./redesign-plan.md#first-polish-batch---2026-10-23).
Next: finish local acceptance and obtain owner before/after preview review
before extending or merging. Do not repeat the full redesign. A sidebar is a
candidate only if it solves observed friction.
Only S03 is deferred; F01-F10 and R01-R02 remain open later work.

## Keeping this useful

- Put new actionable work in the backlog, not a second TODO list.
- Keep audit IDs stable. Record subsequent evidence without rewriting history.
- Check an item only after its acceptance criteria are verified. Record the
  date, commit or PR if available, and a concise verification result.
- If work stops mid-task, add a dated handoff below: completed work, remaining
  work, blockers, and the next exact action. Never put credentials here.
- Store future approved visual studies alongside these documents only when
  they exist; do not create empty design hierarchies in advance.

## Audit handoff: 2026-10-19

Completed: project audit, production counter reproduction, local boundary/failure
checks, owner direction interview, durable documentation, and product feature
discovery. Proposed feature ideas are distinguished from approved implementation.
The external Claude checklist has been deduplicated against the baseline;
existing behavior is not relisted as missing work, and speculative additions
live in the backlog's deferred standout parking lot.

Open blockers: production counter exception needs deployment logs; actual
composition, asset treatment, and motion design need approval.

Next actions: inspect the Vercel counter failure without exposing secrets;
prepare two worktable composition studies rather than generating a full site.

## P0 implementation handoff: 2026-10-19

- B02 saves every partial draft and actual step in this browser, with a 24-hour
  lifetime from the last edit. Restoration does not refresh the timestamp.
  Valid preset/mood entry parameters are consumed once (other query parameters,
  history state, and hash are kept), so reloading cannot reapply the starter
  over subsequent edits.
  Explicit new-bouquet clears it. A persistent on-screen warning explains when
  browser storage is blocked; the current in-memory gift remains usable.
- B03 keeps over-limit notes intact rather than silently cutting them off.
  Above 200 words, the counter shows the excess and Continue is disabled. Reduce
  the note to continue. Rich paste normalizes unsupported markup; supported
  bold/italic/span formatting and line breaks stay in the shared gift.
- B01 uses Redis in production, never a local writable-file substitute. Redis
  failure yields an unavailable statistic and logged API 503, not invented
  zero or a failed homepage. The upstream request times out after three seconds;
  client recording is bounded at four seconds and never delays copy success.
  A failed/ambiguous request is not automatically retried, since it may already
  have incremented upstream. Full server-side retry idempotency and deciding
  what the count actually represents remain B05, not claims of delivery.
- Runtime checks used a local standalone production build and an isolated,
  SQLite-backed Redis-protocol HTTP fixture. Sequential GET/POST/GET worked;
  30 concurrent POSTs returned 30 unique consecutive increments; a restarted
  app retained the count. An outage returned 503 while homepage remained 200;
  a stalled read failed in about 3.01 seconds. Browser copy confirmation took
  about 30 ms while that upstream stalled.
- Native Chromium checks covered partial reload, word-limit boundaries with
  real clipboard paste, blur, preserved over-limit drafts, rich formatting all
  the way to recipient view, preview return, explicit new/reset, IME
  composition/commit via CDP, and blocked-storage warning/continued navigation.
  This is not Safari/iOS/Android certification or a substitute for B10.
- Automated checks: 47 test files / 198 tests, type check, lint, and production
  build. On this machine's Node 26, tests use
  `NODE_OPTIONS=--no-experimental-webstorage npm run test:run`; CI still uses
  the existing Node 20 configuration.

### Completing B01 in production

B01 is pending deployment verification by owner decision (2026-10-19).
Resume these checks when deploying; local implementation is not a completed
production persistence check.

1. Inspect the existing deployment's `/api/count` function logs and Vercel
   integration/environment settings. Record the redacted cause in this notebook.
   Missing Redis is a likely explanation, not an established production exception.
2. Connect an Upstash Redis store with a **writable** REST token. Configure one
   complete server-only pair: `KV_REST_API_URL` + `KV_REST_API_TOKEN`, or
   `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`. A partially configured
   KV pair is an error, even if an Upstash pair is also present. Do not use
   `NEXT_PUBLIC_` for credentials or paste credentials into documentation/chat.
   See [environment instructions](../.env.example).
3. Enable the variables for the intended environment and redeploy this code.
   Use a separate Redis store for Preview/testing so load tests do not inflate
   the real public count. No infrastructure was provisioned during this session.
4. Verify real Redis-backed GET n, POST n+1, and fresh GET n+1; check that the
   API uses `Cache-Control: no-store`. Repeat across independent/cold function
   instances and exercise concurrent increments in the test environment.
   A fresh browser alone is not evidence of a cold server instance.
5. Check homepage and footer rendering with Redis configured at build/runtime;
   check controlled outage behavior and both clipboard actions. Static builder
   pages may otherwise retain their build-time statistic; freshness and honest
   counter semantics remain B05.
6. Record the existing count before deploying a new version. Keep the same Redis
   store and `bouquet:count` key, verify the total survives the deployment, then
   verify the next share increments from that total rather than starting at zero.
   Do not reset the real count for this check.
7. Run B10's deployed builder/recipient checks, including actual mobile browsers,
   then check off B01 only with the deployment and verification evidence recorded.

Access blocker: no authenticated Vercel CLI/project connection or readable
deployment logs were available. No production credentials were accessed or
changed. The live website is still running its previously deployed code.

## Phase-two implementation handoff: 2026-10-19

- B04 uses the actual gift components for browser-side PNG capture. Rich
  formatting, line breaks, font choices, borders, and dark/light backgrounds
  survive; long names and unbroken notes wrap. The recipient's surrounding
  sender text also wraps rather than being clipped on narrow layouts.
  Motion stops at its initial state; the blurred watercolor overlay and audio
  are omitted. Capture-clone color conversion accommodates Tailwind's modern
  colors without changing the live gift. Missing-image failures reach the
  error toast and release temporary DOM/resources.
- B06 removes the unowned-domain default/override. Browser links stay on their
  current deployment; server metadata follows the configured canonical or
  Vercel origin, with the actual existing live site as fallback. The owner
  selected generic social previews: no names or note text. Raw production-build
  HTML and the 1200 x 630 OG PNG were checked independently; personal query
  parameters did not change the OG image. Local copy-handler output used the
  current local origin. Real deployed URL verification remains open.
- B07 adds real About and Privacy pages. Unavailable footer sections are
  explicitly nonlinks, with working builder choices distinguished from missing
  standalone guides. Contact was initially unavailable; the owner supplied
  a public address on 2026-10-22, so a Contact page and privacy mail link now
  replace that placeholder. Privacy documents query-link exposure, local draft retention,
  aggregate counter limitations, and absence of encryption/expiry/revocation.
  Gift responses request no-referrer and no indexing; those are not access
  controls.
- B08 restores dialog focus, traps keyboard focus, makes background content
  inert, closes on Escape, and restores the opener. Native Chromium checks
  passed. Primary-button text measures 6.05:1 in light and dark appearance.
  Nested note/reveal roles were removed. These targeted fixes are not a
  whole-site accessibility certification or an assurance for arbitrary
  user-selected note colors.
- B09 propagates playback failure and runtime media errors, clears false
  Playing state, and offers a retry message without duplicating it in every
  option. A blocked rain request failed honestly; after restoring the request,
  retry played, and choosing silence stopped it. Tests cover stale callbacks,
  late errors, cleanup, and changed recipient soundtrack props.
- Final automated validation: **51 test files / 220 tests passed**, type
  check, lint, production build, and whitespace checks passed. Tests still
  emit non-failing React `act` warnings in builder/step-transition checks;
  the build logs controlled missing-Redis errors because Redis is not configured.
- Runtime checks used local Chromium and a local standalone production build.
  Actual generated PNG blobs were inspected for midnight/double border,
  watercolor/cherry/dashed border, and rose-gold/candlelight/dotted border,
  including rich text and long names. The final PNG was 1440 x 2254.
  A narrow emulated layout check is not real iOS/Android verification, and the
  browser tool did not verify writing the downloaded file to a device's disk.
- No new creation steps, product features, packages, accounts, uploads, or
  visual redesign were introduced. No changes were committed or deployed.
  B01, B05, deployed B06 acceptance, and B10 remain open.

## Design discovery handoff: 2026-10-20

- D01 researched four external references and assessed all 15 existing bouquet
  portraits. No reference artwork was copied or licensed for use.
  Images have baked-in backgrounds; the peony's clouds, tropical vase, and
  lily's fixed sympathy text prevent a universal cutout/unwrapping assumption.
  Existing asset provenance is still unverified.
- The owner approved the reference vocabulary with an explicit move away from
  rustic/paper-heavy visuals toward a more colorful, contemporary treatment.
  Earlier paper/kraft studies are historical exploration, not a final palette.
- D02 contains two standalone HTML compositions, not new application routes:
  graphic gallery/paired recipient (A), and single-object presentation/separate
  reading field (B). Both include desktop/mobile, birthday/sympathy, short/long
  notes, and companion loading/invalid-link specimens.
- Reference-board mobile/desktop layout, image loading, and focused axe checks
  passed. Composition checks cover 24 frame/content combinations plus targeted
  accessibility and keyboard checks. This does not validate a redesigned
  builder, dark mode, gift decoding, audio, or export; none has been rebuilt.
- Open [the comparison](./design/compositions.html) in a browser. Use its
  Concept, Screen, Example, Message, and Frame controls.
  Review-only buttons are explicit; no gift or draft is created.
- D02 awaits owner selection/revision. D03-D06 remain unstarted.
  No packages, application changes, commits, or deployments in this batch.
