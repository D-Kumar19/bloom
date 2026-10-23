# Open work

Updated: 2026-10-22. CI01 and B01-B10 are closed. Reliability changes are
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

- [ ] O01 - Verify deployed counter abuse protection beyond the happy path.
  Follow-up to the owner-accepted B01/B05 release work, not a reopened release
  gate. Confirm Vercel edge-rule availability/configuration and exercise
  distinct API requests across instances: same gift ID counts once, unique
  IDs respect 10/minute and 50/hour quotas, and 429 includes Retry-After.
  Record retained totals across a future redeploy and controlled outage
  behavior. Local fixture coverage exists; owner repeated-copy checks do not
  independently establish these operational results. Do not stress the shared
  production database without an agreed bounded test plan.

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

- [ ] L01 - Ship editable occasion starters, not fixed recipient preferences.
  **Includes the currently unavailable footer Templates destination.**
  The footer currently links to an honest introductory Templates section on
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
- [ ] L02 - Profile image/audio/font costs; optimize against measured budgets
  agreed in the design specification.
- [ ] L03 - Native mobile sharing and a selectable manual-link fallback.
- [ ] L04 - Reassess unused code and root cleanup after feature decisions.
  Current source layout stays as-is. No source moves are approved.
- [ ] L05 - Improve bouquet descriptions and optional discovery content.
  Clear visual/tone description first, symbolic associations with cultural
  caveats, then optional sourced facts. Gentle browsing humor is welcome;
  sensitive occasions and errors stay respectful. No invented facts.
- [ ] L06 - Explore an optional "Why I chose these" personal detail.
  Try a writing prompt before adding a separate field or UI. No extra step.
  Prototype its value before adding a gift field. Specify length, preview/export
  consistency, and backward-compatible encoding. Never require a longer note.
- [ ] L07 - Curate additions instead of expanding every option list.
  Use observed preference gaps to select flower/color collections, presentation,
  typography, or sound additions. Check asset consistency, accessibility,
  performance, and music rights. No target quota of new fonts/themes/songs.
- [ ] L08 - Review the favicon and complete the approved brand assets.
  An icon already exists; whether it is still the Next.js default is unverified.
  Inspect its actual appearance before replacing it. Verify small-size readability
  and browser rendering; align any replacement with the approved redesign.
- [ ] L09 - Review metadata for actual public routes.
  Extend B06/B07 rather than creating indexable recipient gift content by default.
  Verify titles/descriptions and OG previews on shipped pages; evaluate a proper
  1200 x 630 branded image. New guide/about pages need metadata if implemented.
  Recipient privacy/indexing decisions take precedence over SEO.

- [ ] L10 - Complete standalone Wander discovery pages.
  Explicitly covers footer Flowers, Note styles, Backdrops, and Ambient sound.
  The corresponding builder choices already work; what is missing is their
  standalone discovery/guide destinations. Reuse the actual catalogs and
  previews, provide a clear path into the builder, and avoid duplicate
  selection stages. Describe sound as optional and respect playback rules.
  Verify content accuracy, desktop/mobile and keyboard access, metadata, and
  all four footer links before replacing the introductory shared Explore
  sections with full discovery pages. Coordinate
  flower descriptions with L05 and the approved redesign; not a blocker for
  the current reliability release.

## Final phase - Standout features

Owner-approved roadmap additions S01-S02, recorded 2026-10-19. Implement at the end,
after reliability fixes, the approved redesign, and core product polish.
These are not prerequisites for the initial redesigned release.

- [ ] S01 - Email-ready sharing.
  Open the default email app or Gmail/Outlook web composer with a prepared subject,
  short message, and bouquet link; leave the recipient field editable/empty.
  Include a copy-text fallback and verify desktop/mobile behavior and long links.
  No Bloom account, inbox permissions, or server-side email sending required.
  Opening a composer must not be recorded as confirmed delivery.

- [ ] S02 - Optional accounts and a private bouquet journey.
  Let users save created bouquets and recover drafts across devices, then revisit
  them in an animated floral journal/timeline with a reduced-motion alternative.
  Keep creation, sharing, and recipient viewing available without login.
  Evaluate Google/Microsoft sign-in first; finalize providers and storage design
  before implementation rather than assuming every provider is needed.
  Define guest-draft import, per-user access, retention, and account/history
  deletion. Update privacy disclosures for server-stored gifts. Use honest event
  labels: creation/copying is not proof of sending, delivery, or opening.
  Deleting a journal entry must not imply revoking an existing encoded link.

### Deferred - Optional domain ownership

