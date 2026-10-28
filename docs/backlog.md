# Open work

Updated: 2026-10-23. CI01 and B01-B10 are closed. Reliability changes are
merged and deployed to production; the owner accepted the release checks.
Closure combines recorded local/hosted evidence with owner production sign-off,
not a claim that every device or operational scenario was independently tested.
Remaining operational hardening is tracked separately under O01.
Evidence and caveats: [audit](./audit.md). Design decisions:
[redesign plan](./redesign-plan.md).

Priority is execution order, not audit severity. One item may close multiple
findings only when every linked acceptance condition is met.

Owner constraint: keep a clear pipeline with one primary purpose per step.
Five steps are acceptable; fewer screens are not the goal. Avoid hiding two
full decisions (such as backdrop and soundtrack catalogs) inside one step.
All optional feature ideas
are subject to the [simplicity constraint](./product-direction.md#simplicity-constraint---owner-decision-2026-10-19).
Do not add photo/voice stages everyone must visit or skip. Advanced controls
and opt-in audio must not compete with a step's primary task.

## Documentation polish

- [x] DOC01 - Give the public README a visual, useful project introduction.
  **Completed: 2026-10-22.** Uses existing bouquet artwork, a scannable gift
  walkthrough, emojis, and expandable developer/deployment details. Explain
  the implementation depth without presenting planned features as shipped.
  Verified all 17 repository-relative links/artwork paths and clean diff
  whitespace; checked product claims against implementation documentation.
  Preserves the production-counter caveat and privacy boundaries. No
  application redesign or new product behavior is included. Final visual
  review in GitHub's renderer remains part of publication.
- [x] DOC02 - Reformat and improve the public README.
  **Done 2026-10-28 at the D/L release checkpoint (PR #15).** Removed the
  stale pre-release/redesign banner and unverified-counter claims; added
  Templates, the Wander discovery pages, the one-button share step, link
  previews, lighter pages, and the counter Firewall rule; replaced the roadmap
  with shipped vs. planned work. Added a composed bouquet banner and phone
  screenshots in Bloom's palette (owner feedback). Links checked against
  production; shipped in v0.0.5. Revisit the README at later release
  checkpoints if the product changes.

## Release automation

- [x] CI01 - Harden verification and automate reviewed draft releases.
  **Completed: 2026-10-22; hosted verification passed.**
  Pin actions to verified full commit SHAs, limit
  permissions, bound job duration, and retain frozen installs, type-check,
  lint, tests, Next.js build, and the main-branch Docker build. Add weekly
  action-update proposals and a main-only manual draft workflow that requires
  successful push CI for the exact target commit, rejects duplicate versions,
  generates notes, and verifies that the release remains a draft. No automatic
  publication or Vercel deployment. Actionlint v1.7.7 passed for both
  workflows. Sixteen local shell simulations passed: version/branch/CI/API
  rejection paths, stable/prerelease creation flags, and draft/target/version
  verification. SHA pins, permissions, timeouts, checkout credential settings,
  and shell syntax were checked.
  See [release instructions](./releases.md).
  **Hosted follow-up, 2026-10-22:** the first PR run passed install,
  type-check, lint, and tests, then failed in Turbopack's Google Fonts
  resolver. A Webpack trial also failed in the font loader, so it was not
  retained. Existing Latin font families are now bundled with their open-font
  licences and loaded through next/font/local, removing build-time Google
  downloads/parsing. Local retest passed: 51 files / 246 tests, type-check,
  lint, and production build; all 11 bundled WOFF2 assets returned HTTP 200.
  Hosted retesting passed on commit `7bd19be`: PR CI verification and Vercel
  preview deployment succeeded. After PR #3 merged, main push
  [CI 39773818563](https://github.com/D-Kumar19/bloom/actions/runs/39773818563)
  passed verification and Docker for `22d74bb`.
  [Draft workflow 39774086677](https://github.com/D-Kumar19/bloom/actions/runs/39774086677)
  created and verified the `v0.0.4` draft for that exact commit.
  Owner subsequently published it on 2026-10-22 and approved closure.

## P0 - Reliability before a visual rollout

- [x] B01 - Durable counter and controlled failure handling.
  **Closed by owner production sign-off: 2026-10-22.**
  Owner confirmed the deployed Redis counter is working after merge and
  explicitly accepted B01. Detailed before/after totals and cold-instance
  traces were not supplied; do not present these as independently measured.
  Covers ISSUE-001, ISSUE-004, ISSUE-013.
  Entry points: [storage](../lib/counter/storage.ts),
  [API](../app/api/count/route.ts), [homepage](../app/page.tsx),
  [footer](../components/ui/Footer.tsx).
  Inspect deployment logs first; establish exact failure. Production uses atomic
  durable storage, never filesystem/tmp/memory persistence. Verify GET n, POST
  n+1, fresh GET n+1 across cold instances and concurrent writes. A failed read
  must not take down the homepage; expose unavailable state and log failures.
  Clipboard success must not wait indefinitely on a nonessential counter.
  **Progress:** production refuses filesystem fallback; supports complete KV or
  native Upstash REST credential pairs, atomic Redis INCR, uncached reads, a
  three-second upstream timeout, controlled 503 responses, unavailable UI, and
  operational logging. Clipboard confirmation is independent of counting;
  simultaneous identical requests in a tab are coalesced. Development-only file
  writes are serialized within one process and published by rename.
  Local HTTP protocol-fixture checks passed: 30 unique concurrent increments,
  fresh reads, persistence across an app restart, upstream error/timeout, and
  homepage HTTP 200 during outage. The fixture used SQLite behind a Redis-shaped
  API, **not actual Redis or Vercel**. The later safe diagnostic identified
  `redis_url_invalid`; correcting the configured REST URL restored counting.
  For future upgrades, follow the
  [production completion steps](./README.md#completing-b01-in-production).
  **Owner preview check, 2026-10-22:** after correcting the Redis REST URL,
  the deployed counter showed 1. The owner configured the same Redis database
  for Production, Preview, and Development; preview activity therefore
  contributes to the shared total. This confirms basic deployed connectivity
  and counting, not production upgrade persistence, concurrency, deduplication,
  or rate-limit acceptance. Later owner production sign-off closes B01/B05;
  remaining operational checks are tracked in O01.

- [x] B02 - Recover real in-progress drafts.
  Covers ISSUE-002. Entry points: [state](../hooks/useBouquetState.ts),
  [draft storage](../lib/builder/draftSession.ts).
  Restore edits and actual step after reload/navigation, including incomplete
  sender/recipient/message fields. Preserve 24-hour expiration and explicit
  start-new behavior. Specify blocked-storage behavior without crashing.
  **Verified locally 2026-10-19:** partial names/message and actual step survive
  reload; all builder edits autosave after restoration without clobbering the
  existing envelope. Expiry, legacy migration, invalid-step rejection, and
  Strict Mode initialization have regression coverage. Preset/mood URLs
  initialize once, so reload restores subsequent edits rather than reapplying
  the starter. Start-new clears without
  re-saving the discarded draft. Blocked reads/writes are tested; the builder
  stays usable in memory and displays a persistent recovery warning. Native
  browser checks covered partial reload, preview return, clear/reload, and a
  blocked-storage warning. No deployed verification yet.

- [x] B03 - One truthful message model across editor, preview, and link.
  Covers ISSUE-003, ISSUE-007.
  Entry points: [editor](../components/builder/RichMessageEditor.tsx),
  [text helpers](../lib/message/messageRichText.ts),
  [word helpers](../lib/message/messageWords.ts).
  Preserve line boundaries; enforce the same 200-word rule in all surfaces.
  No visible-but-unsent text or silent deletion. Verify 199/200/201 words,
  newline-separated words, typing, actual paste, blur, IME, and formatting.
  **Owner decision and verification 2026-10-19:** never truncate over-limit
  edits. Keep all words and formatting in the editor, preview, and local draft;
  show how many words to remove and block Continue above 200. Restored
  unfinished/over-limit gifts cannot skip to Share. Server/browser text
  extraction preserves line boundaries consistently. Native Chromium clipboard
  checks at 199/200/201 newline-separated words matched editor, preview, and
  saved state after blur; 201 words survived reload. Typing Enter, CDP-driven
  IME composition/commit, and rich paste plus selection styling were checked.
  Bold/italic/color/line breaks matched the actual recipient view from the
  encoded preview link. This does not close the separate PNG-export task B04.
  No deployed verification yet.

## P1 - Trust and core gift fidelity

- [x] B04 - Make saved images match the gift.
  Covers ISSUE-008. Entry point: [renderer](../lib/export/renderBouquetImage.ts).
  Preserve note line breaks, supported rich formatting, theme, colors, and
  borders. Define how dynamic effects freeze into a still. Wrap long names and
  unbroken text. Verify actual downloaded images against recipient appearance,
  including a dark card and backdrop.
  **Implemented and verified locally 2026-10-19:** PNG capture now renders the
  shared bouquet, backdrop, and note components rather than rebuilding a
  different card on canvas. It waits for fonts/images, preserves supported rich
  text and real borders, and wraps long names/unbroken text in both the gift
  and export. Motion is stopped at its initial state; the watercolor's blurred
  overlay and audio are omitted. CSS Color 4 values are converted only inside
  the capture clone for html2canvas compatibility.
  Inspected actual generated download blobs: midnight/double-border
  (1440 x 2262), watercolor/cherry/dashed-border (1440 x 1570), and a final
  production-build rose-gold/candlelight/dotted-border sample (1440 x 2254).
  Verified bold/italic/color/font/line breaks, wrapped names/text, PNG output,
  and temporary-host cleanup. A forced image-decode failure showed an error,
  cleaned up, and left retry enabled. Blank-note omission has regression
  coverage. Native file downloads on deployed/mobile browsers remain B10.

- [x] B05 - Decide and implement honest counter semantics.
  Covers ISSUE-006. Depends on B01 and an owner decision.
  Entry points: [recording](../lib/counter/recordBouquetSent.ts),
  [display](../components/landing/BouquetCounter.tsx).
  Choose copied/shared/opened metric; do not claim delivery that is unobservable.
  Define repeated gifts, multiple recipients, sessions, concurrent clicks, and
  retry idempotency. Display fresh data where promised, not a build snapshot.
  **Owner decision and local implementation 2026-10-22:** count the first
  successful clipboard copy for a stable random draft ID; repeated copies,
  edits, reloads, and response-loss retries cannot increment that ID again.
  Starting a new bouquet/preset creates a new ID. Label the total "bouquets
  prepared to share"; retain historical counts under their earlier rules.
  Redis atomically enforces permanent gift-ID deduplication and per-HMAC-IP
  fixed-window quotas of 10 requests/minute and 50/hour, including duplicates.
  The JSON-only API bounds bodies at 128 bytes and returns 429/Retry-After
  when limited. Browser deduplication/cooldown avoids redundant requests.
  Footer counts render at request time, not build time; an open/reused page
  is not live-polled. Copying never waits for counting.
  **Local verification:** 51 files / 244 tests, type-check, lint, and build
  passed. A production-build HTTP probe against an isolated miniredis Lua/REST
  fixture verified 30 concurrent duplicates add one, a 100-request burst
  admits 10/rejects 90, the 50/hour limit and recovery, retained totals/IDs
  across an app restart, fresh request-time footer data, and controlled
  outage responses. This is a Redis-compatible emulator, not real Upstash
  or Vercel acceptance.
  **Closed by owner production sign-off, 2026-10-22:** owner reports the same
  bouquet increments only once even after 100 copy clicks. This verifies the
  visible repeated-copy behavior, not 100 distinct API requests or a live
  quota/load test (browser deduplication avoids redundant requests).
  Remaining edge-protection and cross-instance quota checks move to O01.
  See [counter policy and checklist](./counter.md).

- [x] B06 - Correct origin and social previews.
  Covers ISSUE-005. Entry points: [origin](../lib/siteUrl.ts),
  [deployment](../vercel.json), [metadata](../app/bouquet/page.tsx).
  Verify real production origin in copied URLs and rendered OG URLs independently.
  Choose generic versus personalized preview intentionally; do not expose note
  text as an accidental metadata feature. No parked-domain fallback.
  **Implemented and verified locally 2026-10-19:**
  browser links use the current origin; server metadata uses the configured
  canonical origin, Vercel deployment origin, or the real existing live site,
  never the unowned bloom.app domain. Removed the deployment's parked-domain
  override. Owner selected generic previews without names or note text.
  Both copy handlers generated the local production origin; raw server
  metadata independently used the real live canonical OG URL.
  The OG endpoint returned a 1200 x 630 PNG with byte-identical output despite
  personal query parameters.
  **Closed by owner production sign-off, 2026-10-22:** owner confirms links
  are correct and open correctly, and accepts B06. No separate production
  social-crawler screenshot or raw metadata capture was supplied; generic
  preview behavior retains the local verification evidence above.

- [x] B07 - Ship honest privacy/contact/navigation.
  Covers ISSUE-009, ISSUE-010. Entry points: [copy](../lib/site.ts),
  [footer](../components/ui/Footer.tsx), [holding page](../app/pre-release/page.tsx).
  Explain link access, server processing, local draft retention, and lack of
  encryption/revocation accurately. Real destinations or explicitly marked
  unavailable sections, never unrelated placeholders under finished labels.
  Decide recipient indexing/referrer policy and document preview tradeoffs.
  **Implemented and verified locally 2026-10-19:** real About/Privacy pages
  return HTTP 200. Footer links reach real destinations; unavailable standalone
  guides/templates/contact are nonlinks with explicit status. Existing builder
  choices are not presented as missing features. No approved public contact
  was supplied, so Contact is unavailable and the assumed email was removed.
  Privacy explains query-link/server exposure, access by anyone with the link,
  local retention, and lack of encryption, expiry, or revocation.
  Gift HTTP responses use no-referrer and noindex/nofollow/noarchive; social
  previews are generic. These precautions are not access controls.
  **Contact follow-up, 2026-10-22:** owner approved the public address
  dheeraj.2.kumar@outlook.com for Dheeraj Kumar. Added a real Contact page,
  footer navigation, and privacy contact link. Playful lunch copy is not a
  response-time promise. Templates and standalone Wander guides remain open
  under L01 and L10 respectively.
  **Footer follow-up, 2026-10-22:** replaced unavailable labels with links
  to matching sections on a shared Explore guide. It explains current builder
  choices and links to creation/contact without pretending the full discovery
  pages or selectable template collection are shipped. L01/L10 remain open.

- [x] B08 - Accessible controls and dialogs.
  Covers ISSUE-011. Entry points: [modal](../components/ui/Modal.tsx),
  [button](../components/ui/Button.tsx), [note](../components/cards/MessageCard.tsx).
  Meet AA text contrast; focus enters/traps/returns correctly, background is
  inactive, Escape works, and interactive roles are not nested. Reverify after
  redesign rather than treating visual approval as accessibility approval.
  **Reported control/dialog fixes verified locally 2026-10-19:** native
  Chromium focus entered the dialog, remained inside on keyboard navigation,
  returned to the opener after Escape, and background siblings were inert.
  Regression tests cover focus restoration, keyboard boundaries, and stable
  callbacks. Primary-button text measured 6.05:1 in both appearances, with a
  shared focus-visible outline. Reveal controls no longer nest a folded-card
  button role. This is not whole-site WCAG certification: custom note colors
  are not contrast-constrained, and real-device/assistive-technology release
  checks and post-redesign rechecks remain necessary.

- [x] B09 - Truthful audio state and retry.
  Covers ISSUE-012. Entry points: [playback](../lib/soundtracks/ambientPlayback.ts),
  [hook](../hooks/useAmbientSoundtrack.ts).
  Network/decode/autoplay failure cannot produce Playing; allow a meaningful
  retry. Muting, navigation cleanup, and switching tracks still work.
  **Implemented and verified locally 2026-10-19:** failed play promises and
  runtime media errors clear Playing and expose a single retryable status.
  Stale requests cannot change the current track's state. Switching to silence
  stops playback, including a changed recipient-player prop.
  Native Chromium with rain's request blocked showed the error without
  Playing; unblocking and selecting it again played successfully; silence
  cleared Playing. Regression tests cover rejection/retry, late errors,
  duplicate pending failure, switching, muting, stale promises, and cleanup.

- [x] B10 - Repeat the production release checks after fixes.
  **Closed by owner production sign-off, 2026-10-22:** after deployment,
  owner confirmed delivery/gift flow and Redis work and explicitly accepted
  B10. The preview report below and local regression checks support this
  acceptance; this is not an exhaustive device/failure-state certification.
  **Owner preview smoke pass, 2026-10-22:** reported working full gift flow,
  draft recovery, both copy actions, recipient experience, PNG downloading,
  audio, pages, mobile keyboard, light/dark appearance, and the 200-word
  gate (extra text preserved; Continue blocked). Device/browser versions,
  export visual fidelity, failure states, and real Redis acceptance are not
  established by that report alone. An old recipient
  name on a new laptop needs distinguishing browser autofill/imported profile
  state from a preset URL; no account-backed cross-device history exists.
  Extend existing verification rather than treating an already-live site as an
  undeployed project. Check configured origin and both clipboard actions in a
  fresh browser profile; open the copied gift in a separate signed-out context.
  Verify preview/back navigation, all bouquet detail content, truthful copy/error
  toasts, real PNG output, loading/corrupt-link states, and audio success/failure.
  Exercise the full builder and recipient on actual mobile browsers, including
  light/dark appearance, tap targets, step navigation, and keyboard access.
  Record browsers/devices and results; the audit's 390px layout check is not a
  complete mobile pass. Counter verification follows B01/B05, not an assumed
  increment-on-create policy. Existing gift links do not expire.

## Operational follow-up

- [x] O01 - Verify deployed counter abuse protection beyond the happy path.
  **Owner clarification, 2026-10-23:** the underlying functionality is already
  shipped. Perform this verification before the upcoming L work; do not treat
  it as a new counter feature. Closure records the actual operational evidence.
  Follow-up to the owner-accepted B01/B05 release work, not a reopened release
  gate. Confirm Vercel edge-rule availability/configuration and exercise
  distinct API requests across instances: same gift ID counts once, unique
  IDs respect 10/minute and 50/hour quotas, and 429 includes Retry-After.
  Record retained totals across a future redeploy and controlled outage
  behavior. Local fixture coverage exists; owner repeated-copy checks do not
  independently establish these operational results. Do not stress the shared
  production database without an agreed bounded test plan.
  **Read-only investigation, 2026-10-23:** one production `GET /api/count`
  returned HTTP 200 with `Cache-Control: no-store`. Focused local API and
  storage tests passed (38 tests). No production or Preview POSTs were sent.
  In the authenticated Vercel dashboard, the project is on Hobby; Firewall
  and system mitigations are active, Bot Protection is inactive, and there
  are 0 custom rules. The rule editor offers a Rate Limit action, but no
  project rule currently protects `POST /api/count`. The Upstash URL/token
  and counter secret are each scoped to **All Environments**, so Preview
  shares the configured Redis credentials with Production; this conflicts
  with the earlier owner statement that Preview Redis is separate. Do not
  write-test Preview until separate Preview-scoped Redis credentials are
  visible. The Storage UI offers Upstash for Redis, but installation requires
  accepting terms that say Vercel may share the account's Vercel ID, email,
  and usage data with Upstash. At that stage, stopped before accepting,
  provisioning, or changing settings. `vercel.json` contains build
  configuration only.
  **Preview setup and bounded verification, 2026-10-23:** after explicit owner
  consent to the Upstash disclosure, a free Redis database was created and
  connected to Preview only. The unsupported custom prefix was cleared so the
  integration exposes `KV_REST_API_URL` and `KV_REST_API_TOKEN`, which the app
  supports. The existing Preview deployment for commit `707894c` was redeployed
  and became Ready; an authenticated read-only GET returned HTTP 200, count 0,
  and `Cache-Control: no-store`. Production remained on its existing Redis
  credentials and received no POSTs.
  A same-ID concurrent Preview probe returned ten HTTP 200s (one counted, nine
  duplicates), but the following distinct request was also counted rather than
  limited. A later browser network suspension obscured a POST response; the
  subsequent GET showed the count had advanced from 2 to 3. In a fresh minute,
  sequential same-ID requests returned ten HTTP 200s (one counted, nine
  duplicates), then HTTP 429 with `Retry-After: 19`. Three later fresh-minute
  batches each returned ten HTTP 200s. A consolidated probe then returned seven
  HTTP 200s (one counted, six duplicates) followed by HTTP 429 with
  `Retry-After: 867`, confirming an hourly limit for that client key. The
  Preview count ended at 8. The first concurrent-probe discrepancy remains
  unexplained; prior requests may have crossed a quota boundary or used a
  different client identity, so the exact request that reached 50 is unknown.
  A later Preview-only redeploy of the same commit became Ready in 54 seconds;
  a read-only GET to the new deployment still returned count 8, confirming
  Redis data persisted across that redeploy. The owner chose to keep Firewall
  inspect-only, so no rule was changed; the dashboard still has 0 custom rules.
  No test confirmed routing across distinct Vercel function instances. The
  focused local suite covers Redis auth/network/timeout failures and 503
  responses, but no live Preview outage was simulated. Keep O01 open.
  **Firewall rule and closure, 2026-10-28 (owner approved, 20/min):** added
  and published one Vercel Firewall custom rule, "Counter POST rate limit":
  Request Path equals `/api/count` AND Method equals POST, fixed window of 20
  requests per 60 seconds keyed by IP, responding 429. Hobby allows three
  rate-limit rules; this is the only custom rule. Bounded Preview probe at
  15:59 UTC (deployment `bloom-65g6rv7rb`, Preview-only Redis): 25 sequential
  POSTs with one new gift ID returned 200 for 1-10 (one counted, nine
  duplicates; count 10 to 11), app 429s with `Retry-After` for 11-20, and
  Firewall 429s (`x-vercel-mitigated: deny`, no function call) for 21-25. A
  following GET still returned 11, so reads are unaffected. Production
  received only one read-only GET (HTTP 200). Closed with the evidence above;
  multi-instance routing and a live Redis outage remain covered by local
  tests only.

## Experience polish - Improve the existing Bloom, not a replacement

**Owner decision, 2026-10-22:** reject the "Color, delivered" application
direction. Keep released v0.0.4's softer UI, rounded controls, five-step flow,
and gentle interactions as the foundation. Preserve the experiment separately;
do not merge its visual changes. D01-D06 below supersede the old redesign
tasks. Historical reference
studies and composition reviews remain evidence, not current approval.
See the [experience improvement plan](./redesign-plan.md).

**Accepted and closed by owner, 2026-10-23:** the Vercel preview looks good;
proceed with [PR #6](https://github.com/D-Kumar19/bloom/pull/6).
D01-D06 close the agreed incremental polish scope, not a whole-product visual
or accessibility certification. The criteria below record the review intent;
unsampled devices, combinations, and manual contrast checks are limitations
listed in the plan, not claims of completed testing or blockers requiring
another redesign batch.

- [x] D01 - Audit the existing experience and prioritize concrete friction.
  **2026-10-23: first scoped audit recorded** in the
  [polish batch report](./redesign-plan.md#first-polish-batch---2026-10-23).
  Concrete findings were prioritized over a new visual concept. Owner accepted
  this scoped audit and resulting preview on 2026-10-23.
  Start from current main, not the rejected branch's UI. Capture desktop/mobile
  and light/dark baselines for home, builder, share, recipient, and export.
  Record what already works and specific problems in spacing, hierarchy,
  color, controls, image treatment, navigation, and feedback. Separate observed
  usability issues from aesthetic preferences. Rank by user impact and effort;
  propose a small first batch rather than a new site-wide concept.

- [x] D02 - Refine color composition and visual hierarchy.
  **First batch implemented:** reuse the existing dark rose for selected actions,
  improve helper/progress text contrast, and correct toast color pairs.
  The warm/light and charcoal/dark palettes and serif hierarchy are retained;
  this is not approval of a new global visual system.
  Depends on D01. Keep the existing soft identity; review background/surface,
  text, accent, border, and selected-state colors together in both appearances.
  Improve primary-action emphasis, secondary-text readability, heading scale,
  spacing rhythm, and unnecessary competing containers. Check AA contrast for
  supported default UI states; do not claim custom note colors are constrained.
  Review changes on real screens before applying tokens globally. No automatic
  adoption of the rejected coral/plum/acid palette or oversized typography.

- [x] D03 - Polish rounded controls and interaction feedback.
  **First batch implemented:** rounded 44px bouquet/backdrop selectors,
  explicit focus and pressed states, keyboard mood tabs, readable feedback,
  and reduced-motion-aware step scrolling/entry. Owner accepted the preview;
  exhaustive control/state and motion coverage is not claimed.
  Depends on D01. Review button radius, height, padding, labels, visual weight,
  icon alignment, and primary/secondary/ghost consistency. Preserve rounded
  controls; no square-button replacement. Check hover, focus, pressed, selected,
  disabled, loading, success, and failure states with keyboard and touch.
  Preserve successful gentle transitions; remove jank or delays where observed.
  Respect reduced motion and never add animation merely to appear distinctive.

- [x] D04 - Improve artwork fit, reading comfort, and gift fidelity.
  **First batch implemented and locally checked:** retain the existing rounded,
  gently swaying photo; show the full 2:3 portrait in gift/detail views and
  exports instead of cropping it. Verified all 15 source dimensions and added
  catalog-wide component coverage; downloaded warm peony and dark sympathy
  PNGs. Owner accepted the preview; exhaustive catalog/browser and long-note
  visual coverage is not claimed.
  Depends on D01. Inspect all 15 bouquets against actual surrounding surfaces,
  including cloud backgrounds, the vase, and sympathy artwork. Address awkward
  scale, cropping, spacing, or competing borders without filtering flowers or
  assuming transparent assets. Neutral mounts are an option to review, not a
  mandated design. Compare picker, detail modal, preview, recipient, and actual
  PNGs. Check short/long notes, dark cards, rich formatting, and mobile reading;
  preserve existing gift choices and old links.

- [x] D05 - Reduce builder/navigation friction only where it is demonstrated.
  **First batch implemented:** reopen the current bouquet's mood, allow
  keyboard mood navigation, and provide a focused "Jump to sharing" anchor.
  Fixed share-panel grid overflow at 320px. No sidebar or extra step added.
  Owner approved the working preview on 2026-10-23.
  Depends on D01. Keep one clear task per step and the five-step pipeline.
  Review progress/back navigation, draft recovery cues, selection visibility,
  advanced-control disclosure, and share-action discoverability. Evaluate a
  desktop sidebar/sticky preview only if it solves an observed problem without
  reducing editing space, duplicating controls, or making mobile harder.
  A sidebar is not approved or required. Review one small working improvement
  with the owner before expanding its scope; coordinate new sharing with L03.

- [x] D06 - Validate and ship approved polish in small increments.
  **Accepted, 2026-10-23:** 277 local tests, type/lint/build and sampled browser/
  export checks passed; hosted PR verification and Vercel preview succeeded.
  Owner approved the preview and authorized merging PR #6. Main push CI and
  production deployment are monitored separately from this visual acceptance.
  Depends on the specific D02-D05 work included in each increment, not completion
  of every candidate. Compare before/after screenshots and the same user task
  on main and the preview; owner must prefer the result before merge.
  Run relevant regression tests and build checks, verify mobile/desktop,
  light/dark, keyboard/reduced motion, old links, draft/copy/audio failures,
  and actual exports for touched surfaces. Retain each slice only if it improves
  clarity, comfort, or flow without losing the existing crafted feel.
  Deploy reviewed small batches; do not wait for or attempt a wholesale redesign.

## Later - Possible improvements after reliability

Content, starters, personal details, and catalog additions are candidates, not
a commitment to ship everything. Validate usefulness and simplicity first.

- [x] L01 - Ship editable occasion starters, not fixed recipient preferences.
  **Closed by owner Preview approval, 2026-10-28, PR #8.** Six editable
  starters have a dedicated Templates page and enter at Message with blank
  personal fields. Existing drafts require confirmation before replacement;
  failed writes preserve the old draft, current step, and pending entry.
  New bouquet starts at flowers after confirmation. Change bouquet appears
  only for template/preset/mood starts, with context retained across reload.
  Notes require 2-200 words without discarding incomplete drafts or breaking
  existing recipient links. Owner verified these follow-ups and approved merge.
  Latest application commit: `44a7832`; hosted PR verification and Vercel passed.
  Local full suite passed 330 tests / 56 files before the help-content update;
  the latter passed its five targeted tests, lint, type-check/build, and sampled
  mobile/desktop browser review. Owner approval is acceptance, not exhaustive
  real-device or accessibility certification.
  **Implementation history and original acceptance scope follow.**
  **Preview feedback and scope correction, 2026-10-28:** owner rejected the
  shared Explore destination as adequate discovery navigation and approved
  expanding PR #8 with L10. Templates now has its own page, linked from Create;
  occasion starters still enter at Message. Footer New bouquet explicitly
  asks before replacing a draft, then begins at flower selection. Replacement
  retains the save-before-switch protection. Template/discovery actions add
  decorative hover, focus, and press sparkles, static under reduced motion.
  The earlier Explore-only notes below describe the first, unapproved iteration.
  **Message-step follow-up, 2026-10-28:** owner chose to show Change bouquet
  only for template/preset starts (including mood starters), not scratch starts.
  Entry context is stored with the local draft, outside shared gift data, so
  reload/preview return retains the shortcut. Older drafts without the marker
  use the scratch behavior. Back and step navigation remain available to all.
  The owner also chose a 2-word minimum note: Message now explains the
  2-200 word range, blocks Continue below it, and retains short draft text.
  Restored Backdrop/Share drafts with short notes return to Message.
  Existing recipient gift links remain readable regardless of note length.
  Local follow-up verification passed 330 tests / 56 files, targeted lint,
  type-check, and production build. Production-build Chromium confirmed a
  one-letter note blocks Continue, exact "Love you" enables it, scratch
  starts omit the shortcut, and template reload retains it and the note.
  These follow-ups were pushed and accepted in Preview.
  **Initial implementation, PR #8 (2026-10-28):** Explore/Templates offered existing
  guide starters at the editable Message step, with blank personal fields and
  a direct bouquet-change action. Saved drafts require explicit replacement
  confirmation, including existing encoded-preset and mood entry links.
  Replacement now writes the new draft without deleting the old envelope
  first. If writing fails, the current draft, step, and entry URL stay intact;
  an alert inside the confirmation dialog offers retry or keeping the draft.
  Regression tests cover quota/security errors, occasion/mood/encoded entries,
  retry persistence, keep-draft recovery, and accessible error placement.
  A local production-build Chromium check confirmed quota-failure preservation,
  successful retry, URL preservation, and reload recovery at 390px.
  Owner subsequently approved the revised Preview and merge on 2026-10-28.
  **Original scope included the unavailable footer Templates destination.**
  The footer previously linked to an introductory Templates section on
  the shared Explore page, not a selectable gallery. Replace it with the
  usable templates/starter entry point and verify selecting a starter enters an editable builder
  without silently overwriting an existing draft.
  Follow the [product direction](./product-direction.md). Reuse selected existing
  moments/guides after navigation decisions. Offer useful presentation defaults,
  optional prompts, and an obvious bouquet swap even when opening at the note
  step. No forced red roses, automatic personal message, or silent draft
  overwrite. Verify old links and guest flow; validate with sender/recipient pairs.
  Evaluate guide pages and a small example gallery as entry points, reusing
  existing content/components instead of duplicating the starter implementation.
  Current preset decoding expects an encoded gift, not a plain guide slug.
- [x] L02 - Profile image/audio/font costs; optimize against measured budgets
  agreed in the design specification.
  **Measured 2026-10-28 (PR #12):** no budgets had been agreed, so this
  records a profile and fixes only what it showed. Profile: local production
  build, 390x844 viewport, cold cache, transferred bytes from the Resource
  Timing API after scrolling to the bottom.

  | Page | Before | After |
  | --- | --- | --- |
  | Home | 606 KB | 305 KB |
  | Create (bouquet step) | 6,466 KB | 447 KB |
  | Gift link (before reveal) | 622 KB | 321 KB |
  | Templates | 783 KB | 482 KB |
  | Flowers (all 15 thumbnails) | ~690 KB | 690 KB |

  Fixes: the builder gallery and bouquet heroes no longer bypass Next image
  optimization (`unoptimized`), so phones get resized WebP instead of the 1.6-2
  MB source PNGs; seven note-only fonts are no longer preloaded on every page
  (fonts 423 KB to 121 KB) and still load when a note uses them or the font
  picker previews them. Ambient audio already downloads only after play, so it
  was unchanged. Save as Image still exports the full bouquet and note.
  Budgets (owner approved with PR #12, 2026-10-28): under 500 KB for home,
  create, and an unopened gift; under 1 MB for discovery pages.
- [x] L03 - Native mobile sharing and a selectable manual-link fallback.
  **Implemented in PR #7 (merged 2026-10-23):** uses the native share sheet
  where supported and reveals a selectable full link when sharing or clipboard
  fails. Native share-sheet completion was originally not counted.
  **Superseded 2026-10-28 by owner report:** a Share-sheet Copy left the
  counter at 8, so completed native shares and manual-link copy events now
  call the same once-per-gift-ID counter as the copy buttons. Cancelled or
  failed shares and merely revealing the link still do not count. See
  [counter policy](./counter.md).
  Eleven focused tests, type-check, targeted lint, production build, hosted PR
  verification, and Vercel Preview deployment passed. The desktop preview keeps
  the existing rounded style; at a 390px viewport, the manual-link fallback
  appeared and its Select link action selected the full 442-character URL.
  This browser did not expose the native share sheet, so the real-device
  interaction remains unverified.
  **Share-step simplification, 2026-10-28, PR #9:** owner flagged five
  stacked equal-weight actions on the final step. It now shows one primary
  action (Share bouquet where native sharing exists, otherwise Copy message +
  link), a collapsed "More ways to share" disclosure holding the remaining copy
  and manual-link options, and a quiet Create another bouquet link. Share or
  clipboard failures still open the selectable link automatically. A focused
  test covers the collapsed default and disclosure; 390px dark-mode browser
  check confirmed both states. Behavior and counting rules are unchanged.
  **Manual-link button removed, 2026-10-28 (owner request):** More ways to
  share now holds only the copy actions. The selectable link remains as an
  automatic fallback when sharing or clipboard fails, and copying from it
  still counts once.
- [x] L04 - Reassess unused code and root cleanup after feature decisions.
  **Implemented for Preview review, 2026-10-28:** audited route/static/dynamic
  imports and root files. Removed five obsolete unmounted wrappers/components,
  retaining PNG export and explicitly open later-feature candidates. No source
  moves, dependency changes, or speculative asset deletion. See the
  [catalog review](./product-direction.md#catalog-and-brand-review---2026-10-28).
  Current source layout stays as-is. No source moves are approved.
- [x] L05 - Improve bouquet descriptions and optional discovery content.
  **Implemented for Preview review, 2026-10-28:** visually checked all 15
  thumbnail/portrait pairs. Updated visual-first descriptions and highlights,
  removed unsupported quantity/material/symbolism claims and emotional promises.
  Builder details and optional discovery details share the cultural/personal
  meaning caveat. No unsourced botanical facts added.
  Clear visual/tone description first, symbolic associations with cultural
  caveats, then optional sourced facts. Gentle browsing humor is welcome;
  sensitive occasions and errors stay respectful. No invented facts.
- [x] L06 - Explore an optional "Why I chose these" personal detail.
  **Implemented for Preview review, owner scope 2026-10-28:** a prompt inside
  existing opt-in inspiration appends to the note without replacing rich text.
  No new field/step/schema or increased minimum. Drafts, recipient links, and
  exports use the same note; the existing 2-200 word range still applies.
  Try a writing prompt before adding a separate field or UI. No extra step.
  Prototype its value before adding a gift field. Specify length, preview/export
  consistency, and backward-compatible encoding. Never require a longer note.
- [x] L07 - Curate additions instead of expanding every option list.
  **Evaluation ready for owner acceptance, 2026-10-28:** catalog inventory
  found broad existing coverage, but no observed preference evidence supporting
  a specific addition. Owner explicitly accepted no additions as a valid
  outcome. Recommend retaining current choices, not adding images/music/fonts
  speculatively. This is not a user study or a claim that every taste is served;
  [recorded rationale](./product-direction.md#catalog-and-brand-review---2026-10-28).
  Use observed preference gaps to select flower/color collections, presentation,
  typography, or sound additions. Check asset consistency, accessibility,
  performance, and music rights. No target quota of new fonts/themes/songs.
- [x] L08 - Review the favicon and complete the approved brand assets.
  **Implemented for Preview review, 2026-10-28:** rendered the old favicon and
  confirmed it was the Vercel triangle. Replaced it with a rosebud derived from
  Bloom's existing mark: one SVG used by header/footer, multi-size ICO, and
  180px touch icon. No external asset or package. Verify small-size readability
  and browser rendering; keep the existing soft, rounded brand direction.
  **L04-L08 local verification, 2026-10-28:** 340 tests / 57 files, full lint,
  type-check/build passed. Production-build Chromium verified desktop/mobile
  light/dark samples, keyboard disclosure, all icon endpoints and generated
  icon metadata, personal prompt append/edit/reload, recipient reveal, and an
  actual PNG download retaining the exact note. Browser testing found and fixed
  a prompt-spacing/caret race; regression tests cover immediate continuation.
  **Closed by owner, 2026-10-28, PR #9:** owner marked L04-L08 done and
  authorized merge. **CI fix:** hosted type-check failed on a test helper typed
  as `HTMLElement` instead of `HTMLDivElement` (`RichMessageEditor.test.tsx`);
  `next build` skips test files, so the earlier local build missed it. Fixed
  with a typed query. Local note: run the suite on Node 20 to match CI; Node 26
  produced unrelated environment failures (341/341 pass on Node 20).
- [x] L09 - Review metadata for actual public routes.
  Extend B06/B07 rather than creating indexable recipient gift content by default.
  Verify titles/descriptions and OG previews on shipped pages; evaluate a proper
  1200 x 630 branded image. New guide/about pages need metadata if implemented.
  Recipient privacy/indexing decisions take precedence over SEO.
  **Implemented for Preview review, 2026-10-28 (PR #11):** a production audit
  found every page's link preview reused the home title, and production
  `og:image` pointed at the per-deployment `VERCEL_URL` host, which redirects
  to Vercel login (HTTP 302), so crawlers got no preview image on any link,
  gift links included. Server metadata now uses `VERCEL_PROJECT_PRODUCTION_URL`
  in production (explicit `NEXT_PUBLIC_SITE_URL` still wins; previews keep
  their own host). Each indexed public page has its own title, description,
  canonical URL, Open Graph and Twitter card via `lib/pageMetadata.ts`.
  New `/og` site image (1200 x 630, same card style as the gift image)
  replaces the gift image on non-gift pages; the unused placeholder
  `public/og-image.png` and dead bouquet-layout metadata were removed.
  Added `/create` metadata, `robots.txt` (blocks `/api/`, `/create/result`;
  gift pages stay crawlable so their noindex is read), and `sitemap.xml` for
  the 11 indexed pages. `/pre-release` title no longer repeats "Bloom" and is
  noindex. Gift metadata is unchanged: generic, noindex, no-referrer.
  Verified with a production build under simulated Vercel production env:
  rendered tags for all 14 routes, robots, sitemap, and both images.
  Remaining: confirm on the deployed site that a shared link shows its image.

- [x] L10 - Complete standalone Wander discovery pages.
  **Closed by owner Preview approval, 2026-10-28, PR #8.** Owner accepted the
  distinct discovery pages, dedicated Templates destination, subtle action
  feedback, draft-safe fresh entry, and the final About/Privacy/Contact content.
  Hosted PR verification and Vercel passed at `44a7832`; merge authorized.
  **Implemented in expanded PR #8, owner decision 2026-10-28:** separate
  `/flowers`, `/note-styles`, `/backdrops`, and `/ambient-sound` routes now
  show the actual bouquet catalog, stationery previews, backdrop previews,
  and opt-in sound listening respectively. Each ends with a Templates
  invitation; `/templates` is the distinct Create destination. Existing
  `/explore#...` anchors remain a compatibility hub with onward links.
  Local production-browser checks cover all five distinct pages at desktop
  and 390px, actual sound play/stop and a blocked-audio error, template
  Message entry, and repeated New bouquet cancel/confirm navigation.
  Owner approved the revised Vercel Preview on 2026-10-28.
  **Footer wording follow-up, 2026-10-28:** replaced the vague Small print
  heading with About & help. Links now explain their destinations: About
  Bloom, Privacy & gift links, and Contact & feedback. Desktop and mobile
  retain the same destinations and footer layout.
  **Content correction, 2026-10-28:** owner clarified that the help pages,
  not just their labels, needed attention. About now explains the gifting
  journey and digital-only delivery; Privacy leads with a plain-language
  summary while retaining the storage, hosting, quota, and link-access
  details; Contact provides actionable bug-report guidance and privacy-safe
  screenshot advice. Rounded sections and decorative emoji aid scanning.
  Owner reported the conditional bouquet shortcut and note-length fix working
  in Preview, then accepted the help-content update and authorized merge.
  Explicitly covers footer Flowers, Note styles, Backdrops, and Ambient sound.
  **Original acceptance scope:** deliver standalone discovery/guide destinations
  for existing builder choices. Reuse the actual catalogs and
  previews, provide a clear path into the builder, and avoid duplicate
  selection stages. Describe sound as optional and respect playback rules.
  Verify content accuracy, desktop/mobile and keyboard access, metadata, and
  all four footer links before replacing the introductory shared Explore
  sections with full discovery pages. Coordinate
  flower descriptions with L05 and the approved redesign; not a blocker for
  the current reliability release.

## Next - Planned features (S01, F01, F03, F09)

Owner decision, 2026-10-28, after publishing v0.0.5: these four are the only
open feature TODOs. Implement each as a focused, Preview-reviewed PR that keeps
Bloom account-free and preserves existing gift links. Resolve the product
questions noted in each item before coding.

- [ ] S01 - Email-ready sharing.
  Open the default email app or Gmail/Outlook web composer with a prepared subject,
  short message, and bouquet link; leave the recipient field editable/empty.
  Include a copy-text fallback and verify desktop/mobile behavior and long links.
  No Bloom account, inbox permissions, or server-side email sending required.
  Opening a composer must not be recorded as confirmed delivery.
- [ ] F01 - Consider an optional sender name.
  This is a product change, not a confirmed bug: current builder validation and
  link decoding require a sender. Decide the recipient heading, metadata,
  "With love" fallback, draft validation, and old-link behavior together before
  implementation. Do not weaken validation in only one surface.
- [ ] F03 - Evaluate sharing Bloom itself with a friend.
  An unmounted sharing component already exists. Reuse it only if it fits the
  homepage, with explicit clipboard failures and benign share-sheet cancellation.
  Do not put promotional friction in the recipient's gift.
- [ ] F09 - Consider a restrained completion animation.
  No default celebratory confetti on sympathy/support gifts, no blocking delay,
  and a reduced-motion equivalent. Review with D03 instead of adding a second
  unrelated motion language. Existing step sparkles are not missing work.

## Deferred - not planned

Not open TODOs. Owner decided not to pursue these; omit them from open-work
summaries unless the owner explicitly revives one. Their notes are kept so a
revival does not start from zero.

- S02 - Optional accounts and a private bouquet journey.
  Let users save created bouquets and recover drafts across devices, then revisit
  them in an animated floral journal/timeline with a reduced-motion alternative.
  Keep creation, sharing, and recipient viewing available without login.
  Evaluate Google/Microsoft sign-in first; finalize providers and storage design
  before implementation rather than assuming every provider is needed.
  Define guest-draft import, per-user access, retention, and account/history
  deletion. Update privacy disclosures for server-stored gifts. Use honest event
  labels: creation/copying is not proof of sending, delivery, or opening.
  Deleting a journal entry must not imply revoking an existing encoded link.
  **Not planned (owner decision, 2026-10-28).** Accounts, server-stored
  gifts, and a journal conflict with Bloom's account-free design.
- S03 - Select and connect an owned production domain.
  **Deferred by owner, 2026-10-22:** annual registration/renewal costs are not
  justified for this personal project. Keep the free Vercel address and the
  Bloom name. This is not a publishing, redesign, or release prerequisite;
  revisit only if the owner wants to pay for domain ownership later.
  If resumed: shortlist names and renewal costs, get purchase approval,
  configure DNS/TLS and canonical/share/OG origins, assess redirects and
  sign-in callbacks, and verify old gift links where their host remains
  controlled. Do not assume ownership of bloom.app.
- R01 - Validate photo/voice value with a bounded prototype.
  "VM" is assumed to mean voice message; confirm scope first. Explore one personal
  photo or a short voice note, preview/delete controls, no forced playback, and
  a text alternative. Use consented sample assets without production uploads.
  Decide whether it improves recipient experience before funding storage.
  Expose only through user-opened personalization, never new default/skippable
  stages. Reject the concept if it makes a simple text gift harder to complete.
  **Not planned (owner decision, 2026-10-28).** Media storage, moderation,
  and costs are out of scope.
- R02 - Specify media ownership, access, lifetime, limits, and costs.
  Depends on R01 showing value. Compare per-gift storage/processing/bandwidth and
  operating costs; define validation, metadata stripping, quotas, abuse handling,
  deletion, retention, and expired-media fallback. Plan media references rather
  than bytes in URLs; account ownership is not recipient access control.
  Preserve existing text-only links. Pricing and payment integration require
  separate approval and willingness-to-pay evidence; no assumed free/paid cap.
  **Not planned (owner decision, 2026-10-28).** Depends on R01.

Checkout, scheduling, verified delivery receipts, 3D scenes, revocable link
storage, and expiry remain outside approved scope.

## Deferred - not prioritized

Not open TODOs. Possible someday, but the owner has no plan to start them; omit
them from open-work summaries unless the owner moves one to Next.

- F02 - Consider server-sent email, separate from S01 compose links.
  Evaluate a provider such as Resend only if users need Bloom to send mail.
  Requires sender identity/domain setup, consent, abuse controls, rate limits,
  privacy, delivery/bounce handling, and operating-cost review. No provider chosen.
  **Not prioritized (owner decision, 2026-10-28).**
- F04 - Explore illustrated/watercolor asset direction or composition.
  Optional art-direction research, not an approved asset regeneration or engine
  rewrite. Review consistent imagery, provenance, performance, and the florist
  worktable direction before replacing functioning assets.
  **Not prioritized (owner decision, 2026-10-28).**
- F05 - Consider privacy-conscious gift-open analytics.
  Opening/prefetching by preview bots is not proof that a person read a gift.
  Specify consent, data minimization, bot/repeat handling, retention, and whether
  any event is exposed to senders. No covert tracking or assumed read receipts.
  **Not prioritized (owner decision, 2026-10-28).**
- F06 - Consider creator support/donations.
  Default placement should not compete with a personal recipient message.
  Evaluate an unobtrusive site-level location, provider, disclosure, and fees;
  no payment integration is approved.
  **Not prioritized (owner decision, 2026-10-28).**
- F07 - Consider internationalization.
  Validate demand and initial locales; cover UI, content, text direction,
  locale-aware formatting, and word-limit behavior. Preserve existing links and
  sender-written text. Do not confuse translating the UI with translating notes.
  **Not prioritized (owner decision, 2026-10-28).**
- F08 - Consider a downloadable QR code for a gift.
  Verify actual scanning with realistic encoded-link lengths and export sizes.
  Dense codes may require a short-link service, which is a separate storage/
  privacy/lifetime decision. Never send private gift URLs to a public QR service.
  **Not prioritized (owner decision, 2026-10-28).**
- F10 - Consider feeling-based bouquet discovery.
  Existing search returns flower IDs, not curated bouquet matches, and is not
  mounted in the builder. Define relevance across moods, valid results, empty
  states, and whether search improves finding flowers before adding a new control.
  **Not prioritized (owner decision, 2026-10-28).**
