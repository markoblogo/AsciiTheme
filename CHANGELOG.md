# Changelog

## 0.3.1 - 2026-09-11

- Fixed clean installs by aligning the repository with the package's single-package, subpath-export distribution model.
- Fixed style persistence and stale injected controls across repeated initialization.
- Updated the development toolchain and removed all known npm audit findings.
- Added one-command release verification, hardened CI and Pages workflows, and added automated release publishing.
- Reworked the README around adoption paths, live examples, accessibility, and current release instructions.
- Added contribution, security, dependency-update, and issue-reporting guidance.

## 0.3.0 - 2026-06-11

- Added theme registry APIs with built-in `light`, `dark`, `sepia`, and `matrix` themes.
- Added sticker widget APIs with `progress`, `clock`, `status-badge`, and `spinner` presets.
- Added subpath exports for React, Vue, and Web Component bindings.
- Added publish-time verification for packed exports and fixture installation.
- Added an interactive adoption playground, visual baselines, and release surface docs.

## 0.2.0 - 2026-02-21

- Added SSR-safe `initAsciiTheme` guard for Next.js/SSR environments.
- Added system theme default (`prefers-color-scheme`) for first-run managed/base mode.
- Added base preset utilities: `.a-visually-hidden` and `.a-balance`.
- Added docs: minimal base-preset landing example.


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
