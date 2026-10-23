# Bloom experience improvement plan

## Current direction - 2026-10-22 (supersedes the redesign below)

The owner rejected the implemented "Color, delivered" direction: it feels less
smooth and crafted than the previous UI, with overly square controls and a
robotic overall composition. Do not merge the experiment into production or
treat its prior composition approval as current acceptance.

The foundation is the released v0.0.4 UI on main: softer visual composition,
rounded controls, the existing five-step flow, and gentle interactions.
The objective is to make that experience clearer, more cohesive, and more
comfortable, not to make it look conspicuously different.

### Active work and boundaries

The canonical open checklist is [D01-D06 in the backlog](./backlog.md):
audit existing friction; refine color/hierarchy; polish controls/feedback;
improve artwork and reading; reduce navigation friction; validate and ship
small approved increments. Their former redesign definitions are superseded.
Previous discovery work remains historical evidence, not completion of these
new tasks.

Implementation now uses `feat/experience-polish`, created from released main
`22d74bb`. Only planning/release-status documents were transferred from the
experiment. Its replacement UI was not imported. The experiment is retained
on `redesign/color-delivered`; keep its code and screenshots for comparison.
Any independently useful fix found there must be re-evaluated and tested
against main, not treated as an approved visual change.

Review candidates include balanced surface/accent colors, readable secondary
text, consistent rounded buttons, clearer selection/focus states, less redundant
framing, better image scale, comfortable note reading, and more useful progress
and recovery cues. These are investigation targets, not established defects.
A sidebar/sticky preview requires a demonstrated navigation or editing benefit;
no new panel, step, framework, or source reorganization is approved by default.

Preserve the entire artwork when appropriate; compare actual flowers against
their UI surroundings rather than relying on CSS consistency alone. Include
cloud, vase, and sympathy assets. Do not mandate picture mounts, crop away
important content, or use filters to hide mismatched imagery.

For each small slice: capture a baseline, state the problem and expected
benefit, implement a bounded change, test touched behavior, compare desktop/
mobile and light/dark screenshots, and get owner review on the working preview.
Owner preference and task comfort matter alongside contrast and regression
checks. No fresh concept-board phase or full-site replacement is required.
Keep shipping independent of Templates, Wander, accounts, or later features.

## First polish batch - 2026-10-23

