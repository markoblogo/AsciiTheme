#!/usr/bin/env node

// Copy this file into a host project as scripts/theme-smoke-check.mjs
// Usage:
//   node scripts/theme-smoke-check.mjs
//   node scripts/theme-smoke-check.mjs https://example.com/

const baseUrl = process.argv[2] || process.env.THEME_SMOKE_URL || 'http://localhost:3000';

const checks = [
  {
    name: 'Host light/dark toggle exists',
    test: (html) => /aria-label="(Switch to light mode|Switch to dark mode)"/.test(html),
  },
  {
    name: 'ASCII toggle mount exists',
    test: (html) => /id="ascii-toggle-anchor"/.test(html),
  },
  {
    name: 'AsciiTheme source link exists',
    test: (html) => /github\.com\/markoblogo\/AsciiTheme/.test(html),
  },
  {
    name: 'Header logo markup exists',
    test: (html) => /<header[\s\S]*?(img|svg)/i.test(html),
  },
  {
    name: 'ASCII footnote text exists',
    test: (html) => /experimental ASCII theme mode/i.test(html),
  },
];

async function run() {
  const url = new URL('/', baseUrl).toString();
  const res = await fetch(url, { redirect: 'follow' });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();

  let failed = 0;
  console.log(`Theme smoke-check target: ${url}`);

  for (const check of checks) {
    const ok = check.test(html);
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${check.name}`);
    if (!ok) failed += 1;
  }

  if (failed > 0) {
    console.error(`\n${failed} checks failed.`);
    process.exit(1);
  }

  console.log('\nAll smoke checks passed.');
  console.log('Next: run the visual checklist from docs/integration-smoke-check.md');
}

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
