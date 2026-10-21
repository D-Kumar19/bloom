# D02: two contemporary floral compositions

Prepared 2026-10-20. Status: two studies ready; composition approval pending.
Open [the interactive comparison](./compositions.html) directly in a browser.
Nothing in this batch changes the application, the five-step builder, or existing
gift links.

## Owner direction and scope

The owner approved proceeding from D01 with an explicit refinement:
**"more colorful, less rustic, more contemporary, less paper-like for sure."**

That refines the original florist-worktable direction. Keep flowers, care,
deliberate composition, and sender-written emotion. Do not treat the earlier
kraft/paper samples as an approved site palette or visual requirement.
The earlier [reference board](./reference-board.html) is research history,
not the chosen homepage.

These are compositions for review, not production-ready implementations.
They intentionally use only existing local images and system fonts. Final
typefaces, color tokens, motion, customization behavior, and export are D03-D06.
No external artwork, font service, dependency, or new application route was added.

## How to compare

Use the controls above the study:

1. Switch **Concept A / B**.
2. Compare **Homepage / Recipient**.
3. Try **Birthday / Sympathy**. Both concepts use the same main bouquet and
   sender/recipient examples, not more flattering imagery for one direction.
4. On Recipient, compare **Short / Long** notes.
5. Choose **390px mobile** on a large display, or resize the browser.

Primary sample images: Sunflower Burst for birthday; Eucalyptus and White for
sympathy. A also shows an existing poppy as a contrasting secondary gallery
object. Those are study fixtures, not new product defaults, an occasion selector,
or inferred occasion logic.

The local navigation buttons switch studies. Disabled download/create actions
are marked as study-only; they do not pretend to export or create real gifts.
Homepage production CTA is documented as **Create your bouquet**, not
"Explore the recipient study." Recipient production secondary action remains
**Send a bouquet back**, not the review's return-home navigation.

## A / Color, delivered

**Idea:** a direct, graphic gesture. Big sans-serif words, strong color planes,
an arranged photographic gallery, and minimal decorative interface.

- Desktop homepage pairs a prominent invitation with two deliberately placed
  photographs. It is a composition, not a catalog of equal-weight cards.
- Mobile brings the photographs first, then the invitation and main action.
  Images retain an honest rectangular boundary rather than fake cutout edges.
- Desktop recipient pairs flowers and note as one uninterrupted composition.
  The message is a color field, not simulated stationery.
- Mobile stacks portrait then message; long notes expand naturally.
- Birthday explores coral, plum, and acid yellow. Sympathy explores mint,
  dark teal, and lavender with calmer copy; no confetti or forced sound.

**Strengths:** immediate character, strong hierarchy, visible connection between
gift and note, no dependence on paper textures or elaborate animation.

**Tradeoffs:** saturated fields may compete with personal content. The gallery
is busier than a single portrait. Long notes grow the desktop pair vertically,
so the flower column needs care rather than becoming empty filler.
The proposed colors are candidates, not a demand that every existing gift look
coral/yellow. Existing sender-selected card/backdrop settings must survive.

## B / A moment apart

**Idea:** give the bouquet its own space, then move into the sender's words.
Spacious color, one large photographic object, expressive display type, and
an uninterrupted reading field.

- Desktop homepage leads with one large portrait on the left and a separate
  invitation on the right. The composition relies on scale and space rather
  than a layered gallery.
- Mobile keeps one portrait above the invitation; the main title is reduced
  rather than squeezing desktop-scale typography into the screen.
- Recipient begins with a dedicated bouquet view, then a separate full-width
  note field. A keyboard-operable anchor reaches the note; content is already
  present and does not depend on an animation completing.
- Birthday explores cobalt and peach; sympathy explores teal and pale mint.
- The short/long notes use a measured reading width, not a fixed-height card.

**Strengths:** calmer gift presentation, clear sender-word priority when reading,
room for a restrained opening transition without needing fake unwrapping.

**Tradeoffs:** more vertical travel, especially on mobile. The image-to-note
transition must not hide the note or add another obligatory reveal step.
A large photo plus serif type can still feel generic if final typography,
copy, spacing, and motion lack distinction; color alone does not solve that.

## Differences that remain without the palette

| Question | A | B |
| --- | --- | --- |
| Homepage object structure | Two-photo arranged gallery | One isolated photographic portrait |
| Desktop invitation emphasis | Large graphic sans headline in a contrasting half | Quieter display-type invitation beside a dominant object |
| Recipient structure | Flowers and words share a paired composition | Dedicated flower presentation, then full-width reading field |
| Default emotional energy | Direct and lively | Intimate and spacious |
| Main risk | Visual noise/competition | Excessive vertical distance or too-familiar editorial treatment |

Neither concept adds options or stages. Both must eventually preserve guest
sharing, drafts, existing links, user-selected rich text, note/backdrop choices,
audio, reduced motion, failure handling, and saved-image fidelity.
The studies are not evidence that those integrations already work in a redesign.

## Companion states and limitations

The comparison includes a reserved-image loading specimen and an invalid-link
specimen with honest copy and an explicitly disabled study action.
These are review specimens, not actual network failure simulations.

No dark-appearance study, complete builder study, soundtrack UI, or export is
claimed here. Keeping those capabilities is a constraint for the approved
system, not permission to silently remove them. Final asset provenance remains
unverified as recorded in D01.

## Validation

- Browser checks covered 24 combinations of concept, surface, occasion, note
  length, and desktop/mobile review frame: visible headings, controls, and
  message bodies did not overflow horizontally; main images loaded.
- The two long notes contain 162 and 181 words, below the existing 200-word
  limit. They use actual paragraphs rather than filler text.
- Native keyboard activation of B's reading link focuses the note.
- Targeted axe-core 4.12.1 WCAG 2 A/AA checks passed on A birthday/home,
  A birthday/recipient, and both sympathy long-note recipient studies.
  These are study-document checks, not full product accessibility certification.
- Local image files only: no uploads, remote imagery, font requests, analytics,
  cookies, or draft storage. Review switches reset on reload intentionally.
- App builds/tests were not rerun for this documentation-only batch.

## Next gate

Select A, B, or request concrete revisions before D03. A mixed direction needs
one coherent composition, not both complete styles layered together.
Approval covers layout and tone for a motion prototype, not an automatic
full-site rollout. D03 must still demonstrate opening, immediate note access,
touch/keyboard operation, and the reduced-motion equivalent.
