# CI and draft releases

## Continuous integration

[CI](../.github/workflows/ci.yml) runs on pull requests, pushes to `main`,
and manual dispatch. It installs the frozen pnpm lockfile, type-checks,
lints, runs the unit tests, and builds Next.js. Pushes and manual runs on
`main` also build the Docker image after those checks pass.

Actions are pinned to full commit SHAs. Dependabot proposes weekly action
updates; review the upstream changes before merging. Jobs have timeouts,
read-only repository permissions, and checkout does not retain credentials.
Newer runs cancel superseded CI runs, but not an in-progress draft release.

The runtime baseline remains Node 20 and pnpm 9.15.9, matching the existing
Dockerfile. Updating the runtime is a separate compatibility task.

Font assets are bundled locally with their SIL Open Font Licenses. The
2026-10-22 PR build failed inside Turbopack's `next/font/google` resolver
with `next/font/google queries have exactly one entry` for Nunito.
Webpack also failed in the Google font loader, so a bundler switch was not
retained. Using `next/font/local` removes external font downloads and URL
parsing from CI, Docker, and Vercel while keeping the existing font families
and CSS variables. Default Next.js bundlers remain unchanged. Latin glyphs
are bundled; other scripts use system fallback fonts. See
[font sources and licences](../app/fonts/README.md).

## Changelog

## Release grouping agreed 2026-10-23

1. Verify O01 first. Counter functionality/protection is already implemented;
   this is operational acceptance, not a second implementation or a claim that
   every deployed abuse-control check has already passed. Record actual results
   and make fixes only if needed. Do not stress the shared production database.
2. Complete the agreed L work in focused, independently reviewed PRs. Include
   the already-deployed D01-D06 polish and completed L work in one release.
   A GitHub tag need not be created for D alone. Deployments can precede a tag.
   Review optional L candidates for usefulness; explicitly record any scope
   changes rather than silently calling unimplemented candidates complete.
3. Plan F candidates as a separate later release, subject to their individual
   product/privacy/cost decisions. A grouping is not approval to implement
   every candidate or a requirement to ship all ten together.
4. Keep standalone projects (S01/S02 and R01/R02) out of the D/L milestone.
   Clarify and scope them individually before implementation. S03 is not
   planned. This does not move L10's standalone discovery pages out of L.
5. At whichever release checkpoint the owner pauses development, perform DOC02
   README cleanup so it describes the shipped product. Do not wait for the
   whole roadmap or start README work during active feature implementation.

Reassess the version after final scope is known: a small fix/polish increment
can be `v0.0.5`; substantial new Templates/discovery/sharing features may justify
`v0.1.0`. Do not promise that additive features cannot regress existing behavior.
Each included PR still needs relevant tests, preview approval, and passing main
CI/Docker; check production and existing gift links before publishing.

### Unreleased - Lighter pages (PR #12, L02)

Bouquet images in the builder and gift page now use Next image optimization,
and note-only fonts load on demand. Measured at 390px on a production build:
the create page drops from about 6.5 MB to 450 KB, and home and gift links
from about 610 KB to 310 KB. Exported images are unchanged. See
[L02](./backlog.md). No release is created by this entry.

### Unreleased - Count every share path (owner report 2026-10-28)

Share bouquet (native share sheet) and copying from the manual-link box now
count the bouquet, matching the copy buttons. Each bouquet still counts once
regardless of which or how many share actions are used. No release is created.

### Unreleased - Catalog, brand, and share polish (PR #9, owner approved 2026-10-28)

