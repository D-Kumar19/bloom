# Product purpose and feature discovery

Recorded: 2026-10-19. This is a proposed product brief and staged discovery
roadmap, not an approved media architecture, pricing model, or build commitment.
Implementation status remains in the [backlog](./backlog.md).
Shared terms live in the [glossary](./CONTEXT.md).

## Catalog and brand review - 2026-10-28

Owner scoped L04-L08 as one focused follow-up to PR #8, with a personal-detail
prompt in the existing editor and no catalog expansion without a concrete gap.
Implementation remains subject to Preview approval; see the [backlog](./backlog.md).

- **Cleanup:** route/import reachability, including dynamic PNG-export imports,
  was checked before removing five obsolete, unmounted components:
  RevealStageBackdrop, MoodPicker, BouquetsToday, FinalCTA, and MadeByNoOne.
  Their roles are superseded by BackdropLayer, the current mood tabs, dedicated
  Templates, and current landing/About content. No source moves or dependency
  changes. Keep working PNG export code, the development counter seed, and
  framework/root configuration. Unmounted flower/search, example-gallery, and
  sharing candidates are not shipped UI; retain for the explicitly open
  F03/F10 and future entry-point evaluation rather than deleting speculatively.
- **Descriptions:** all 15 thumbnail/portrait pairs were visually reviewed.
  Copy describes visible color, form, and wrapping before suggesting an occasion.
  Remove unsupported exact quantities, materials, botanical trivia, universal
  symbolism, and promises of emotional relief. The existing `facts` data key now
  supplies visual highlights, not sourced botanical claims. No new external
  factual claims or copyrighted artwork are introduced. A shared caveat frames
  meanings as suggestions shaped by personal taste and culture.
- **Personal detail:** "Why I chose these" stays inside the opt-in inspiration
  panel. It inserts an unfinished sentence for the sender to complete and appends
  to existing rich text rather than replacing it. This is ordinary note content:
  no new field, encoded schema, required step, higher minimum, or special export
  layout. Existing 2-200 word validation applies; exceeding the limit keeps every
  word and blocks Continue. Prototype implementation is not evidence that users
  find the prompt valuable; owner Preview review is still required.
- **Curation outcome: no additions in this increment.** Existing choices include
  15 bouquets across romance, celebration, quiet support, and everyday notes;
  9 stationery styles; 11 light/dark and still/moving backdrops; 10 editor fonts
  spanning clean, serif, handwritten, and typewriter styles; and 7 optional sounds
  plus silence. Visible artwork spans red, pink, purple, yellow/orange, white/green,
  dried neutrals, meadow mixes, and a single-stem option. This is an inventory,
  not user-preference research or proof that every taste is served. No observed
  request or usage evidence identifies a specific missing choice yet. More assets
  would add selection cost, payload, and provenance/licensing work without a
  supported benefit. Revisit only with a concrete preference gap; no new music,
  fonts, or generated flower images are warranted here.
- **Brand:** the old favicon was the Vercel triangle. The local
  [rosebud SVG](../app/icon.svg) evolves the existing header bud with the same rose
  and sage palette on a cream disc. Header/footer logos reference that SVG.
  [favicon.ico](../app/favicon.ico) contains 16, 32, 48, and 64px PNG frames;
  [apple-icon.png](../app/apple-icon.png) is 180px, flattened on cream. These are
  raster derivatives of the SVG, not separate artwork: regenerate all sizes from
  it when changing the mark. The current assets were rasterized with the Sharp
  version already supplied by Next; no new dependency or remote asset service.
  Browser metadata uses Next's icon file conventions. This does not implement
  L09's separate public metadata/OG review.

## Purpose

**Help someone turn a specific feeling into a personal digital gift that another
person can open, feel, and keep.**

Bloom does not need to simulate a delivery service or apologize for being
digital. The flowers are imagery; the sender's attention and words are real.
The product should communicate "I chose this for you", not just "I sent a link".
This is an aspiration to validate with people, not a promise to produce an
emotional response.

