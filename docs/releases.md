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

## Next release

As of 2026-10-22, the latest published release is `v0.0.3`. The reliability,
counter-protection, documentation, and CI changes are intended for a patch
release, **`v0.0.4`**, published by the owner on 2026-10-22.
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