[PR #9](https://github.com/D-Kumar19/bloom/pull/9) closes L04-L08: removes
verified-unused components, rewrites bouquet descriptions to match the actual
artwork, adds an optional "Why I chose these" prompt that appends to the note,
records a no-addition catalog decision, and replaces the default Vercel favicon
with Bloom rosebud icons. It also simplifies the final share step to one
primary action with a collapsed "More ways to share", and fixes a test type
error that failed hosted CI. No release is created by this entry.

### Unreleased - Experience polish (owner approved 2026-10-23)

[PR #6](https://github.com/D-Kumar19/bloom/pull/6) improves the existing UI,
not the rejected replacement design:

- Consistent rose selection colors and more readable helper/progress text.
- Rounded, touch-sized selectors with keyboard focus and pressed states.
- Keyboard mood tabs and restoration of the selected bouquet's mood.
- Full bouquet portraits in details, gift views, and PNGs, retaining the
  rounded photograph and gentle motion.
- A focused "Jump to sharing" shortcut and a narrow-screen overflow fix.
- Readable feedback toasts and reduced-motion-aware builder transitions.

Validation: 277 local tests, type-check, lint, production build, sampled
desktop/mobile checks, and two actual PNG downloads. Hosted PR verification
and Vercel preview passed; the owner approved the preview and closed D01-D06.
Exhaustive device/state and manual accessibility coverage is not claimed.
Main CI/production acceptance is checked after merge.

The owner chose to group this shipped polish with upcoming L work rather than
tag D alone. Choose the version against the completed scope above.
No release is created or published by this changelog entry.

## Published reliability release

The latest published release is **`v0.0.4`**, published by the owner on
2026-10-22. It contains reliability, counter-protection, documentation, and
CI changes following `v0.0.3`.
See the [published release](https://github.com/D-Kumar19/bloom/releases/tag/v0.0.4).
The private application's existing package version is `0.1.0`; it predates
this release decision and is not the source of truth for GitHub release tags.
The draft workflow takes an explicit version and does not change that field.

Pushing a feature branch is safe before Redis setup; opening a PR does not
require production credentials. Before merging to a branch that Vercel
automatically deploys, configure Redis and the counter secret for the target
environment. Without them, pages still work but counting returns unavailable.
Complete the [counter checklist](./counter.md) before calling the live
counter fixed or publishing release notes that claim production verification.

## Prepare a draft

Bloom is a hosted website, not a downloadable application. A GitHub release
records a source milestone; it does not package binaries or deploy to Vercel.
The workflow intentionally creates only a draft with generated release notes.

1. Commit and push the reviewed changes, merge to `main`, and wait for the
   complete push CI run to pass, including the Docker build.
2. Open **Actions → Draft release → Run workflow**. Select `main` and enter
   a new version such as `v0.1.0` or `v0.2.0-rc.1`.
3. The workflow rejects other branches, invalid versions, existing tags, and
   existing releases (including drafts). It requires successful push CI for
   the exact selected commit, not an older commit or a PR-only run.
4. It creates the draft targeting that commit and verifies the version,
   target SHA, and draft status. Prerelease suffixes set the prerelease flag.
5. Review the draft's generated notes, target commit, and outstanding
   [release acceptance checks](./backlog.md). Edit the notes for readers;
   generated commit/PR summaries are a starting point, not a curated changelog.
6. Publish manually only after owner approval. No push, tag, or workflow
   dispatch automatically publishes a release.

Accepted versions are `vMAJOR.MINOR.PATCH`, optionally followed by
`-alpha.N`, `-beta.N`, or `-rc.N`, where N is positive. Tags must be new;
never move an existing published tag. If updating the package version,
commit that change before CI rather than changing source during release.

The workflow uses GitHub's temporary token with `actions: read` and
`contents: write`, not a personal access token or Vercel credentials.
Vercel's existing Git integration may deploy a merge independently; creating
or publishing a GitHub Release does not control that deployment.

## Failed or stale drafts

A failed post-creation verification leaves the draft for inspection, not
publication. The workflow will not overwrite it on rerun. After confirming
that it is still unpublished, a maintainer can delete the draft in GitHub
and retry. Do not delete or move a published tag to reuse its version.

If code changes after a draft is prepared, use a new version or replace only
the unpublished draft after reviewing it. Require passing CI on the new
commit before recreating the draft.

## Verification status

Locally verified on 2026-10-22: actionlint v1.7.7 passed for both workflows,
and 16 shell simulations passed for validation gates, creation flags, and
draft verification. Action pins, permissions, timeouts, checkout credential
settings, and shell syntax were also checked.

Hosted verification passed on 2026-10-22 after PR #3 merged:
[main CI](https://github.com/D-Kumar19/bloom/actions/runs/39773818563)
passed verification and Docker, and the
[draft workflow](https://github.com/D-Kumar19/bloom/actions/runs/39774086677)
created and verified `v0.0.4` targeting `22d74bb13851fe08b4b1a75838b69da779ec3e5d`.
Vercel reported a successful production deployment.

The owner confirmed production Redis, once-only repeated copying, and correct
working links, and explicitly closed CI01/B01/B05/B06/B10. This sign-off builds
on earlier gift-flow smoke checks and local regression evidence; it does not
claim independent production load testing or exhaustive device/social-crawler
coverage. Operational follow-up is tracked under O01 in the
[backlog](./backlog.md). The owner subsequently published `v0.0.4`; the
draft-only automation did not publish it.
