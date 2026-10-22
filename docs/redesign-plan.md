# Bloom: a florist's worktable

Status: D01/D02 complete; A ("Color, delivered") selected. Partial application
integration exists on local `redesign/color-delivered` at `cb3f62c`.
No redesign deployment or complete redesign acceptance yet.
Owner decisions recorded 2026-10-19 and 2026-10-20.

## Progress reconciliation - 2026-10-22

The discovery sections below describe the original sequence; their
selection-pending language is historical. The owner selected A and requested
real application integration rather than further standalone HTML review.
The WIP branch touches home, builder, share, recipient, export, and shared
chrome. D03/D04/D05 have partial implementation, not completed approval;
D06 remains outstanding.

Before a review deployment, integrate current main without losing the shipped
v0.0.4 reliability work, counter protections, local fonts, and Contact/Explore
pages. Validate the example link stays on the preview origin, staged opening
and immediate-open controls, contrast, reduced motion, draft/copy behavior,
and actual exported layout. Run targeted tests, then the full suite,
type-check, lint, build, and desktop/mobile browser checks. The older focused
9-test pass does not establish release readiness.

Deploy a branch preview for review after that integration and validation;
production waits for full-flow owner approval and D06 acceptance. New later
features are not prerequisites for shipping the redesign.

## D01 review material - 2026-10-20

The [annotated reference study](./design/reference-study.md) and
[visual reference board](./design/reference-board.html) are ready for owner
review. The board is a standalone local document, not a new shipped page.
It includes original material/type studies, links to reviewed external sources,
and all 15 existing bouquet images without cropping.

Key asset constraint: the existing portraits contain their own backgrounds;
the peony uses clouds, the tropical arrangement uses a vase, and the lily
contains fixed sympathy text. None should be treated as separable wrapping
or a transparent bouquet. Asset provenance remains unverified.
Reuse for composition review does not approve new imagery or claim rights.

D01 was approved with the explicit refinement **more colorful, less rustic,
more contemporary, less paper-like**. Keep flowers and personal care; do not
interpret the original worktable metaphor as a mandate for kraft, fake paper,
or literal rustic surfaces.

