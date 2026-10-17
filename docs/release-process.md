# Release Process

## Overview

Releases run automatically on pushes to `main` using [git-cliff](https://git-cliff.org/) 2.10.1 and [Conventional Commits](https://www.conventionalcommits.org/). Do not manually bump the package version. Release tooling is installed only in CI, not in `package.json`.

## Commit Messages

Use `type(optional-scope): description`. Release eligibility is checked separately from changelog inclusion:

| Commit | Release |
|---|---|
| `feat: add a method` or `feat(cache): add a method` | Minor |
| `fix`, `perf`, or `revert`, with or without a scope | Patch |
| Any conventional type with `!`, such as `refactor(cache)!: change API` | Major |
| Any conventional commit with a `BREAKING CHANGE:` or `BREAKING-CHANGE:` footer | Major |
| `docs`, `style`, `chore`, `refactor`, `test`, `build`, `ci`, or other types without breaking changes | No independent release |
| Non-conventional commits, including merge commits | No independent release |

For example:

```text
refactor(cache)!: change capacity semantics

BREAKING CHANGE: Capacity can no longer be changed after construction.
```

Every commit appears in the changelog, including non-conventional commits and release automation commits. Non-release commits wait for the next release, when the **full** changelog is regenerated from Git history. Unknown types and non-conventional commits appear under Other Changes. Existing historical prose is left untouched during this migration; the next release replaces it with generated history.

## Contributor Workflow

1. Create a feature branch and make changes.
2. Use conventional messages for commits. For squash merges, edit the squash message to reflect the intended release type; for merge commits, the individual commits are also analyzed.
3. Open a pull request targeting `main`. CI runs lint, type checking, coverage tests, and the project's TypeScript/terser build on Node.js 22, 24, and 26.
4. Merge after checks pass. Only eligible commits since the latest reachable stable `vX.Y.Z` release tag trigger publishing.

## Automated Release

The release workflow fetches full history and tags, preserves the `npm` environment and Node.js LTS runtime, and serializes releases without cancelling an in-progress publish. It then:

1. Installs pinned git-cliff and verifies the release policy with unit tests and disposable Git fixtures.
2. Checks release eligibility before calling `git-cliff --bumped-version`. Empty output, an unchanged version, or `There is nothing to bump` safely skips publishing; other errors fail the run.
3. Generates separate release notes with `--unreleased --strip header` and regenerates the full changelog. Every git-cliff call uses `--github-repo "$GITHUB_REPOSITORY"` for repository-aware links.
4. Removes the `v` prefix and updates `package.json` using `npm version --no-git-tag-version --ignore-scripts`.
5. Runs dependency audit, lint, type checking, 100% coverage tests, and `pnpm build`. Packs `evicting-cache`, verifies its JavaScript, declarations, and changelog, and smoke-tests the packed ESM cache.
6. Publishes the validated tarball to npm with provenance and OIDC trusted publishing. No npm token is required.
7. Commits the generated changelog and package version with `[skip ci]`, creates `vX.Y.Z`, and atomically pushes the commit and that tag to `main`.
8. Creates a GitHub release with separate release notes and the exact published package artifact.

The configuration forces minor and major bumps for features and breaking changes even before 1.0.0. With no existing release tags, git-cliff starts at `v0.1.0`.

## Local Validation And Preview

Install git-cliff 2.10.1 locally and fetch full history and tags before previewing. These commands do not change the package version, create tags, or publish:

```sh
export GITHUB_REPOSITORY=D1g1talEntr0py/evicting-cache
node --test .github/scripts/release-version.check.mjs
node .github/scripts/release-version.mjs
git-cliff --github-repo "$GITHUB_REPOSITORY" --unreleased --strip header
git-cliff --github-repo "$GITHUB_REPOSITORY" --output /tmp/evicting-cache-changelog.md
pnpm audit
pnpm lint
pnpm type-check
pnpm test:coverage
pnpm build
```

The helper prints an unprefixed version only when a release is needed. Fixture tests are skipped if git-cliff is not installed; they always run in the release workflow. Direct git-cliff previews do not enforce release eligibility, so use the helper to decide whether publishing is appropriate.

## Verification And Troubleshooting

- Check [Actions](https://github.com/D1g1talEntr0py/evicting-cache/actions), [npm](https://www.npmjs.com/package/evicting-cache), and [GitHub releases](https://github.com/D1g1talEntr0py/evicting-cache/releases).
- If no release is created, check for eligible commits since the last stable release tag. `refactor` alone does not trigger a release.
- If the bump is unexpected, check for `feat`, `!`, and breaking-change footers. Breaking changes take priority over features and patches.
- If publishing fails, verify the `npm` GitHub environment and npm trusted publisher configuration for this repository and `publish.yml`. The workflow grants `id-token: write` and uses a current npm CLI.
- If publishing succeeds but a subsequent push or GitHub release fails, inspect npm and Git tags before retrying. Do not blindly republish an existing npm version; reconcile the release commit, tag, and GitHub release first. Branch rules must permit the workflow bot to push release commits and tags.
