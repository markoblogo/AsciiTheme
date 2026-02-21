# AsciiTheme

AsciiTheme is a framework-agnostic micro-package that adds an ASCII visual layer to existing pages.
It provides:
- `data-style="default|ascii"` management
- optional mode management (`light|dark`)
- box-drawing sticker rendering for `[data-ascii-sticker]`

Runtime has no dependencies.

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

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@markoblogo/ascii-theme/dist/style.css" />
<script src="https://unpkg.com/@markoblogo/ascii-theme/dist/ascii-theme.umd.js"></script>
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

To build the package:

```bash
npm run build
```
