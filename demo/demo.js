import {
  addSticker,
  getAsciiThemeState,
  initAsciiTheme,
  removeSticker,
  setAsciiStyle,
  setTheme,
  subscribeAsciiTheme,
  updateSticker,
} from "../src/index.ts";
import "../packages/web-component/src/index.ts";

const THEME_COPY = {
  light: {
    title: "Light keeps host-brand pages editorial and crisp.",
    body: "The blue-on-white preset is ideal for docs, onboarding, and product surfaces that need a clean terminal accent without losing daylight contrast.",
    meter: "default + light",
  },
  dark: {
    title: "Dark keeps the binary mode path intact for existing integrations.",
    body: "Use it to validate backward compatibility for sites that already rely on light/dark switching with the legacy mode API.",
    meter: "ascii + dark",
  },
  sepia: {
    title: "Sepia ships calm docs-first pages.",
    body: "Switch between light, dark, sepia, and matrix to inspect palette tokens, button contrast, and sticker readability before publishing.",
    meter: "default + sepia",
  },
  matrix: {
    title: "Matrix speaks directly to the terminal-native audience.",
    body: "This preset turns the same component contract into a sharper developer-facing presentation without changing the integration surface.",
    meter: "ascii + matrix",
  },
};

const SNIPPETS = {
  vanilla: {
    title: "Vanilla",
    summary: "Start with the root package when the host already owns layout and just needs ASCII style, theme registry, and widgets.",
    code: `import "@abvx/ascii-theme/style.css";
import { initAsciiTheme, setTheme, addSticker } from "@abvx/ascii-theme";

initAsciiTheme({
  integrateTheme: "managed",
  defaultTheme: "sepia",
  addThemeToggle: true,
  addStyleToggle: true,
  mountSelector: "#toolbar",
});

setTheme("matrix");
addSticker({ id: "release", preset: "status-badge", status: "LIVE" });`,
  },
  "web-component": {
    title: "Web Component",
    summary: "Use the custom element when you need a native adoption primitive that works across static HTML, CMS pages, and mixed stacks.",
    code: `import "@abvx/ascii-theme/style.css";
import "@abvx/ascii-theme/web-component";
import { initAsciiTheme } from "@abvx/ascii-theme";

initAsciiTheme({
  managedMode: true,
  defaultTheme: "matrix",
});

<ascii-theme-toggle controls="both"></ascii-theme-toggle>
<ascii-theme-toggle controls="theme" theme="sepia"></ascii-theme-toggle>`,
  },
  react: {
    title: "React",
    summary: "Reach for the React bindings when you want live state in components without writing your own event bridge.",
    code: `import { AsciiThemeBoot, useAsciiTheme } from "@abvx/ascii-theme/react";

function ThemeInspector() {
  const theme = useAsciiTheme();
  return (
    <button onClick={() => theme.setTheme("matrix")}>
      {theme.style} / {theme.theme}
    </button>
  );
}

export function AppTheme() {
  return <AsciiThemeBoot options={{ defaultTheme: "sepia" }} />;
}`,
  },
  vue: {
    title: "Vue",
    summary: "The Vue composable mirrors the same singleton state and works well for SSR-safe boot plus local reactive controls.",
    code: `import { createAsciiThemePlugin, useAsciiTheme } from "@abvx/ascii-theme/vue";

app.use(createAsciiThemePlugin({ defaultTheme: "light" }));

const theme = useAsciiTheme();
theme.setTheme("matrix");
theme.toggleStyle();`,
  },
};

const STICKER_PRESETS = {
  "status-badge": {
    summary: "Status badge is ideal for release, environment, or deployment state.",
    config: {
      id: "lab-widget",
      preset: "status-badge",
      status: "LIVE",
      target: "#demo-widget-slot",
      decorative: false,
      ariaLabel: "Live status",
    },
  },
  progress: {
    summary: "Progress surfaces build, migration, or rollout status without adding extra UI chrome.",
    config: {
      id: "lab-widget",
      preset: "progress",
      value: 68,
      max: 100,
      target: "#demo-widget-slot",
    },
  },
  clock: {
    summary: "Clock gives you a live widget for uptime, dashboards, and support tooling demos.",
    config: {
      id: "lab-widget",
      preset: "clock",
      target: "#demo-widget-slot",
    },
  },
  spinner: {
    summary: "Spinner is useful for skeleton-like terminal loading states while preserving the ASCII vocabulary.",
    config: {
      id: "lab-widget",
      preset: "spinner",
      content: "Syncing deployment",
      target: "#demo-widget-slot",
      animate: true,
    },
  },
};