### Product principles

1. Specific attention beats a larger option catalog.
2. Make the first meaningful gift easy without an account.
3. Preserve the sender's voice; do not substitute generated sentiment by default.
4. The recipient's calm, privacy, and immediate access come before spectacle.
5. Atmosphere supports the note; it must not obscure, delay, or contradict it.
6. Do not imply physical delivery, verified receipt, encryption, or permanence
   that the product does not actually provide.
7. Protect simplicity: optional personalization must not create a longer default
   journey or a wall of choices.

### Simplicity constraint - owner decision, 2026-10-19

The essential tasks are **choose a bouquet -> write the note -> share**.
These describe the core value, not a three-screen target. The owner clarified
that **five steps are welcome if the pipeline is clear and each step has one
primary purpose**. Do not compress decisions into fewer screens merely to claim
simplicity, or add screens merely to make the product seem deeper.

The problem is hidden decision load: the current atmosphere step combines
backdrop selection and an independent soundtrack catalog. Two full selection
tasks do not become one just because they share a progress label.
Defaults help, but so do hierarchy, understandable choices, and clear scope.
Names and necessary validation stay with the note.

Proposed interaction model to test in the redesign:

- Apply a coherent default presentation automatically; keep audio silent unless
  deliberately enabled. Do not change chosen preferences when unrelated content
  changes without making that behavior clear.
- A five-step candidate is bouquet, stationery, note, atmosphere, preview/share.
  This is a prototype candidate, not a final screen specification. Each step
  makes its primary task clear and permits keeping a suitable default.
- In atmosphere, make the backdrop the primary choice. Sound can be a collapsed
  opt-in control, silent by default, rather than a second equally prominent
  catalog. Test whether this actually reduces confusion.
- Put advanced typography, border, and other secondary controls behind
  discoverable local actions near the relevant preview. Progressive disclosure
  does not require moving all presentation choices out of the main pipeline.
- Reveal a small curated selection first, with more choices only on request.
  Do not display separate full catalogs of fonts, songs, paper, and backdrops
  by default. Exact selection sizes await prototype research.
- Occasion starters are an alternative entry point, not a required occasion quiz.
- Photo/voice, if ever approved, belong in user-opened personalization; they
  cannot introduce new required or skippable wizard stages.
- No media upsell, account prompt, or optional-field checklist interrupts sharing.
  Account saving can remain a secondary action after the gift is ready.
- Optional controls remain keyboard-accessible and understandable; hiding
  everything in unlabeled icons is not simplicity.

Keep current choices and old shared links working while testing a simpler
selection surface. A large internal catalog does not have to become a large
visible decision set, and catalog reduction alone is not the goal.

Acceptance: a first-time sender understands the purpose of each step, can keep
defaults, and can finish without opening advanced controls or making an audio/
media decision. No step presents several equally prominent, unrelated catalogs.
Record visible decisions, confusion, backtracking, transitions, and completion
time against the current five-step baseline; fewer screens alone is not success.
Future media must not add required transitions. Do not invent a numeric speed
improvement before testing. Exact screen layout remains subject to visual approval.

### How to check whether the goal is realistic

Run a small initial round with, for example, five sender/recipient pairs who
consent to try a prototype. Do not require disclosure of their private notes.
Include an ordinary thank-you and a quiet support scenario, not only romance.

- Can a first-time sender choose a direction and finish without assistance?
- Can they explain each step's purpose and finish without opening advanced
  controls or dismissing repeated optional prompts?
- Do they change a starter to reflect the actual recipient?
- Can the recipient open/read without login, forced audio, or confusing taps?
- When asked "what made this feel chosen for you?", do recipients identify
  something specific, rather than only an animation?
- Can someone find the gift again or save a faithful keepsake?
- Where do people hesitate, abandon, or feel pressured to write more?