- [ ] S03 - Select and connect an owned production domain.
  **Deferred by owner, 2026-10-22:** annual registration/renewal costs are not
  justified for this personal project. Keep the free Vercel address and the
  Bloom name. This is not a publishing, redesign, or release prerequisite;
  revisit only if the owner wants to pay for domain ownership later.
  If resumed: shortlist names and renewal costs, get purchase approval,
  configure DNS/TLS and canonical/share/OG origins, assess redirects and
  sign-in callbacks, and verify old gift links where their host remains
  controlled. Do not assume ownership of bloom.app.

### Later features - F01-F10 (open)

Owner confirmed on 2026-10-22 that F01-F10 remain open later-feature TODOs,
not deferred items. Schedule after the redesign and core UX work; resolve each
item's product/privacy/cost decisions before implementation. Only S03 is
explicitly deferred. No effort estimates from the external checklist have
been adopted.

- [ ] F01 - Consider an optional sender name.
  This is a product change, not a confirmed bug: current builder validation and
  link decoding require a sender. Decide the recipient heading, metadata,
  "With love" fallback, draft validation, and old-link behavior together before
  implementation. Do not weaken validation in only one surface.
- [ ] F02 - Consider server-sent email, separate from S01 compose links.
  Evaluate a provider such as Resend only if users need Bloom to send mail.
  Requires sender identity/domain setup, consent, abuse controls, rate limits,
  privacy, delivery/bounce handling, and operating-cost review. No provider chosen.
- [ ] F03 - Evaluate sharing Bloom itself with a friend.
  An unmounted sharing component already exists. Reuse it only if it fits the
  homepage, with explicit clipboard failures and benign share-sheet cancellation.
  Do not put promotional friction in the recipient's gift.
- [ ] F04 - Explore illustrated/watercolor asset direction or composition.
  Optional art-direction research, not an approved asset regeneration or engine
  rewrite. Review consistent imagery, provenance, performance, and the florist
  worktable direction before replacing functioning assets.
- [ ] F05 - Consider privacy-conscious gift-open analytics.
  Opening/prefetching by preview bots is not proof that a person read a gift.
  Specify consent, data minimization, bot/repeat handling, retention, and whether
  any event is exposed to senders. No covert tracking or assumed read receipts.
- [ ] F06 - Consider creator support/donations.
  Default placement should not compete with a personal recipient message.
  Evaluate an unobtrusive site-level location, provider, disclosure, and fees;
  no payment integration is approved.
- [ ] F07 - Consider internationalization.
  Validate demand and initial locales; cover UI, content, text direction,
  locale-aware formatting, and word-limit behavior. Preserve existing links and
  sender-written text. Do not confuse translating the UI with translating notes.
- [ ] F08 - Consider a downloadable QR code for a gift.
  Verify actual scanning with realistic encoded-link lengths and export sizes.
  Dense codes may require a short-link service, which is a separate storage/
  privacy/lifetime decision. Never send private gift URLs to a public QR service.
- [ ] F09 - Consider a restrained completion animation.
  No default celebratory confetti on sympathy/support gifts, no blocking delay,
  and a reduced-motion equivalent. Review with D03 instead of adding a second
  unrelated motion language. Existing step sparkles are not missing work.
- [ ] F10 - Consider feeling-based bouquet discovery.
  Existing search returns flower IDs, not curated bouquet matches, and is not
  mounted in the builder. Define relevance across moods, valid results, empty
  states, and whether search improves finding flowers before adding a new control.

## Later features - Personal media and sustainable pricing (R01-R02 open)

Owner confirmed on 2026-10-22 that R01-R02 remain open later-feature TODOs,
not deferred. Their prototype/value and ownership/cost gates still apply;
this does not approve production upload infrastructure or paid features.
Follow the [media discovery constraints](./product-direction.md).

- [ ] R01 - Validate photo/voice value with a bounded prototype.
  "VM" is assumed to mean voice message; confirm scope first. Explore one personal
  photo or a short voice note, preview/delete controls, no forced playback, and
  a text alternative. Use consented sample assets without production uploads.
  Decide whether it improves recipient experience before funding storage.
  Expose only through user-opened personalization, never new default/skippable
  stages. Reject the concept if it makes a simple text gift harder to complete.
- [ ] R02 - Specify media ownership, access, lifetime, limits, and costs.
  Depends on R01 showing value. Compare per-gift storage/processing/bandwidth and
  operating costs; define validation, metadata stripping, quotas, abuse handling,
  deletion, retention, and expired-media fallback. Plan media references rather
  than bytes in URLs; account ownership is not recipient access control.
  Preserve existing text-only links. Pricing and payment integration require
  separate approval and willingness-to-pay evidence; no assumed free/paid cap.

Checkout, scheduling, verified delivery receipts, 3D scenes, revocable link
storage, and expiry remain outside approved scope. The parking lot records
later work, not prerequisites for the reliability release.
