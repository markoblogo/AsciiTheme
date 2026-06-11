import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = process.cwd();
const tempRoot = mkdtempSync(path.join(os.tmpdir(), "ascii-theme-pack-"));
let tarballPath = "";

function run(cmd, args, cwd = repoRoot) {
  execFileSync(cmd, args, {
    cwd,
    stdio: "inherit",
    env: {
      ...process.env,
      npm_config_fund: "false",
      npm_config_audit: "false",
    },
  });
}

try {
  run("npm", ["run", "build"]);

  const tarballName = execFileSync("npm", ["pack", "--silent"], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
  tarballPath = path.join(repoRoot, tarballName);

  const tarContents = execFileSync("tar", ["-tf", tarballPath], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  const requiredEntries = [
    "package/dist/ascii-theme.es.js",
    "package/dist/index.cjs",
    "package/dist/stickers.es.js",
    "package/packages/react/dist/index.js",
    "package/packages/vue/dist/index.js",
    "package/packages/web-component/dist/index.js",
  ];

  for (const entry of requiredEntries) {
    if (!tarContents.includes(entry)) {
      throw new Error(`Missing packed entry: ${entry}`);
    }
  }

  const fixtureDir = path.join(tempRoot, "fixture");
  mkdirSync(fixtureDir, { recursive: true });
  run("npm", ["init", "-y"], fixtureDir);

  const fixturePackageJson = {
    name: "ascii-theme-fixture",
    private: true,
    type: "module",
  };
  writeFileSync(
    path.join(fixtureDir, "package.json"),
    JSON.stringify(fixturePackageJson, null, 2),
  );

  run("npm", ["install", tarballPath, "react", "react-dom", "vue"], fixtureDir);

  const esmPath = path.join(fixtureDir, "esm-check.mjs");
  writeFileSync(
    esmPath,
    [
      'import * as root from "@abvx/ascii-theme";',
      'import * as stickers from "@abvx/ascii-theme/stickers";',
      'import * as reactBindings from "@abvx/ascii-theme/react";',
      'import * as vueBindings from "@abvx/ascii-theme/vue";',
      'import * as webComponent from "@abvx/ascii-theme/web-component";',
      'if (typeof root.initAsciiTheme !== "function") throw new Error("Missing root initAsciiTheme");',
      'if (typeof root.setTheme !== "function") throw new Error("Missing root setTheme");',
      'if (typeof stickers.addSticker !== "function") throw new Error("Missing stickers addSticker");',
      'if (typeof reactBindings.useAsciiTheme !== "function") throw new Error("Missing react useAsciiTheme");',
      'if (typeof vueBindings.useAsciiTheme !== "function") throw new Error("Missing vue useAsciiTheme");',
      'if (typeof webComponent.defineAsciiThemeToggle !== "function") throw new Error("Missing web component defineAsciiThemeToggle");',
    ].join("\n"),
  );

  const cjsPath = path.join(fixtureDir, "cjs-check.cjs");
  writeFileSync(
    cjsPath,
    [
      'const root = require("@abvx/ascii-theme");',
      'const stickers = require("@abvx/ascii-theme/stickers");',
      'const reactBindings = require("@abvx/ascii-theme/react");',
      'const vueBindings = require("@abvx/ascii-theme/vue");',
      'const webComponent = require("@abvx/ascii-theme/web-component");',
      'if (typeof root.initAsciiTheme !== "function") throw new Error("Missing root initAsciiTheme");',
      'if (typeof stickers.addSticker !== "function") throw new Error("Missing stickers addSticker");',
      'if (typeof reactBindings.useAsciiTheme !== "function") throw new Error("Missing react useAsciiTheme");',
      'if (typeof vueBindings.useAsciiTheme !== "function") throw new Error("Missing vue useAsciiTheme");',
      'if (typeof webComponent.defineAsciiThemeToggle !== "function") throw new Error("Missing web component defineAsciiThemeToggle");',
    ].join("\n"),
  );

  run("node", [esmPath], fixtureDir);
  run("node", [cjsPath], fixtureDir);

  const packageLock = JSON.parse(readFileSync(path.join(fixtureDir, "package-lock.json"), "utf8"));
  if (!packageLock.packages?.["node_modules/@abvx/ascii-theme"]) {
    throw new Error("Packed package did not install into the fixture project");
  }
} finally {
  if (tarballPath) {
    rmSync(tarballPath, { force: true });
  }
  rmSync(tempRoot, { recursive: true, force: true });
}
