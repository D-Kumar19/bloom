# Bloom audit: 2026-10-19

Baseline: `4d610ab`. Live target: https://bloom-delta-nine.vercel.app.
This is a historical baseline, not a claim about future deployments.
Implementation status lives in the [backlog](./backlog.md).

## Product and scope

Bloom compresses a bouquet, stationery, rich-text note, backdrop, and optional
soundtrack into a shareable URL. Recipients open a staged reveal, save an image,
or create a return gift. No account or per-gift database record is required.

Review covered routes, core state/sharing/export/audio modules, deployment
configuration, automated checks, deployed browser flows, and a local production
build. It was not a formal penetration test or exhaustive device certification.

## Findings

### ISSUE-001 - High: production counter writes fail

Confirmed live: `GET /api/count` returned `200 {"count":0}`; a copy-link action
generated a POST returning 500. An independent POST also returned 500, and a
fresh GET remained zero.

[Storage](../lib/counter/storage.ts) chooses Redis only when both
`KV_REST_API_URL` and `KV_REST_API_TOKEN` exist. Otherwise it writes a local JSON
file, unsuitable for durable shared storage on Vercel.
[Client recording](../lib/counter/recordBouquetSent.ts) suppresses unsuccessful
responses. Exact production exception remains unverified: deployment logs and
environment settings were not accessed. Missing KV configuration/file writes
are the strongest explanation, not a proven server exception.

### ISSUE-002 - High: unfinished drafts disappear

Confirmed live twice: enter recipient, sender, and a note at step three; reload;
the builder returns to step one and the unfinished work is gone.

Only [the share screen](../components/builder/BouquetShareStep.tsx) saves drafts.
[State management](../hooks/useBouquetState.ts) does not autosave edits, and
[draft restoration](../lib/builder/draftSession.ts) resumes only Share.
The README's one-day draft promise is broader than actual behavior.
Draft validation must allow incomplete fields; saving earlier alone is not enough.

### ISSUE-003 - Medium: newline-separated words are merged

Confirmed live and with the actual helper in a DOM: `Hello<br>world` counts as one
word and leaves 199 words available. 201 words separated by `<br>` also count as
one. [Text extraction](../lib/message/messageRichText.ts) uses `textContent`,
which removes line boundaries. This also corrupts export text.

### ISSUE-004 - Medium: file increments lose updates

Actual storage source with isolated filesystem mocks: two concurrent increments
from zero returned `[1, 1]`, both writing count one. Read/modify/write is not
atomic. Redis REST parsing was separately verified with a real local HTTP server
and realistic GET/INCR responses. Local mock reproduction did not change the
checked-in count.

### ISSUE-005 - Medium: social metadata uses a parked domain

Live recipient metadata emitted `og:image=https://bloom.app/og-image.png`.
That domain's homepage displayed "Available for acquisition".
[Deployment configuration](../vercel.json) hard-codes it.

Important: the live share screen displayed the correct Vercel URL. Broken
copied links were not established. Check client share URLs and server metadata
independently; deployment/build configuration can differ.

### ISSUE-006 - Medium: "bouquets sent" is an inconsistent copy metric

Recording happens on copying, not sending or opening. Identical gift contents
are deduplicated per tab/session; multiple recipients may count once and another
session may count again. Concurrent calls to the actual helper produced two
POSTs before either stored its fingerprint.

There is no live update mechanism for the visible counter. The builder is
statically generated and its footer can contain a build-time snapshot; a
`dynamic` export in a child component does not configure the route.
Agree on metric semantics before changing deduplication.

### ISSUE-007 - High: editor displays words omitted from saved state

Local production build: a focused editor receiving an input event with 201
whitespace-separated words retained 201, while the card/state held 200 and the
budget showed zero. This reproduction used a DOM input event, not OS clipboard
paste.

[The editor](../components/builder/RichMessageEditor.tsx) truncates emitted state
but skips DOM synchronization while focused; blur cleanup does not reliably
reconcile plain inline content. The user can believe omitted text will be sent.

### ISSUE-008 - Medium: image export loses gift fidelity

Actual live PNG download succeeded, but a Midnight Garden gift exported on cream,
and two lines `Hello` / `world` became `Helloworld`.
[Canvas rendering](../lib/export/renderBouquetImage.ts) also discards rich HTML,
draws a double border as a single stroke, does not wrap long names/unbroken
words, and duplicates on-screen color rules inconsistently.

### ISSUE-009 - Medium: advertised sections are holding-page links

Flowers, Note styles, Backdrops, Ambient sound, Templates, About, Privacy, and
Contact all point to `/pre-release` in [the footer](../components/ui/Footer.tsx).
The holding page does acknowledge incomplete status.

