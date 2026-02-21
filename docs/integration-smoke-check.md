# Integration Smoke Check (Standard)

Use this checklist in host projects that integrate AsciiTheme.

## 1) Add the script (recommended)

Copy `templates/theme-smoke-check.mjs` to your host project as `scripts/theme-smoke-check.mjs` and wire an npm script:

```json
{
  "scripts": {
    "smoke:theme": "node scripts/theme-smoke-check.mjs"
  }
}
```

Run against local or production:

```bash
npm run smoke:theme
npm run smoke:theme -- https://your-domain.example/
```

## 2) Visual checklist (must pass in 4 states)

Validate at least homepage + one inner page.

1. `default + light`
- Header logo is readable.
- Main text and CTA labels are readable.
- No dark-text-on-dark-button combinations.
- Any side panel (clock/dock/etc.) follows host light theme.

2. `default + dark`
- Header logo is readable.
- Main text and controls are readable.
- No light-text-on-light background collisions.
- Side panel follows host dark theme.

3. `ascii + light`
- ASCII toggle switches to `Default` label.
- Palette is readable (blue on white).
- Utility-heavy buttons/links remain readable.
- Decorative ASCII widgets do not hide core content.

4. `ascii + dark`
- Palette is readable (green on black).
- Header controls remain visible and clickable.
- ASCII stickers render correctly from `[data-ascii-sticker]`.
- Footer source note/link stays readable.

## 3) Integration defaults

For sites that already have their own light/dark system:

```ts
initAsciiTheme({
  integrateTheme: 'respect',
  addThemeToggle: false,
  addStyleToggle: true,
  mountSelector: '#ascii-toggle-anchor',
});
```

For sites without light/dark:

```ts
initAsciiTheme({
  integrateTheme: 'managed',
  managedMode: true,
  addThemeToggle: true,
  addStyleToggle: true,
  mountSelector: '.header-controls',
});
```


## 4) Distribution fallback (npm unavailable)

If npm package install is blocked/unavailable in the host repo:

- Load AsciiTheme from pinned CDN assets (`jsDelivr`/`unpkg`) using a **commit hash or release tag**.
- Do not use floating references like `@main` in production integrations.
- Keep the same init options and smoke-check flow; only the distribution method changes.
