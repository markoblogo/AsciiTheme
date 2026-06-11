import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { access } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const baselineDir = path.join(repoRoot, "docs", "assets", "playground");
const gifPath = path.join(baselineDir, "playground-overview.gif");
const tempDir = mkdtempSync(path.join(os.tmpdir(), "ascii-theme-visual-"));
const mode = process.argv.includes("--update") ? "update" : "check";
const port = 4173;

const states = [
  { id: "default-light", style: "default", theme: "light" },
  { id: "default-dark", style: "default", theme: "dark" },
  { id: "ascii-light", style: "ascii", theme: "light" },
  { id: "ascii-dark", style: "ascii", theme: "dark" },
  { id: "ascii-sepia", style: "ascii", theme: "sepia" },
  { id: "ascii-matrix", style: "ascii", theme: "matrix" },
];

function startPreview() {
  return spawn(
    "npm",
    ["run", "demo:preview", "--", "--host", "127.0.0.1", "--port", String(port)],
    {
      cwd: repoRoot,
      stdio: "inherit",
      shell: false,
    },
  );
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Preview server did not start at ${url}`);
}

async function captureStates(outputDir) {
  mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch();
  const viewport = {
    width: 1440,
    height: 2200,
  };
  const page = await browser.newPage({
    viewport,
    colorScheme: "light",
  });

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });

  for (const state of states) {
    await page.click(`[data-style-target="${state.style}"]`);
    await page.click(`[data-theme-target="${state.theme}"]`);
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outputDir, `${state.id}.png`),
      clip: {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      },
    });
  }

  await browser.close();
}

async function ensureBaselinesExist() {
  for (const state of states) {
    await access(path.join(baselineDir, `${state.id}.png`));
  }
}

function compareImages() {
  const diffs = [];

  for (const state of states) {
    const baselinePath = path.join(baselineDir, `${state.id}.png`);
    const currentPath = path.join(tempDir, `${state.id}.png`);
    const baseline = PNG.sync.read(readFileSync(baselinePath));
    const current = PNG.sync.read(readFileSync(currentPath));

    if (baseline.width !== current.width || baseline.height !== current.height) {
      diffs.push(`${state.id}: dimension mismatch`);
      continue;
    }

    const diff = new PNG({ width: baseline.width, height: baseline.height });
    const diffPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      baseline.width,
      baseline.height,
      { threshold: 0.12 },
    );

    if (diffPixels > 3000) {
      writeFileSync(path.join(tempDir, `${state.id}.diff.png`), PNG.sync.write(diff));
      diffs.push(`${state.id}: ${diffPixels} pixels differ`);
    }
  }

  if (diffs.length) {
    throw new Error(`Visual regression detected:\n${diffs.join("\n")}`);
  }
}

async function buildGif() {
  const ffmpeg = spawn(
    "ffmpeg",
    [
      "-y",
      "-pattern_type",
      "glob",
      "-framerate",
      "1.2",
      "-i",
      path.join(baselineDir, "*.png"),
      "-vf",
      "scale=1200:-1:flags=lanczos",
      gifPath,
    ],
    {
      cwd: repoRoot,
      stdio: "inherit",
    },
  );

  await new Promise((resolve, reject) => {
    ffmpeg.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });
}

const preview = startPreview();

try {
  await waitForServer(`http://127.0.0.1:${port}/`);

  if (mode === "update") {
    await captureStates(baselineDir);
    await buildGif();
  } else {
    await ensureBaselinesExist();
    await captureStates(tempDir);
    compareImages();
  }
} finally {
  preview.kill("SIGTERM");
  rmSync(tempDir, { recursive: true, force: true });
}