Flower catalog/detail content, feeling search, moments, guides, examples, and
older landing components exist but are not mounted by current routes/homepage.
The build has no `/flowers`, `/moments`, or `/guides` routes. These are unfinished
surfaces, not eight separately failing implementations.

### ISSUE-010 - Medium: privacy wording overstates the guarantee

[The homepage claim](../lib/site.ts) says gifts live in the link, not on servers.
There is no per-gift database record, but gift contents are in query parameter
`b` and [server metadata](../app/bouquet/page.tsx) decodes them. Hosting and
link-preview infrastructure receive the URL. Compression is not encryption.

No implemented privacy page, recipient no-index metadata, expiry, or revocation
was found. Draft expiry does not expire shared links. Explain anyone-with-link
access and server processing; do not promise encryption or zero retention.

### ISSUE-011 - Medium: accessibility gaps

Production axe-core 4.12.1 measured the Save as Image button at 3.04:1 contrast
(white on `#d47a82`, 14px), below the 4.5:1 AA requirement. Gradient-backed
incomplete checks were not counted as confirmed failures.

[Modal](../components/ui/Modal.tsx) lacks initial focus, focus trapping,
background inertness, and focus restoration. A local modal left focus on its
trigger outside the dialog. The folded note also nests button roles.

### ISSUE-012 - Medium: failed audio says Playing

Local browser: abort `/sounds/piano.mp3`, select Piano, let it settle; the label
says Playing despite no audio. An isolated failing Audio implementation confirmed
that [the helper](../lib/soundtracks/ambientPlayback.ts) converts play rejection
into promise resolution. [The hook](../hooks/useAmbientSoundtrack.ts) interprets
resolution as successful playback and can suppress a same-track retry.

### ISSUE-013 - High: failed counter reads break the homepage

Local production build with deliberately unusable KV endpoint
`http://127.0.0.1:1` (fetch rejects the port), using a dummy token:

- Homepage: HTTP 500 and Next error document.
- Builder: HTTP 200 with its normal static content.
- Recipient: HTTP 200, but server payload includes the hidden footer's counter
  error digest. This is unnecessary coupling, not a proven recipient outage.

[Homepage](../app/page.tsx) and server Footer await the count without controlled
degradation. Repairing KV writes should not turn a nonessential statistic into a
critical availability dependency.

## Validation and limits

- Build, TypeScript, ESLint: passed.
- Vitest: 42 files / 146 tests passed with
  `NODE_OPTIONS=--no-experimental-webstorage`.
- Default command on local Node 26.11.1 had 16 storage-related failures;
  disabling experimental storage resolved them. CI uses Node 20.
- Creation, required fields, share request, preview, recipient reveal, invalid
  links, and PNG download were exercised. Successful export is not fidelity.
- Recipient at 390 x 844 showed no horizontal overflow; this is not a full
  browser/device matrix.
- Concurrency checks used isolated mocks. Audio failure used local interception.
- Existing image tests assert mocked blob output, not actual visual equivalence.
- Vercel secrets/settings/logs were not inspected. Videos could not be captured
  because ffmpeg was absent. Audit browser sessions/local servers were closed.
- The original review retained screenshots and the downloaded PNG as session
  evidence; this repository record preserves reproduction details without
  depending on machine-specific session paths or adding binary captures.

## Additional observations, not confirmed defects

- Hero PNGs are roughly 2-2.6 MB despite small rendered widths; piano and
  instrumental assets are roughly 6 MB. Ten font families are configured.
  These justify profiling/optimization, not an unmeasured speed claim.
- A personalized [OG endpoint](../app/bouquet/og/route.tsx) exists but recipient
  metadata does not reference it.
- Native mobile sharing/manual-copy fallback, examples, and templates may improve
  usability. Accounts, payments, scheduling, and delivery receipts are not
  requirements or broken promises of today's product.

## External checklist reconciliation: 2026-10-19

The owner supplied a 42-item Claude checklist from another conversation.
This table reconciles it with this checkout and audit; it is not a new bug
report or a second task list. IDs below refer to the single
[backlog](./backlog.md). "Existing" does not mean exhaustively tested on every
browser. Priorities and the suggested two-hour estimate were not adopted.

