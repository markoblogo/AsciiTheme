# PR summary for 0.3.0

## Summary

This PR prepares the `0.3.0` release and evolves AsciiTheme from a basic ASCII overlay package into a publish-ready adoption surface:

- theme registry with `light`, `dark`, `sepia`, and `matrix`
- sticker widget system with live presets
- React, Vue, and Web Component bindings
- interactive playground for manual adoption checks
- package verification, integration verification, and visual regression baselines
- release docs, examples, and visual assets for the new surface

## Verification

- `npm run build`
- `npm run demo:build`
- `npm run verify:integration`
- `npm run verify:visual`
- `npm run verify:package`

## Release notes draft

### Added

- Theme registry APIs: `setTheme`, `getTheme`, `registerTheme`, `getThemes`
- Built-in `sepia` and `matrix` themes
- Sticker widget APIs: `addSticker`, `updateSticker`, `removeSticker`
- Web Component export: `@abvx/ascii-theme/web-component`
- React export: `@abvx/ascii-theme/react`
- Vue export: `@abvx/ascii-theme/vue`
- Interactive playground for adoption and manual smoke checks
- Visual baseline screenshots and GIF for the six supported states

### Changed

- Root package exports and tarball verification are now checked in CI
- Demo evolved from a simple showcase into a stateful playground
- Release surface is now documented through dedicated runbooks and checklists
- Wrapper-specific examples now live under `examples/` for copy-paste adoption
