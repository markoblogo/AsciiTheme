import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@abvx/ascii-theme": "/src/index.ts",
      "@abvx/ascii-theme/stickers": "/src/stickers.ts",
      "@abvx/ascii-theme/react": "/packages/react/src/index.ts",
      "@abvx/ascii-theme/vue": "/packages/vue/src/index.ts",
      "@abvx/ascii-theme/web-component": "/packages/web-component/src/index.ts",
    },
  },
});
