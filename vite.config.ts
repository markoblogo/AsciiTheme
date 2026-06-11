import { defineConfig } from "vite";
import { resolve } from "node:path";

const localAliases = {
  "@abvx/ascii-theme": resolve(__dirname, "src/index.ts"),
  "@abvx/ascii-theme/stickers": resolve(__dirname, "src/stickers.ts"),
  "@abvx/ascii-theme/react": resolve(__dirname, "packages/react/src/index.ts"),
  "@abvx/ascii-theme/vue": resolve(__dirname, "packages/vue/src/index.ts"),
  "@abvx/ascii-theme/web-component": resolve(__dirname, "packages/web-component/src/index.ts"),
};

export default defineConfig(({ mode }) => {
  if (mode === "demo") {
    return {
      root: "demo",
      base: "/AsciiTheme/",
      resolve: {
        alias: localAliases,
      },
      build: {
        outDir: "../demo-dist",
        emptyOutDir: true,
        rollupOptions: {
          input: {
            main: resolve(__dirname, "demo/index.html"),
            base: resolve(__dirname, "demo/base.html"),
          },
        },
      },
    };
  }

  return {
    resolve: {
      alias: localAliases,
    },
    build: {
      outDir: "dist",
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "AsciiTheme",
        formats: ["es", "umd"],
        fileName: (format) => `ascii-theme.${format}.js`,
      },
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith(".css")) {
              return "style.css";
            }
            return "assets/[name][extname]";
          },
        },
      },
    },
  };
});
