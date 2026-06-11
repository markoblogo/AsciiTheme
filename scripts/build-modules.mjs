import { build } from "esbuild";

const common = {
  bundle: true,
  sourcemap: false,
  target: "es2020",
  logLevel: "info",
};

await build({
  ...common,
  entryPoints: ["src/node.ts"],
  outfile: "dist/index.cjs",
  format: "cjs",
  platform: "browser",
});

await build({
  ...common,
  entryPoints: ["src/stickers.ts"],
  outfile: "dist/stickers.es.js",
  format: "esm",
  platform: "browser",
});

await build({
  ...common,
  entryPoints: ["src/stickers.ts"],
  outfile: "dist/stickers.cjs",
  format: "cjs",
  platform: "browser",
});

await build({
  ...common,
  entryPoints: ["packages/react/src/index.ts"],
  outdir: "packages/react/dist",
  format: "esm",
  platform: "browser",
  external: ["react", "@abvx/ascii-theme"],
});

await build({
  ...common,
  entryPoints: ["packages/react/src/index.ts"],
  outfile: "packages/react/dist/index.cjs",
  format: "cjs",
  platform: "browser",
  external: ["react", "@abvx/ascii-theme"],
});

await build({
  ...common,
  entryPoints: ["packages/vue/src/index.ts"],
  outdir: "packages/vue/dist",
  format: "esm",
  platform: "browser",
  external: ["vue", "@abvx/ascii-theme"],
});

await build({
  ...common,
  entryPoints: ["packages/vue/src/index.ts"],
  outfile: "packages/vue/dist/index.cjs",
  format: "cjs",
  platform: "browser",
  external: ["vue", "@abvx/ascii-theme"],
});

await build({
  ...common,
  entryPoints: ["packages/web-component/src/index.ts"],
  outdir: "packages/web-component/dist",
  format: "esm",
  platform: "browser",
  external: ["@abvx/ascii-theme"],
});

await build({
  ...common,
  entryPoints: ["packages/web-component/src/index.ts"],
  outfile: "packages/web-component/dist/index.cjs",
  format: "cjs",
  platform: "browser",
  external: ["@abvx/ascii-theme"],
});