let currentSnippet = "vanilla";
let currentStickerPreset = "status-badge";

initAsciiTheme({
  managedMode: true,
  defaultStyle: "default",
  defaultMode: "light",
  defaultTheme: "sepia",
  addThemeToggle: true,
  addStyleToggle: true,
  mountSelector: "#demo-toggle-mount",
  mountPlacement: "append",
  keyboardShortcut: "Alt+T",
});

function renderInlineSticker() {
  removeSticker("preview-inline");
  addSticker({
    id: "preview-inline",
    preset: "status-badge",
    status: "READY",
    target: "#demo-inline-sticker-slot",
  });
}

function renderStickerPreset(name) {
  currentStickerPreset = name;
  removeSticker("lab-widget");
  addSticker(STICKER_PRESETS[name].config);
  const summary = document.getElementById("sticker-summary");
  if (summary) {
    summary.textContent = STICKER_PRESETS[name].summary;
  }

  document.querySelectorAll("[data-sticker-preset]").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-sticker-preset") === name);
  });
}

function renderSnippet(name) {
  currentSnippet = name;
  const snippet = SNIPPETS[name];
  const summary = document.getElementById("snippet-summary");
  const title = document.getElementById("snippet-title");
  const code = document.getElementById("snippet-code");

  if (summary) summary.textContent = snippet.summary;
  if (title) title.textContent = snippet.title;
  if (code) code.textContent = snippet.code;

  document.querySelectorAll("[data-snippet]").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-snippet") === name);
  });
}

function updatePreview(state) {
  const themeCopy = THEME_COPY[state.theme] ?? THEME_COPY.light;
  const meterFill = document.getElementById("demo-meter-fill");
  const title = document.getElementById("preview-title");
  const copy = document.getElementById("preview-copy");
  const label = document.getElementById("demo-meter-label");
  const stateStyle = document.getElementById("state-style");
  const stateTheme = document.getElementById("state-theme");
  const stateMode = document.getElementById("state-mode");
  const attrStyle = document.getElementById("state-attr-style");
  const attrTheme = document.getElementById("state-attr-theme");

  if (title) title.textContent = themeCopy.title;
  if (copy) copy.textContent = themeCopy.body;
  if (label) label.textContent = `${state.style} + ${state.theme}`;
  if (stateStyle) stateStyle.textContent = state.style;
  if (stateTheme) stateTheme.textContent = state.theme;
  if (stateMode) stateMode.textContent = state.mode;
  if (attrStyle) attrStyle.textContent = `data-style="${state.style}"`;
  if (attrTheme) attrTheme.textContent = `data-ascii-theme="${state.theme}"`;

  if (meterFill) {
    const width = state.style === "ascii" ? "100%" : state.theme === "dark" ? "52%" : state.theme === "sepia" ? "64%" : "36%";
    meterFill.style.width = width;
  }

  document.querySelectorAll("[data-theme-target]").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-theme-target") === state.theme);
  });

  document.querySelectorAll("[data-style-target]").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-style-target") === state.style);
  });
}

function bindControls() {
  document.querySelectorAll("[data-theme-target]").forEach((button) => {
    button.addEventListener("click", () => {
      setTheme(button.getAttribute("data-theme-target"));
    });
  });

  document.querySelectorAll("[data-style-target]").forEach((button) => {
    button.addEventListener("click", () => {
      setAsciiStyle(button.getAttribute("data-style-target"));
    });
  });

  document.querySelectorAll("[data-snippet]").forEach((button) => {
    button.addEventListener("click", () => {
      renderSnippet(button.getAttribute("data-snippet"));
    });
  });

  document.querySelectorAll("[data-sticker-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      renderStickerPreset(button.getAttribute("data-sticker-preset"));
    });
  });

  document.getElementById("demo-shortcut-trigger")?.addEventListener("click", () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "t",
        altKey: true,
      }),
    );
  });
}

bindControls();
renderInlineSticker();
renderSnippet(currentSnippet);
renderStickerPreset(currentStickerPreset);
updatePreview(getAsciiThemeState());

subscribeAsciiTheme((state) => {
  updatePreview(state);
  if (currentStickerPreset === "progress") {
    const percent = state.style === "ascii"
      ? state.theme === "matrix"
        ? 92
        : 84
      : state.theme === "sepia"
        ? 68
        : 56;
    updateSticker("lab-widget", { value: percent });
  }
});
