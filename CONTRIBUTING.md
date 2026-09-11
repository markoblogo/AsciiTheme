# Contributing

Thanks for helping improve AsciiTheme.

## Setup

Use Node.js 20.19 or newer:

```bash
npm ci
npm run demo:dev
```

## Before opening a pull request

```bash
npm run check
npm run verify:visual
```

Update `CHANGELOG.md` for user-visible changes. If a visual change is intentional, refresh the committed baselines with `npm run docs:capture` and include them in the pull request.

Keep framework adapters compatible with the root subpath exports. They are distributed inside `@abvx/ascii-theme`, not as separate npm packages.

See the full [release checklist](docs/release-checklist.md).