Record baseline and prototype observations before setting numeric conversion
targets. A small interview round offers directional evidence, not proof of
market demand. Use consented research and aggregate product events rather than
collecting private message content. Copy clicks are not deliveries.

## Feature assessment

### 1. Occasion starters - high value, modest scope

Recommended before expanding the catalog. Existing
[moments](../lib/moments/moments.ts) and [guides](../lib/guides.ts) already provide
some preset content; they are not a shipped end-to-end starter experience.

Example flow: choose "a love letter" -> see a suggested arrangement and
presentation -> optionally swap flowers -> write a personal note -> preview.
Offer "change bouquet" visibly even if the starter opens directly at the note
step. Never lock or hide earlier choices or overwrite existing work silently.

A romantic starter need not imply red roses. Offer a few distinct directions,
such as warm/bright/quiet, or start with "their favorite color" if known.
Allow "not sure" and skip; do not turn personalization into a questionnaire.

Start with a small set: thinking of you, thank you, celebration, missing you,
love letter, and quiet support. Sympathy requires careful, non-prescriptive
copy. Personal preferences override symbolic flower meanings.

### 2. Better descriptions, facts, and gentle humor - high value

Each bouquet needs a useful short description before a long story:

- What it looks/feels like: "Soft lavender and muted roses; quiet rather than bold."
- When it might fit: "For a gentle thinking-of-you note."
- Optional symbolism, explicitly described as an association, not universal truth.
- Optional sourced botanical fact, distinct from invented marketing copy.

Example playful tone: "For the person who deserves flowers on an entirely
unremarkable Tuesday." Use humor as a small reward while browsing, not a joke
on every label, validation message, or intimate note. Keep it out of grief,
apology, and sensitive support moments unless the sender chooses that tone.

Do not invent botanical facts, claim universal cultural meanings, or add
medical/therapeutic promises. Keep sources and review notes with content.

### 3. "Why I chose these" - strong differentiator, low infrastructure cost

An optional short personal detail beside the bouquet: "Yellow, because you
always notice the sun first." It makes a generic arrangement specific without
requiring a larger catalog or an AI-written letter.

Keep this distinct from the main note, optional, editable, and visible in both
preview and keepsake. Adding a field must preserve old shared links and define
length/validation. Treat it as private gift content, not public analytics.
Explore it as an optional writing prompt first; a separate field is justified
only if testing shows value without extra burden. Never add a required step.

### 4. Signature opening and a faithful keepsake - foundational

The [worktable redesign](./redesign-plan.md) already owns the opening prototype.
A deliberate paper/flower/note sequence can create presence without a 3D engine.
Make readable content promptly available, with touch/keyboard and reduced-motion
equivalents. No mandatory dragging, long intro, or background video.

The keepsake matters more than another particle effect. Export must retain the
sender's words and chosen visual treatment before adding animated/video export.
A visible save/revisit path is useful; forced recipient signup is not.

### 5. More flowers, themes, note styles, fonts, and songs - curate, then expand

More choices do not automatically create a richer experience. The current
product already has nine note styles, eleven backdrops, seven audio choices plus
silence, and ten configured font families.

First fix selection, consistency, accessibility, and asset quality. Then identify
gaps from real use: a less romantic arrangement, a quiet sympathy treatment,
or a recipient's favorite flower/color. Add small coherent collections with
clear differences, consistent photography, and useful descriptions.

Use a few strong default typography pairings; retain compatibility with existing
gift font choices. More fonts can remain an advanced option if users need them.
Ambient sound should be opt-in and honest about playback. New recordings need
rights to host/use them; a personal music subscription is not a distribution
license. No arbitrary popular-song uploads or forced autoplay.

### 6. Personal photo and voice message - potentially powerful, higher scope

Interpret "VM" here as a voice message, not a video message. Confirm before
implementation; video has a different cost/accessibility profile.

A shared photo or a short recording in the sender's own voice may convey more
than many additional themes. Neither is required to make the core gift meaningful.
Prototype the emotional/usefulness question first, then decide whether to fund it.
Neither gets its own default wizard stage, including a nominally skippable one.

