import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => {
  if (mode === "demo") {
    return {
      root: "demo",
      base: "/AsciiTheme/",
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