Open [D02's two composition studies](./design/compositions.html) and
[comparison notes](./design/composition-review.md). These cover desktop/mobile
home and recipient, birthday/sympathy, and short/long notes. Selection remains
pending; D03 has not started. No production layout, source structure, or
functionality was changed in this discovery batch.

## 1. Brief and boundaries

The owner wants a distinctive, sellable-quality product, not the familiar layout
seen across recent AI-generated sites. AI-assisted development is acceptable;
generic composition and insufficient art direction are the problem.

Chosen direction: **florist's worktable - tactile, intimate, restrained**.
Animation is welcome when it makes the experience distinctive and coherent.
"Sellable" means a polished, trustworthy product here; it does not authorize
payments, physical flower delivery, or a commerce backend.

Keep the account-free gift flow and current source layout. A visual
restructuring is allowed to be substantial; a framework/backend rewrite is not
necessary to achieve it.

### Why the current design feels familiar

The [homepage](../app/page.tsx) is a centered eyebrow/headline/paragraph/counter/
pill-CTA stack, with no bouquet visible in its main composition. The builder
uses many similarly rounded, bordered, shadowed containers and equal-weight
option grids. Typography, spacing, photography, and motion do not yet express
one strong organizing idea.

These are design judgments, not evidence that a particular tool made the site.
Rounded corners, symmetry, serif headings, and gradients are not inherently
bad. Banning those features or adding random asymmetry is not art direction.

### Experience to aim for

- Homepage: show the actual gift and a concise invitation to make one, rather
  than asking abstract copy and a statistic to explain the product.
- Builder: a stable work surface with the gift visible; choices feel like
  selecting blooms, paper, and light, not filling out a dashboard.
- Recipient: a quiet, deliberate gift opening with attention on the flowers
  and sender's words. Interface controls recede without becoming undiscoverable.
- Export: a considered keepsake from that same visual world, not a second
  renderer's unrelated interpretation.

This describes intent, not a prescribed desktop split layout. Composition
studies must determine the actual arrangement and mobile behavior.

## 2. Discovery and proof before production

### 2.1 Reference study - backlog D01

Gather a small set of annotated references: physical florist wrapping, botanical
photography, stationery, packaging, and a few digital interactions. Capture what
to borrow in principle and what not to borrow. Avoid using other AI-generated
landing pages as the entire reference pool.

Review the current assets as a collection: consistent crop, light, material,
color, resolution, and provenance. Keep assets that support the direction;
identify replacements explicitly. No assumption that more generated imagery
will create originality.

Gate: owner agrees that the references describe the intended world.

### 2.2 Two compositions - backlog D02

Produce two distinct arrangements inside the worktable direction, not palette
swaps of a shared template. Explore arrangement, scale, negative space, image/
text relationship, and how choices sit around the gift.

Each study includes desktop and mobile home/recipient views, real short and long
notes, and a quiet sympathy example as well as a celebratory one.
Keep controls and loading/error states believable.

Gate: owner selects a composition. If removing the logo makes it feel like a
generic app with different nouns, revise before building more screens.
This is a discussion criterion, not an objective "AI detector".

### 2.3 Signature interaction prototype - backlog D03

Explore a bounded wrapping/placement/opening interaction: paper yields, the
bouquet is presented, the note becomes available. Select a single coherent
signature rather than combining every visual effect.

Proposed motion constraints for approval:

- Direct actions respond promptly; do not delay the interface for choreography.
- Everyday transitions roughly 150-250 ms; a user-triggered opening sequence
  should reach readable content within about one second, or offer immediate skip.
- No mandatory drag gesture, scroll hijacking, cursor replacement, or looping
  particle blanket. Ambient animation must be subtle and pausable when needed.
- Reduced motion gets a complete static/short-fade experience, not missing
  content. All actions remain usable with keyboard and touch.
- Audio stays optional; no false Playing state or forced soundtrack.
- A sympathy note does not inherit celebratory confetti or playful copy.

These are proposed acceptance budgets, to be confirmed with the prototype,
not measured behavior of today's site.

Gate: owner approves the interaction in motion on a phone-sized viewport, not
only a desktop still image.

## 3. Specification and one vertical slice

### 3.1 Lock the approved system - backlog D04

Only after the visual studies, record concrete decisions here:

- Composition and breakpoints; what remains visible while editing.
- Restrained type roles and actual font choices, not a ten-font style sampler.
- Contrast-safe color tokens, materials, borders, radii, and lighting.
- Asset treatment and provenance; no essential interface text baked into images.
- Motion timing, reduced-motion fallback, loading/error/empty/disabled states.
- Gift/export equivalence and which dynamic effects become a still.
- Builder navigation, draft recovery, copy/share/preview behavior.
- A clear pipeline with one primary purpose per step; five steps are acceptable.
  Follow the [simplicity constraint](./product-direction.md#simplicity-constraint---owner-decision-2026-10-19).
  Do not present backdrop and audio as two equal catalog tasks disguised as one
  stage. Secondary choices are progressively disclosed; keeping defaults is easy.
- Old shared-link compatibility and existing theme/card choices.
- Performance budgets measured against a declared mobile/network profile.
- Light/dark behavior: keep current behavior until a specific change is approved.

Open decisions: final compositions, exact assets/type palette, whether builder
tasks use minimal staging or an integrated worktable, and the extent
of the opening interaction. No implementation-ready spec is claimed until
these decisions and prototype artifacts exist.

### 3.2 Build a complete small slice - backlog D05

Use one representative bouquet and note from selection through recipient and
download. Reuse existing encoding, content, validation, and state logic after
reliability fixes; do not replace the whole application to make a mockup easier.

Likely surfaces: [home](../app/page.tsx), [builder](../app/create/page.tsx),
[builder components](../components/builder), [recipient](../app/bouquet/BouquetViewer.tsx),
[shared styles](../app/globals.css), and [export](../lib/export/renderBouquetImage.ts).
Exact component decomposition follows the approved spec, not the reverse.

Gate: compare the actual browser slice with approved studies. Verify note
integrity, keyboard/touch access, failed media, and the downloaded keepsake.
Also verify that each step is understandable and defaults permit completion
without advanced typography/audio/media decisions. Compare confusion,
backtracking, visible choices, and transitions with today's five-step builder;
reducing step count alone is not an improvement.

## 4. Full rollout - backlog D06

### 4.1 Extend deliberately

Extend the approved slice through current options and the full state matrix.
Resolve the production/data-integrity backlog before replacing the deployed
experience. Capture desktop/mobile baseline and candidate screenshots with the
same gifts, and exercise old encoded links.

Preview deployments are the review surface. Do not ship the first plausible
generated result directly to production. A small reviewable sequence is
preferable to a repository-wide rewrite commit.

Release gates:

1. Owner approves composition, imagery, copy, and motion.
2. A sender can complete and recover a gift without losing words.
3. A recipient can read/open/save it without unnecessary dependencies.
4. Failure, reduced-motion, keyboard, mobile, and contrast checks pass.
5. Build/type/lint/unit checks and focused browser regressions pass.
6. Production smoke checks verify counter durability and share/metadata origins.
7. Backlog and handoff record what shipped and what remains.

### 4.2 Final-phase standout features

After core fixes, redesign, and polish, implement the owner's deferred roadmap
additions: email-ready sharing, then optional accounts and a private animated
bouquet journal, plus an owned production domain as a final brand/launch task.
Scope and acceptance constraints live in backlog S01-S03.
They do not block the initial redesign and must preserve the guest gift flow.
Authentication/storage/provider decisions need a separate specification before
implementation; this direction does not approve inbox access or automatic email
sending.

The [product direction](./product-direction.md) evaluates editable starters,
content, personal details, curated options, and conditional photo/voice media.
Those ideas do not bypass composition approval or expand this redesign into
an authentication, upload, or payments rewrite.

## Requirements to work mapping

| Requirement | Plan items | Tracked work / completion evidence |
| --- | --- | --- |
| REQ-001: distinctive florist worktable | 2.1, 2.2, 3.1 | D01/D02/D04, approved references and compositions |
| REQ-002: purposeful, accessible motion | 2.3, 4.1 | D03/D06, prototype and reduced-motion review |
| REQ-003: polished complete product, not only home | 3.2, 4.1 | D05/D06, working creation-to-export slice |
| REQ-004: protect working behavior and gift content | 3.1, 3.2, 4.1 | B01-B09/D06, verified backlog acceptance |
| REQ-005: repeatable review before broad generation | 2.1-4.1 | D01-D06, recorded approvals at each gate |
| REQ-006: durable findings and open work | Notebook documents | Audit, backlog, dated handoff |
| REQ-007: assess clutter without moving source | Repository assessment below | L04; no source moves |

## Repository assessment: tidy, not over-engineered

At this baseline the root has **12 tracked files and eight top-level project
directories** (including `.github`). Generated `.next`, `node_modules`, and
`tsconfig.tsbuildinfo` add local visual noise but are ignored by Git.
Adding this notebook adds one purposeful directory.

- Keep framework/package conventions at root: package manifest, lockfile,
  TypeScript/Next/PostCSS configuration, generated Next type declarations,
  Vercel configuration, Dockerfile and ignore/environment examples.
- Existing `config/` already centralizes lint/format/test configuration.
- `app`, `components`, `hooks`, `lib`, `public`, and deployment files have
  recognizable jobs. Their existence is not the cause of the functional bugs.
- The bigger maintenance question is disconnected features and duplicated
  display/export rules, not whether ten files are visible in the explorer.

Future cleanup, only if useful:

1. Hide generated folders in a personal editor view; don't hide application code
   or impose a shared editor configuration without agreement.
2. Decide which dormant feature surfaces to ship before removing unused code.
3. Consolidate duplicated presentation rules when repairing export fidelity.
4. If the owner later wants `src/`, move `app/components/hooks/lib` together in a
   separate change, update aliases/tooling, then verify build/runtime behavior.
   Leave `public` and convention-bound configuration where tools expect them.

Do not introduce packages, a monorepo, layers of dependency injection, a custom
design-system package, or new config indirection simply to shrink the root.
Current decision: **keep the source layout; document cleanup only**.
