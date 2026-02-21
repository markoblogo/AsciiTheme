# Changelog

## 0.1.1 - 2026-02-21

- Added managed integrator toggles (`addThemeToggle`, `addStyleToggle`, `mountSelector`) for sites without existing light/dark UI.
- Added managed default mode palette behavior for `data-style="default"` + `data-ascii-mode`.
- Updated docs/demo for injected toggles and added go.abvx.xyz as an in-the-wild example.


## 0.1.0 - 2026-02-21

- Initial `AsciiTheme` package release.
- Framework-agnostic ASCII style layer (`data-style="default|ascii"`) with scoped CSS.
- Optional managed mode (`data-ascii-mode="light|dark"`) plus style/mode toggle API.
- Idempotent box-drawing sticker renderer for `[data-ascii-sticker]`.
- Demo app with CTA/card/sticker examples and GitHub Pages deployment workflow.
