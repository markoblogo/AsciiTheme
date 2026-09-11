# Release Surface

Use this checklist before tagging or publishing a release.

## Package surface

Run the complete release gate:

```bash
npm ci
npm run check
```

This validates:

- root exports;
- sticker subpath export;
- React, Vue, and Web Component subpath exports;
- tarball contents after `npm pack`;
- real `import` and `require` checks in a clean fixture project.

## Individual surfaces

Run:

```bash
npm run verify:integration
npm run verify:package
npm run demo:build
npm audit --audit-level=high
```

This validates:

- six supported style/theme states;
- keyboard shortcut support;
- wrapper sync;
- Web Component event behavior;
- sticker/widget basics.

## Visual surface

Run:

```bash
npm run verify:visual
```

This compares the local playground against the committed baselines in `docs/assets/playground`.

If the visual change is intentional:

```bash
npm run docs:capture
git add docs/assets/playground
```
