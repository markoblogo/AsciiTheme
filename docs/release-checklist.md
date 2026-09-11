# PR and Release Checklist

Use this checklist before opening a PR and before publishing a release.

## PR checklist

- [ ] `npm ci`
- [ ] `npm run check`
- [ ] `npm run verify:visual`
- [ ] README updated when public API, examples, or screenshots changed
- [ ] `docs/playground.md` updated when the playground flow changed
- [ ] `docs/release-surface.md` updated when verification steps changed
- [ ] `examples/` refreshed when wrapper APIs changed
- [ ] `CHANGELOG.md` updated for user-facing changes

## Release checklist

- [ ] Bump version in `package.json` and adapter manifests
- [ ] Add the release entry to `CHANGELOG.md`
- [ ] Run `npm run docs:capture` if visuals changed
- [ ] Review and commit `docs/assets/playground/*`
- [ ] Run `npm ci && npm run check` again
- [ ] Push a signed `v*` tag; the release workflow publishes npm provenance and creates the GitHub release
- [ ] Verify a clean install from npm after publishing
- [ ] Verify GitHub Pages playground after merge to `main`