| External item | Disposition and canonical work |
| --- | --- |
| 1. Replace localhost URLs | B06/B10: verify production origins; local-development overrides are intentional. No new blanket URL-replacement task. |
| 2. Deploy to Vercel | Already deployed at the audited live URL. Not an open initial-deployment task. |
| 3. Production full flow | Previously exercised; repeat with a separate signed-out recipient context under B10 after fixes. |
| 4. Both copy actions use production URL | B06/B10; live share-screen URL was correct, but both clipboard outputs need explicit release verification. |
| 5. Save as Image / html2canvas | B04/B10. Actual live download worked but fidelity failed. Current recipient export uses a custom canvas renderer, not the legacy html2canvas helper. |
| 6. Audio loads and plays | B09/B10; success and failure paths matter. |
| 7. Counter increments on create | B01/B05. Current action is copying, not creation; metric semantics require a decision. |
| 8. Full mobile flow | B08/B10/D06. Prior recipient-width check was not complete phone/browser validation. |
| 9. Stale bouquet summary on category switch | Current gallery renders the summary only when the selected bouquet belongs to the active category. No new confirmed bug; B10 covers navigation verification. |
| 10. Save primary / send-back outline | Already implemented in recipient actions. Preserve hierarchy in D06; contrast remains B08. |
| 11. Recipient preview opens a new tab | Preview worked in the audit; current Link intentionally navigates in the same tab. New-tab behavior is not an established requirement. B10 verifies preview and return behavior. |
| 12. Optional From | F01: proposed behavior change, not a bug. Builder and decoder currently require a sender. |
| 13. About | B07: real content/destination or honest unavailable state. |
| 14. Privacy and counter cookies | B07/ISSUE-010. Do not copy the proposed policy: query gifts are server-processed; the reviewed fingerprint deduplication uses sessionStorage, not a counter cookie. Verify actual production cookies before making claims. |
| 15. Contact | B07; a direct email destination may be sufficient without a new form/backend. |
| 16. Six guide routes | L01: optional guide-based starter entry points, not required pages for the core release. |
| 17. All footer links including Photo card | B07. Do not create every historical label's feature just to make a link work; remove or label unavailable destinations. Photo card belongs to R01/R02. |
| 18. 1200 x 630 OG artwork | B06/L09. Generic OG asset and generated endpoint already exist; current origin/wiring is the actionable issue. |
| 19. Default Next favicon | L08: icon exists; its visual identity has not been verified. Not recorded as a confirmed default-icon bug. |
| 20. All bouquet modal content | L05/B10. Gallery already renders description, meaning, facts, mood, and perfect-for fields; verify all entries rather than rebuild the modal. |
| 21. Copy/create/error toasts | B10. Copy and export/error feedback exists; no obligation to add a toast just for reaching Share. |
| 22. Completion confetti/petals | F09, deferred and occasion-sensitive; not a ship blocker. |
| 23. Step sparkles | Already present in StepIndicator. Review accessibility/motion in D03/D06 instead of adding duplicate effects. |
| 24. Dark-mode testing | B08/B10/D06, including measured contrast failure. |
| 25. Recipient loading skeleton | Already implemented; B10 verifies it. Query parameter decoding is current behavior, with legacy hash fallback. |
| 26. Invalid/expired links | Friendly invalid-link state and create CTA already exist and were tested live. Existing encoded gifts do not expire; do not imply otherwise. |
| 27. Feeling search across bouquet categories | F10: current unmounted helper searches flower content, not bouquet categories. This is a candidate feature, not a working builder filter needing only a smoke test. |
| 28. SEO on all pages | B06/B07/L09; only shipped public routes, with recipient privacy taking precedence. |
| 29. Resend email integration | F02, distinct from approved final-phase S01 email composition. |
| 30. Photo card / flip reveal | R01/R02; media and motion must pass existing cost/privacy/simplicity gates. No separate duplicate feature. |
| 31. `/create?preset=love-letter` | L01. Current decoder expects compressed gift data, not a plain slug. Choose and implement a compatible preset contract before publishing such links. |
| 32. Share Bloom promotion | F03; source component exists but is not mounted. |
| 33. Example gallery | L01; source gallery exists but is not mounted. |
| 34. Custom domain | S03, already recorded. |
| 35. Voice/photos via Vercel Blob | R01/R02; storage provider not selected and no upload implementation approved. |
| 36. Watercolor composition engine | F04, optional research rather than an engine rewrite commitment. |
| 37. Expand to 30+ bouquets | L07; no arbitrary catalog-size target accepted. |
| 38. Gift-open analytics | F05, conditional privacy/product research, not read receipts. |
| 39. Recipient donation button | F06; proposed location may conflict with the recipient-first experience. |
| 40. Internationalization | F07, deferred. |
| 41. Downloadable QR | F08, deferred with real link-length/scanning constraints. |
| 42. Mobile native share | L03, already recorded. |
