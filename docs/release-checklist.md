# PR and Release Checklist

Use this checklist before opening a PR and before publishing a release.

## PR checklist

- [ ] `npm run build`
- [ ] `npm run demo:build`
- [ ] `npm run verify:integration`
- [ ] `npm run verify:visual`
- [ ] `npm run verify:package`
- [ ] README updated when public API, examples, or screenshots changed
- [ ] `docs/playground.md` updated when the playground flow changed
- [ ] `docs/release-surface.md` updated when verification steps changed
- [ ] `examples/` refreshed when wrapper APIs changed
- [ ] `CHANGELOG.md` updated for user-facing changes

## Release checklist

- [ ] Bump version in `package.json`
- [ ] Add the release entry to `CHANGELOG.md`
- [ ] Run `npm run docs:capture` if visuals changed
- [ ] Review and commit `docs/assets/playground/*`
- [ ] Run the full verification stack again
- [ ] Publish package
- [ ] Create GitHub release notes using the matching `CHANGELOG.md` section
- [ ] Verify GitHub Pages playground after merge to `main`