**Owner acceptance, 2026-10-23:** the hosted Vercel preview looks good and the
owner authorized closing D01-D06 and merging
[PR #6](https://github.com/D-Kumar19/bloom/pull/6).
[Hosted verification](https://github.com/D-Kumar19/bloom/actions/runs/39951446249)
and Vercel passed for implementation `5d1cfdb`. The closed scope is the
increment below, not an exhaustive device/combination audit. The original
readiness notes below describe the pre-approval state.

### D01: observations and priorities

The previous implementation session left an uncommitted first pass. This batch
reviewed and completed it against the released UI, not the rejected composition.
Retain the existing warm/charcoal surfaces, serif headings, rounded controls,
five-step pipeline, stacked note, and gently swaying photograph.

| Priority | Observed issue | Bounded change |
| --- | --- | --- |
| High | Homepage helper text, inactive progress labels, and white-on-light-rose selections failed automated contrast checks. | Increase supporting-text contrast; reuse the existing primary button's dark rose for filled selected controls. |
| High | Success/warning feedback and dark-mode informational toasts had unsuitable foreground/background pairings. | Keep rounded toasts and existing lifetimes; use readable green, amber, and appearance-aware neutral pairs. |
| High | 2:3 hero images were cropped into 4:5 gift frames; the detail modal showed a square thumbnail. | Preserve the complete portrait, including wrapping/vase/clouds, without replacing the existing photo treatment. |
| Medium | Returning to a celebration/calm bouquet reopened the Romantic tab. Mood tabs lacked arrow-key navigation. | Initialize the current mood from the selected bouquet; implement roving focus, arrow/Home/End keys, and a labelled panel. |
| Medium | Bouquet and backdrop selection actions were small/inconsistent; backdrop and sound choices lacked pressed-state semantics. | Rounded 44px selection actions, consistent selected fill, explicit focus/pressed states; retain separate learn/select actions. |
| Medium | The long preview separates senders from copy actions; step navigation always animated scrolling. | Add an optional native sharing anchor that transfers focus below the sticky header; honor reduced motion on step scrolling/entry. |
| Medium | At 320px the share panel's intrinsic grid size forced horizontal scrolling. | Allow the step panel to shrink with `min-width: 0`; keep the hanging photograph fluid within its existing maximum size. |

No evidence currently justifies a sidebar, new page layout, new palette, or
replacing the opening animation. Square catalog thumbnails remain intentional
browsing summaries; full artwork is available in details and the gift itself.
Source images are unchanged. Custom note-color controls are also unchanged.

### D02-D05: implementation and preservation

The action token is the already-shipped primary-button color `#9a4a50`
with hover `#7f3b41`, not a newly selected brand palette. Decorative brand
colors and gradients remain available separately. The homepage spacing and
primary pill button, five steps, advanced controls, gift URL contract, counter
semantics, and PNG capture pipeline are preserved.

The share anchor is supplementary, not a new required interaction. Its target
is focusable programmatically and offset below the sticky progress header.
Portrait sizing now preserves all 15 assets' verified 1024x1536 proportions.
The taller complete images are an intentional trade-off for not cropping;
the anchor avoids requiring repeated scrolling for senders ready to share.

### D06: evidence and remaining acceptance

Local automated validation: 54 files / 277 tests passed, plus type-check,
lint, production build, and whitespace checks. Targeted coverage includes
keyboard tabs, selected-mood initialization, all catalog heroes, rounded button
contracts, sharing target, pressed states, toast dismissal/colors, and reduced
motion step scrolling. Existing asynchronous StepIndicator test warnings remain;
passing tests do not establish visual approval.

Production-build Chromium checks covered the five-step peony flow, draft
restoration after restart, light/dark picker, detail modal, sharing anchor,
creator preview, a normal recipient link, and warm/dark PNG downloads.
The dark sympathy fixture intentionally omitted a gift ID to exercise legacy
links. Both PNGs were opened and inspected; the rich note, full portrait, dark
card, and double border survived capture.

The final build measured 320px document width at a 320px share viewport and
1440px at a 1440px picker viewport. The sharing anchor focused its section
below the sticky header. Reduced-motion emulation confirmed the step panel's
computed animation was `none`; a utility-only attempt did not override the
custom animation, so the component now omits that animation when preferred.
Desktop arrow-key navigation moved both focus and selection to Celebration.

Settled mobile scans reported no automated WCAG A/AA violations on the home,
picker, backdrop, share, and dark-recipient samples. Decorative gradients,
animated progress, and some backdrop text still require manual contrast review.
Do not interpret these sampled checks as a whole-site accessibility certification.
The local server was started with Redis variables blank; production counters
were not exercised or increased.

Evidence screenshots and the two PNGs are stored in the session files with
the `polish-` prefix, not committed as repository assets. No external imagery
or additional dependencies were introduced.

Owner preview comparison and hosted CI/preview acceptance are now complete.
D01-D06 are closed for the accepted increment. Remaining coverage limitations:
exhaustive catalog/long-note and state matrices, complete manual keyboard/
contrast/motion review, and real-device Safari/Brave verification. No further
visual batch is required without a concrete finding or new owner request.

## Historical redesign experiment - not approved for rollout

Everything below records the superseded direction and its implementation
evidence. It is retained for context only; any selection, next-step, or
deployment instruction below is historical and does not override the current
direction above.

Status: D01/D02 complete; A ("Color, delivered") selected. Partial application
integration exists on local `redesign/color-delivered` at `cb3f62c`.
No redesign deployment or complete redesign acceptance yet.
Owner decisions recorded 2026-10-19 and 2026-10-20.

## Progress reconciliation - 2026-10-22

### Integrated artwork pass

The redesign branch has now been rebased onto released main `22d74bb`.
Reliability changes, protected counting, local fonts, and Contact/Explore
pages are retained. All 15 catalog portraits loaded at their original aspect
ratio in the production-build browser check.

Existing artwork includes complete backgrounds, clouds, wrapping, and a vase;
it is presented as mounted portrait artwork rather than transparent flowers.
A consistent neutral mount connects home, picker, detail modal, recipient,
and export. Homepage photographs no longer overlap each other; the detail
modal now shows the same full hero artwork, not a square thumbnail crop.
No source image, color filter, or blending effect was added.

Desktop/mobile checks covered home, all catalog moods, the cloud-background
peony detail, a complete builder-to-share flow, and warm/dark recipient gifts.
Two actual PNG downloads were inspected, including rich text and a dark card
with a double border. Measured layouts had no horizontal overflow at the
checked 390px/1440px widths; the dark recipient was also checked at 320px.
Regression tests now cover every catalog portrait and immediate/keyboard
opening, including a flower-only legacy gift. The immediate-open button was
moved outside the interactive reveal stage.

Validation: 54 test files / 275 tests, type-check, lint, production build,
and diff whitespace checks passed. Existing React act warnings remain.
The share-panel contrast findings were corrected; a full post-change
accessibility review remains part of D06. Browser scans also reported
contrast requiring manual review over decorative backdrops and a success
toast contrast finding. No whole-site accessibility certification is claimed.
No branch push, preview deployment, or production merge has been performed.
Owner visual review, D03/D04 approval, and complete D06 acceptance remain open.

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
