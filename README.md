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

initAsciiTheme({ managedMode: false });
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
<link rel="stylesheet" href="https://unpkg.com/@markoblogo/ascii-theme@0.1.0/dist/style.css" />
<script src="https://unpkg.com/@markoblogo/ascii-theme@0.1.0/dist/ascii-theme.umd.js"></script>
<script>
  AsciiTheme.initAsciiTheme({ managedMode: false });
</script>
```

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

- `initAsciiTheme(options?)`
- `setAsciiStyle(style: "default" | "ascii")`
- `toggleAsciiStyle()`
- `getAsciiStyle(): "default" | "ascii"`
- `setAsciiMode(mode: "light" | "dark")`
- `toggleAsciiMode()`
- `renderAsciiStickers(root?: ParentNode)`

## Notes / limitations

- This is not a full DOM-to-ASCII renderer.
- It focuses on a scoped theme layer and simple ASCII widgets (stickers + terminal component hooks).
- CSS is scoped to `:root[data-style="ascii"]` to avoid host-site breakage.

## Demo

```bash
npm install
npm run dev
```

Open the URL shown by Vite.

Live demo (GitHub Pages):
https://markoblogo.github.io/AsciiTheme/

- You can also see this theme in the wild on the AGENTS.md generator landing: https://agentsmd.abvx.xyz/
- You can also see this theme on go.abvx.xyz: https://go.abvx.xyz/
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
