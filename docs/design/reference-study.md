# D01: a tangible gift, not a themed dashboard

Prepared 2026-10-20. Status: approved with the refinement below.
This does not approve a screen design, asset replacement, or production rollout.

**Owner refinement:** "more colorful, less rustic, more contemporary, less
paper-like for sure." The initial material samples below are research, not an
approved palette or a requirement for paper-heavy UI. See
[D02's contemporary compositions](./compositions.html) for the next iteration.

Open the [visual reference board](./reference-board.html) in a browser.
It works directly from disk, with no server, external fonts, scripts, analytics,
or third-party image requests. Keep it beside the repository's existing assets.
The board is a review document, not an application route.

## Recommendation

Use tangible paper, botanical color, clear editorial structure, and an honest
photographic presentation. Show the gift before explaining the brand. Let the
sender's words supply emotion rather than manufacturing it with ambient effects.

Warm does not mean every surface must be beige. Human-designed does not mean
deliberately crooked controls, handwritten navigation, or artificial wear.
The distinguishing work is composition, hierarchy, coherent imagery, and a
recognizable opening experience.

## Annotated sources and provenance

These are references to inspect, not assets acquired for reuse. No third-party
photograph, logo, proprietary typeface, or page implementation has been imported
or hotlinked into the board. No reuse license has been established.
The material/type examples on the board are original HTML/CSS studies.

| Source | Evidence reviewed | Principle to translate | What not to carry over |
| --- | --- | --- | --- |
| [Saipua](https://saipua.com/) | Rendered homepage: tools, worn wood, cloth, vessels, restrained overlay navigation; homepage text describes floral/soap craft and the farm | Materials establish a credible world before an abstract headline; color comes from objects | Literal rustic backdrop, text on busy photography, a full-screen scene that obscures Bloom's action |
| [Floret](https://www.floretflowers.com/) | Rendered homepage: large garden photography, display headings, small utility labels, promotional navigation and overlays | Give flowers scale and distinguish expressive from functional type | Countdown urgency, carousel, broad retail navigation, newsletter interruption |
| [Papier](https://www.papier.com/) | Rendered homepage campaign: stationery among physical objects; paper edges, shadows, display/utility type contrast | A note is a placed object with reading margins, not another UI panel | Shopping chrome, promotional banners, catalog-size decision burden |
| [Present & Correct](https://www.presentandcorrect.com/) | Rendered homepage: large object photography, restrained interface type and dividing rules; [shop article](https://www.presentandcorrect.com/blogs/blog/our-shop) inspected for physical context and attribution | Useful labels, clear organization, deliberate rules instead of repeated rounded containers | Collector/catalog density, image scale that hides the primary action |

Present & Correct's shop article credits photographs to Nick at Building
Narratives. That attribution is not permission to reproduce them.
Other references' individual image creators were not established.
These observations are not endorsements of the sites' accessibility or speed.
External sites and campaigns can change.

FLOWERBX was blocked by browser verification, so it is not treated as visually
reviewed evidence. Met open-access and Biodiversity Library requests were also
unavailable; no rights claims or botanical-art recommendations rely on them.
Paperless Post's feature copy was readable, but an opening interaction was not
tested. It is not evidence for a motion design. D03 must test Bloom's own bounded
interaction; this study does not pretend a still reference validates motion.

## Physical vocabulary

1. **Paper:** a legible note with margins, restrained edge/shadow treatment,
   and an optional personal handwriting style. Interface text stays clear.
2. **Wrapping:** layering expresses hierarchy, not ornamental panels everywhere.
   Current bouquet wrapping is baked into images and cannot unfold separately.
3. **Botanical ink and color:** let flower colors lead. Deep green/ink, warm
   paper, foliage, and a small warm accent are exploratory materials, not
   approved tokens. Final colors need contrast and dark-appearance checks.
4. **Photography:** use deliberate rectangular photographic plates with
   unobscured flowers. Do not pretend opaque scenes are isolated stems.
5. **Tone:** a birthday can be warm and lively; sympathy must remain quiet.
   These are study examples, not a new occasion selector or inferred classifier.

## Existing asset assessment

Reviewed all 15 hero images as a collection on the board, with close inspection
of Red Rose Classic, Blush Peony Cloud, and White Lily Still.
Catalog metadata is in [the bouquet catalog](../../lib/bouquets/bouquets.ts).

All hero files measure **1024 x 1536 (2:3)** and are approximately **1.8-2.6 MiB
each** on disk. This is source-file size, not measured network transfer:
Next's responsive image pipeline may serve a different format and size.
Future performance budgets need runtime measurements, not a total of originals.

| Existing image | Visual fit / constraint | Proposed study treatment, not an asset change |
| --- | --- | --- |
| Red Rose Classic | Kraft wrap, red paper/ribbon, neutral warm background; coherent physical object | Primary warm/romantic comparison image; retain full wrapping and ribbon |
| Blush Peony Cloud | Floating flowers/ribbon in a cloud scene rather than a physical work surface | Keep selectable and use an honest image boundary; do not treat clouds as a transparent object or site-wide art direction |
| Dusty Lavender | Cool purple bouquet on draped fabric; cooler lighting than kraft scenes | Keep as a cooler-palette stress test; do not recolor flowers to match the UI |
| Crimson and Cream | Dark red/ivory composition and fabric with prominent ribbon | Keep as a rich-color contrast test; give the photograph breathing space |
| Sunflower Burst | Bright yellow flowers with kraft wrapping, fuller crop | Representative birthday image; avoid extra yellow decoration competing with blooms |
| Tulip Riot | Saturated mixed tulips and pink wrapping/ribbon | Check that restrained surrounding UI handles saturation without adding badges/effects |
| Tropical Bright | Vase arrangement, not a hand-tied wrapped bouquet | Present as a photographic plate; cannot use a universal hand-tied unwrapping illusion |
| Pastel Spring | Soft mixed flowers, cream wrap and draped backdrop | Keep as a softer celebratory alternative, not a mandatory occasion default |
| White Lily Still | Cream wrap and pale green ribbon; fixed sympathy text on the photographed tag | Include a sympathy test; flag a possible future text-free asset replacement, never overlay a false translation |
| Eucalyptus and White | White roses, eucalyptus, neutral background, kraft wrapping | Strong quiet-recipient study candidate without the lily tag's fixed wording |
| Dried Herbal | Tall wheat/dried stems, low saturation | Preserve stem tips; test generous top space and distinction from the warm background |
| Wildflower Field | Loose flowers with uneven heights and open silhouette | Preserve the whole portrait; useful test against overly tight container cropping |
| Cheerful Daisy Mix | Dense bright yellow/white flowers | Check small-view detail/readability without adding more imagery |
| Garden Herb | Green-dominant leaves/stems, narrow botanical detail | Check enough separation from green UI surfaces; don't camouflage the gift |
| Single Stem Poppy | One red bloom with sparse stems and wrapping | Test a deliberately sparse gift; don't enlarge/crop until it looks like a different arrangement |

### Provenance and replacement boundaries

- Existing files and catalog entries do not establish photographer, generator,
  source terms, or distribution rights. Those remain unverified; owner/source
  records are needed before claiming licensed photography.
- Nothing has been deleted, regenerated, cut out, or retouched.
- No complete asset overhaul is a prerequisite for composition studies.
  Reuse existing images for review; preserve IDs and old links.
- Two concrete replacement candidates, **only if later approved**, are the
  peony's scene for collection consistency and the lily's embedded text.
  Replacement is not automatically better: the owner may prefer the fantasy
  peony, and the existing gift must remain understandable.
- If D02 demonstrates that isolated flowers are essential, stop and estimate
  that separate asset work. Do not hide the cost behind CSS blending/masking.

## Typography and motion boundaries

The application currently loads ten Google font families, including optional
note fonts. This study does not remove them or invalidate saved formatting.
The board uses system Georgia/Arial/Courier to explore roles without adding
network dependencies. Final UI typography is a D04 decision, not approval to
expose more font choices to users.

Motion hypothesis: one short, user-triggered presentation/reveal; static readable
content and keyboard/touch access remain complete. Avoid busy looping particles,
mandatory dragging, fake paper physics, and an animated wait before reading.
No interaction prototype or measured timing is claimed in D01.

## D02 brief after reference approval

Compare two structural hypotheses, not two color schemes:

- **Shared work surface:** gift and note placed in one spatial composition;
  creator choices sit around a stable gift preview.
- **Editorial presentation:** a more sequential, typographic composition;
  one focused object/decision at a time, with a clear transition to the note.

These are hypotheses, not completed compositions. Both must cover desktop/mobile
home and recipient views, short and long messages, birthday and sympathy, and
believable error/loading/control placements. Use the same representative gifts
to make comparison fair. Protect five clear-purpose steps and guest sharing.
Do not add templates, occasion questions, accounts, uploads, or extra steps.

## Review gate

Owner approved proceeding to D02 with the refinement recorded above.
Acceptance here approves principles and use of existing images for studies,
not this board as the website layout, the exploratory palette, final asset
rights, motion, or implementation.

Validation: all 15 images loaded locally; desktop (1440px) and mobile (390px)
layout checks showed no horizontal overflow. The board requests no external
images or scripts. Keyboard links have a visible focus outline.
After correcting two study-only ARIA labels, axe-core 4.12.1 reported zero
WCAG 2 A/AA violations and zero incomplete checks on the board at mobile width.
That result applies to this review document, not the Bloom application.
Application source is unchanged in this D01 batch; application build/tests are
not required for a standalone reference document.
