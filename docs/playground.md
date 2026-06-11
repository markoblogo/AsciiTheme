# Playground

AsciiTheme ships a demo playground that doubles as:

- an adoption surface for vanilla, Web Component, React, and Vue integrations;
- a manual smoke-check surface for `default/ascii` and `light/dark/sepia/matrix`;
- the source of truth for release screenshots and visual regression baselines.

## Local workflow

```bash
npm run demo:dev
```

Use the playground to verify:

- style switching between `default` and `ascii`;
- registry theme switching between `light`, `dark`, `sepia`, and `matrix`;
- Web Component controls;
- wrapper snippets;
- sticker presets (`status-badge`, `progress`, `clock`, `spinner`).

## Release assets

The following screenshots are generated from the playground and committed as visual baselines:

- `docs/assets/playground/default-light.png`
- `docs/assets/playground/default-dark.png`
- `docs/assets/playground/ascii-light.png`
- `docs/assets/playground/ascii-dark.png`
- `docs/assets/playground/ascii-sepia.png`
- `docs/assets/playground/ascii-matrix.png`
- `docs/assets/playground/playground-overview.gif`

Refresh them with:

```bash
npm run docs:capture
```
