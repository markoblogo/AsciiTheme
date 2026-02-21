# AsciiTheme

[![npm version](https://img.shields.io/npm/v/%40markoblogo%2Fascii-theme)](https://www.npmjs.com/package/@markoblogo/ascii-theme)
[![npm downloads](https://img.shields.io/npm/dm/%40markoblogo%2Fascii-theme)](https://www.npmjs.com/package/@markoblogo/ascii-theme)
[![CI](https://github.com/markoblogo/AsciiTheme/actions/workflows/ci.yml/badge.svg)](https://github.com/markoblogo/AsciiTheme/actions/workflows/ci.yml)
[![Pages](https://github.com/markoblogo/AsciiTheme/actions/workflows/pages.yml/badge.svg)](https://github.com/markoblogo/AsciiTheme/actions/workflows/pages.yml)
[![Demo](https://img.shields.io/badge/demo-live-22c55e)](https://markoblogo.github.io/AsciiTheme/)
[![License](https://img.shields.io/github/license/markoblogo/AsciiTheme)](LICENSE)

AsciiTheme is a framework-agnostic micro-package that adds an ASCII visual layer to existing pages.
It provides:
- `data-style="default|ascii"` management
- optional mode management (`light|dark`)
- box-drawing sticker rendering for `[data-ascii-sticker]`

Runtime has no dependencies.

`dist/` is committed to git for CDN convenience and reproducible release snapshots.

## Install

### npm

```bash
npm install @markoblogo/ascii-theme
```

```js
import { initAsciiTheme } from "@markoblogo/ascii-theme";
import "@markoblogo/ascii-theme/style.css";

initAsciiTheme();
```

### Vite (React or vanilla)

```ts
import { initAsciiTheme } from "@markoblogo/ascii-theme";
import "@markoblogo/ascii-theme/style.css";

initAsciiTheme({ managedMode: false, base: false });
```

### Next.js (App Router / Pages Router)

Import CSS once in `app/layout.tsx` or `pages/_app.tsx`:

```ts
import "@markoblogo/ascii-theme/style.css";
```

Run init only on the client:

```tsx
"use client";

import { useEffect } from "react";
import { initAsciiTheme } from "@markoblogo/ascii-theme";

export function AsciiThemeBoot() {
  useEffect(() => {
    initAsciiTheme();
  }, []);
  return null;
}
```

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@markoblogo/ascii-theme@0.1.1/dist/style.css" />
<script src="https://unpkg.com/@markoblogo/ascii-theme@0.1.1/dist/ascii-theme.umd.js"></script>
<script>
  AsciiTheme.initAsciiTheme({ managedMode: false });
</script>
```

If npm install is unavailable in a host project, use a pinned GitHub commit via jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/markoblogo/AsciiTheme@<commit>/dist/style.css" />
<script src="https://cdn.jsdelivr.net/gh/markoblogo/AsciiTheme@<commit>/dist/ascii-theme.umd.js"></script>
```

Use a commit hash or release tag, not `@main`.

## Basic usage (respect host theme)

By default, the package does **not** control your host light/dark theme.
It reads the host theme attribute (`data-theme` by default):

```html
<html data-theme="dark">
```

```js
import { initAsciiTheme } from "@markoblogo/ascii-theme";

initAsciiTheme({ managedMode: false });
```

ASCII palette mapping uses host theme selectors:
- `:root[data-style="ascii"][data-theme="light"]`
- `:root[data-style="ascii"][data-theme="dark"]`

## Managed mode usage

If you want the plugin to control mode itself:

```js
import {
  initAsciiTheme,
  toggleAsciiMode,
} from "@markoblogo/ascii-theme";

initAsciiTheme({ managedMode: true, defaultMode: "light" });

document.getElementById("mode-btn")?.addEventListener("click", () => {
  toggleAsciiMode();
});
```

Managed mode uses `data-ascii-mode="light|dark"` on `:root`.

## Managed theme + injected toggles (for sites without light/dark)

Use this when the host site has no built-in theme switch and you want the plugin to mount compact controls in a header container:

```js
import { initAsciiTheme } from "@markoblogo/ascii-theme";

initAsciiTheme({
  managedMode: true,
  defaultMode: "dark",
  defaultStyle: "default",
  addThemeToggle: true,
  addStyleToggle: true,
  mountSelector: "header .right",
  mountPlacement: "append",
  className: "header-button",
});
```

Notes:
- Toggles are injected only when `mountSelector` is provided and toggle flags are enabled.
- Theme toggle switches `dark`/`light`; style toggle text switches `ASCII`/`Default`.
- When `base: true`, style toggle is automatically disabled and `data-style` is forced to `ascii`.

## Smart integration (auto detect host theme)

Use `integrateTheme` to control how mode is handled:

- `integrateTheme: "respect"`: always use host theme; never inject plugin theme toggle.
- `integrateTheme: "managed"`: plugin controls `data-ascii-mode` and can inject both toggles.
- `integrateTheme: "auto"` (default): if host theme is detected, plugin switches to respect mode and disables injected theme toggle automatically.

For sites that already have their own light/dark switch:

```js
initAsciiTheme({
  integrateTheme: "auto",
  addThemeToggle: true, // auto mode disables this when host theme is detected
  addStyleToggle: true,
  mountSelector: ".header-controls",
});
```

For sites without host theme:

```js
initAsciiTheme({
  integrateTheme: "managed",
  managedMode: true,
  defaultMode: "dark",
  addThemeToggle: true,
  addStyleToggle: true,
  mountSelector: ".header-controls",
});
```

## Integration standard (theme + ASCII)

For cross-project consistency, follow the standard integration smoke-check:

- Copy `templates/theme-smoke-check.mjs` into your host project and run it as `npm run smoke:theme`.
- Apply the 4-state visual checklist from `docs/integration-smoke-check.md` (`default/ascii` x `light/dark`).
- Use `integrateTheme: "respect"` for sites that already own light/dark; use `integrateTheme: "managed"` only for sites without host theme controls.

### No host-theme + hardcoded colors playbook

Use this order to avoid contrast regressions on utility-heavy sites:

1. Start with `integrateTheme: "auto"` and `addThemeToggle: true` + `addStyleToggle: true`.
2. If no host theme is detected, switch to managed mode (`integrateTheme: "managed"`, `defaultMode: "dark"`).
3. Run the 4-state smoke check (`default/light`, `default/dark`, `ascii/light`, `ascii/dark`).
4. If contrast is still weak in managed mode, rely on built-in readability hardening for common `text-*` / `bg-*` / `border-*` utility classes before adding site-local CSS.
5. Add site-local bridge CSS only for truly project-specific tokens that cannot be generalized.
6. Hardcoded Tailwind arbitrary tokens (for example `text-[#111827]`, `bg-[#F9FAFB]`, `border-[#E5E7EB]`) are normalized by default in managed dark and ASCII modes.

## Use AsciiTheme as your only CSS (base preset)

When you want an ASCII-first site with no separate style axis, use the base preset.
In this mode ASCII is always on (`data-style="ascii"`), so you only keep the light/dark toggle.

### Vite

```ts
import { initAsciiTheme } from "@markoblogo/ascii-theme";
import "@markoblogo/ascii-theme/base.css";

initAsciiTheme({
  base: true,
  managedMode: true,
  addThemeToggle: true,
  addStyleToggle: false,
  mountSelector: ".header-controls",
});
```

### Next.js

Import base CSS once in `app/layout.tsx` or `pages/_app.tsx`:

```ts
import "@markoblogo/ascii-theme/base.css";
```

Run init in a client component:

```tsx
"use client";

import { useEffect } from "react";
import { initAsciiTheme } from "@markoblogo/ascii-theme";

export function AsciiThemeBoot() {
  useEffect(() => {
    initAsciiTheme({
      base: true,
      managedMode: true,
      addThemeToggle: true,
      addStyleToggle: false,
      mountSelector: ".header-controls",
    });
  }, []);
  return null;
}
```

CDN (pinned):

```html
<link rel="stylesheet" href="https://unpkg.com/@markoblogo/ascii-theme@0.1.1/dist/base.css" />
<script src="https://unpkg.com/@markoblogo/ascii-theme@0.1.1/dist/ascii-theme.umd.js"></script>
<script>
  AsciiTheme.initAsciiTheme({
    base: true,
    managedMode: true,
    addThemeToggle: true,
    addStyleToggle: false,
    mountSelector: ".header-controls",
  });
</script>
```

## Utility classes

| Class | Purpose | Notes |
| --- | --- | --- |
| `.a-container` | Constrains page width and adds horizontal padding. | Centered with auto margins. |
| `.a-section` | Vertical spacing for page sections. | Use on `header`, `section`, `footer` blocks. |
| `.a-stack` | Vertical flex layout with configurable gap. | Uses `--a-gap` (defaults to `12px`). |
| `.a-row` | Horizontal flex layout with wrapping and configurable gap. | Uses `--a-gap` (defaults to `12px`). |
| `.a-gap-1` | Small gap helper. | Sets `--a-gap: 8px`. |
| `.a-gap-2` | Default gap helper. | Sets `--a-gap: 12px`. |
| `.a-gap-3` | Large gap helper. | Sets `--a-gap: 20px`. |
| `.a-center` | Centers text alignment. | `text-align: center`. |
| `.a-right` | Right-aligns text. | `text-align: right`. |
| `.a-between` | Distributes flex items across available space. | `justify-content: space-between`. |
| `.a-align-center` | Centers flex items on cross axis. | `align-items: center`. |
| `.a-wrap` | Forces flex wrapping. | Useful for compact nav/button groups. |
| `.a-grid` | Base grid container with configurable gap. | Uses `--a-gap` (defaults to `12px`). |
| `.a-cols-2` | Responsive 2-column grid. | `1` column by default, `2` columns at `>=768px`. |
| `.a-cols-3` | Responsive 3-column grid. | `1` column by default, `3` columns at `>=768px`. |
| `.a-cols-auto` | Auto-fit card grid. | `repeat(auto-fit, minmax(220px, 1fr))`. |
| `.a-span-2` | Expands an item across two columns. | Applies at `>=768px`. |
| `.a-prose` | Readable text measure and spacing. | `max-width: 65ch` + increased line-height. |
| `.a-muted` | Secondary text color. | Uses `var(--muted)`. |
| `.a-card` | Terminal card surface. | Border + padding + transparent background. |
| `.a-panel` | Larger panel surface. | Same visual treatment as `.a-card`. |
| `.a-btn` | Base button style. | Border-only terminal button. |
| `.a-btn--primary` | Emphasized button style. | Filled with foreground color. |
| `.a-btn--ghost` | Secondary button style. | Transparent button with border. |
| `.a-badge` | Compact badge/pill style. | Border + small padding. |

```html
<main class="a-container a-stack a-gap-3">
  <section class="a-section a-stack a-gap-2">
    <h1>Ship faster with AsciiTheme</h1>
    <p class="a-prose a-muted">Base preset gives you typography, layout, and controls with one stylesheet.</p>
    <div class="a-row a-gap-2">
      <a class="a-btn--primary" href="#">Start</a>
      <a class="a-btn--ghost" href="#">Read docs</a>
    </div>
  </section>
  <section class="a-section a-grid a-cols-3 a-gap-2">
    <article class="a-card">Feature A</article>
    <article class="a-card">Feature B</article>
    <article class="a-card">Feature C</article>
  </section>
</main>
```

## Markup conventions

- Style axis is applied to root by the plugin:
  - `data-style="default|ascii"`
- Stickers:
  - `[data-ascii-sticker="TEXT"]`
- Optional role hooks for terminal components:
  - `[data-ascii-role="cta"]`
  - `[data-ascii-role="card"]`
  - `[data-ascii-role="nav"]`
  - `[data-ascii-role="badge"]`

## Public API

- `initAsciiTheme(options?)` (`base: true` enables ASCII-only base preset)
- `setAsciiStyle(style: "default" | "ascii")`
- `toggleAsciiStyle()`
- `getAsciiStyle(): "default" | "ascii"`
- `setAsciiMode(mode: "light" | "dark")`
- `toggleAsciiMode()`
- `renderAsciiStickers(root?: ParentNode)`

## Notes / limitations

- Contrast defaults in ASCII mode are tuned for utility-heavy sites (Tailwind-like `text-*`/`bg-*` classes), so text and controls remain readable in both light and dark.
- Card/panel classes (`.card`, `.card-gloss`, and common `card-*`/`panel-*` variants) are normalized in managed dark and ASCII modes to prevent white-card regressions on dark backgrounds.
- If your host theme uses a root `.dark` / `.light` class (instead of `data-theme`), ASCII palette detection is supported out of the box.
- This is not a full DOM-to-ASCII renderer.
- It focuses on a scoped theme layer and simple ASCII widgets (stickers + terminal component hooks).
- CSS is scoped to `:root[data-style="ascii"]` to avoid host-site breakage.
- Media is not restyled by default in ASCII mode (`img/video/avatar/logo` remain unchanged unless you style them explicitly).

## Demo

```bash
npm install
npm run dev
```

Open the URL shown by Vite.

Live demo (GitHub Pages):
https://markoblogo.github.io/AsciiTheme/

In the wild:
- You can also see this theme in the wild on the AGENTS.md generator landing: https://agentsmd.abvx.xyz/
- You can also see this theme on go.abvx.xyz: https://go.abvx.xyz/
- You can also see this theme on abvx.xyz: https://abvx.xyz/
- You can also see this theme on trade-solution.eu: https://trade-solution.eu/
- First-time setup: in GitHub repository settings, set **Pages -> Source** to **GitHub Actions** once, then rerun the Pages workflow.

To build the package:

```bash
npm run build
```

## Release checklist (v0.1.0)

Before tagging:

```bash
git status --short
npm ci
npm run build
npm run demo:build
```

Create and push release tag:

```bash
# version is already 0.1.0 in package.json
git add -A
git commit -m "chore: release v0.1.0"
git tag v0.1.0
git push origin main --tags
```

Manual npm publish (requires ownership and credentials):

```bash
npm login
npm publish --access public
```

If package is unscoped, use:

```bash
npm publish
```