Do not embed photo/audio bytes in the existing compressed URL. Base64 expands
binary data by roughly one third before other overhead; general text compression
does not reliably shrink already-compressed media. Long URLs can fail in browser,
mail, proxy, or chat paths, but there is no single universal length limit.
An oversized URL does not inherently reduce image quality; resizing/transcoding
is a separate, deliberate tradeoff.

Proposed implementation boundary:

1. Resolve account/storage economics and privacy model before production uploads.
2. Upload permitted media to managed storage; gift data references a stable media
   identifier, not raw bytes or an expiring URL baked permanently into the gift.
3. Decide who can access media. Sender-account privacy is not recipient-link
   privacy; anyone-with-link access must be disclosed if that is the chosen model.
4. Define file count/size/duration/type limits from a cost model. Validate actual
   file content, restrict formats, remove image metadata where appropriate,
   and handle processing, upload failure, and unsupported codecs explicitly.
5. Require recording consent, preview/re-record/delete controls, recipient
   play/mute, and a text alternative for the voice content. Never autoplay voice.
6. Specify retention, deletion, report/abuse handling, rate limits, and what an
   old gift shows after media expires. Do not promise forever hosting.
7. Maintain backward compatibility with text-only encoded links and their
   no-upload flow. Infrastructure failure must not erase the note.

Accounts can provide ownership and quota management, but do not solve storage
cost or abuse on their own. Paid media is a hypothesis: estimate storage,
processing, bandwidth, operations, and provider costs per active gift first,
then validate willingness to pay. Do not charge recipients to open a gift.
No payment integration or specific free/paid quota is approved yet.

### 7. A real domain - final brand/launch task

Owner requested this as a final standout item. A memorable domain improves
recognition and trust, but is not an emotional interaction feature.
The audited `bloom.app` was parked; do not assume it is owned or available at an
acceptable price.

Shortlist names, check relevant brand conflicts and renewal cost, then obtain
owner approval before purchase. Configure DNS/TLS, canonical origin, share/OG
URLs, redirects, and future OAuth callbacks. Keep existing shared links usable
through redirects while the old host is controlled. Sender-domain email
authentication is needed only if Bloom later sends mail itself.

## Recommended sequence

| Stage | Work | Gate |
| --- | --- | --- |
| Foundation | Reliability, note integrity, export fidelity, privacy | Existing backlog B01-B09 verified |
| Distinctive core | Worktable composition and signature opening | Visual/motion approval and full gift flow |
| Personal expression | Editable starters, descriptions, optional personal detail | Sender/recipient research, no preference lock-in |
| Curated breadth | Targeted flowers/presentation/sound additions | Demonstrated gap, rights, accessibility/performance review |
| Final standout | Email sharing, optional journal/accounts, owned domain | Explicit feature/design/operations approval |
| Conditional media | Photo/voice prototype, then constrained upload capability | Evidence of value, privacy/cost/retention decisions |

**Owner backlog triage, 2026-10-28:** only S01, F01, F03, and F09 remain
planned. S02, S03, R01, and R02 are not planned; F02, F04-F08,
and F10 are not prioritized. See the backlog's Deferred sections.
Rows below that mention accounts, journals, the domain, or media are historical.

These are stages, not calendar promises. Media and monetization are conditional,
not requirements to finish the redesign. Accounts and email retain their
previously requested end-of-roadmap placement.
Personal-expression and catalog ideas are possibilities to evaluate only after
the website is reliable, not a promise to implement every item. Any idea that
fails the simplicity constraint should be simplified, deferred, or dropped.

## Features to resist for now

Unbounded catalog growth, mandatory signup, public recipient activity,
emotional scores, streaks, automatic love-letter generation, delivery claims
based on copy clicks, commercial-song hosting, and 3D scenes added only to
look expensive. Bloom's distinctive asset should be personal attention, not
an accumulation of settings.
