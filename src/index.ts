import "./style.css";

import { getPreferredMode, getRoot } from "./dom";
import { readState, writeState } from "./storage";
import { renderAsciiStickers as renderStickers, restoreAsciiStickers } from "./stickers";

export type AsciiStyle = "default" | "ascii";
export type AsciiMode = "light" | "dark";

export type AsciiThemeOptions = {
  storageKey?: string;
  defaultStyle?: AsciiStyle;
  managedMode?: boolean;
  defaultMode?: AsciiMode;
  themeAttr?: string;
  addThemeToggle?: boolean;
  addStyleToggle?: boolean;
  mountSelector?: string | null;
  mountPlacement?: "append" | "prepend" | "afterThemeToggle";
  icons?: {
    sun?: string;
    moon?: string;
  };
  className?: string;
};

const DEFAULTS: Required<AsciiThemeOptions> = {
  storageKey: "ascii_theme_v1",
  defaultStyle: "default",
  managedMode: false,
  defaultMode: "light",
  themeAttr: "data-theme",
  addThemeToggle: false,
  addStyleToggle: false,
  mountSelector: "",
  mountPlacement: "append",
  icons: {
    sun: "☀",
    moon: "☾",
  },
  className: "",
};

let config: Required<AsciiThemeOptions> = { ...DEFAULTS };
const root = getRoot();
let themeToggleButton: HTMLButtonElement | null = null;
let styleToggleButton: HTMLButtonElement | null = null;
let injectedContainer: HTMLElement | null = null;

function normalizeStyle(value: unknown): AsciiStyle {
  return value === "ascii" ? "ascii" : "default";
}

function normalizeMode(value: unknown): AsciiMode {
  return value === "dark" ? "dark" : "light";
}

function syncAsciiModeIfManaged(mode?: AsciiMode): void {
  if (!config.managedMode) {
    root.removeAttribute("data-ascii-mode");
    return;
  }

  const next = normalizeMode(mode ?? config.defaultMode);
  root.setAttribute("data-ascii-mode", next);
}

function persistState(style: AsciiStyle, mode?: AsciiMode): void {
  const current = readState(config.storageKey);
  writeState(config.storageKey, {
    ...current,
    style,
    mode: config.managedMode ? mode : undefined,
  });
}

function getAsciiMode(): AsciiMode {
  if (config.managedMode) {
    return normalizeMode(root.getAttribute("data-ascii-mode"));
  }
  return normalizeMode(root.getAttribute(config.themeAttr));
}

function updateInjectedToggleUI(): void {
  if (styleToggleButton) {
    const style = getAsciiStyle();
    const toAscii = style !== "ascii";
    styleToggleButton.textContent = toAscii ? "ASCII" : "Default";
    styleToggleButton.setAttribute(
      "aria-label",
      toAscii ? "Switch to ASCII style" : "Switch to default style",
    );
  }

  if (themeToggleButton) {
    const mode = getAsciiMode();
    const icon =
      mode === "dark"
        ? config.icons.moon ?? "☾"
        : config.icons.sun ?? "☀";
    themeToggleButton.textContent = icon;
    themeToggleButton.setAttribute(
      "aria-label",
      mode === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
  }
}

function createToggleButton(
  type: "theme" | "style",
  className: string,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `ascii-theme-toggle-btn ${className}`.trim();
  button.dataset.asciiToggleType = type;
  return button;
}

function injectTogglesIfNeeded(): void {
  const mountSelector = config.mountSelector;
  const shouldInject =
    Boolean(mountSelector) &&
    (config.addThemeToggle || config.addStyleToggle);

  if (!shouldInject) {
    return;
  }

  if (!mountSelector) {
    return;
  }

  const mount = document.querySelector<HTMLElement>(mountSelector);
  if (!mount) {
    return;
  }

  if (injectedContainer?.parentElement) {
    injectedContainer.remove();
  }

  const group = document.createElement("div");
  group.className = "ascii-theme-toggle-group";
  group.setAttribute("data-ascii-controls", "1");

  const extraClass = config.className?.trim() || "";
  if (config.addThemeToggle) {
    themeToggleButton = createToggleButton("theme", extraClass);
    themeToggleButton.addEventListener("click", () => {
      toggleAsciiMode();
      updateInjectedToggleUI();
    });
  } else {
    themeToggleButton = null;
  }

  if (config.addStyleToggle) {
    styleToggleButton = createToggleButton("style", extraClass);
    styleToggleButton.addEventListener("click", () => {
      toggleAsciiStyle();
      updateInjectedToggleUI();
    });
  } else {
    styleToggleButton = null;
  }

  if (themeToggleButton) group.append(themeToggleButton);
  if (styleToggleButton) group.append(styleToggleButton);

  if (config.mountPlacement === "prepend") {
    mount.prepend(group);
  } else {
    mount.append(group);
  }

  injectedContainer = group;
  updateInjectedToggleUI();
}

function applyStyle(style: AsciiStyle): AsciiStyle {
  const next = normalizeStyle(style);
  root.setAttribute("data-style", next);
  if (next === "ascii") {
    renderStickers(document);
  } else {
    restoreAsciiStickers(document);
  }

  const mode = config.managedMode
    ? normalizeMode(root.getAttribute("data-ascii-mode"))
    : undefined;
  persistState(next, mode);
  updateInjectedToggleUI();
  return next;
}

export function initAsciiTheme(options: AsciiThemeOptions = {}): AsciiStyle {
  const managedMode = options.managedMode ?? DEFAULTS.managedMode;
  const defaultMode = options.defaultMode
    ? normalizeMode(options.defaultMode)
    : managedMode
      ? getPreferredMode()
      : DEFAULTS.defaultMode;

  config = {
    ...DEFAULTS,
    ...options,
    managedMode,
    defaultStyle: normalizeStyle(options.defaultStyle ?? DEFAULTS.defaultStyle),
    defaultMode,
  };

  // Keep behavior predictable even if only one toggle is injected.
  if (config.mountPlacement === "afterThemeToggle" && !config.addThemeToggle) {
    config.mountPlacement = "append";
  }

  const saved = readState(config.storageKey);
  const initialStyle = normalizeStyle(saved.style ?? config.defaultStyle);

  if (config.managedMode) {
    syncAsciiModeIfManaged(saved.mode ?? config.defaultMode);
  } else {
    root.removeAttribute("data-ascii-mode");
    if (config.themeAttr !== "data-theme") {
      const hostTheme = root.getAttribute(config.themeAttr);
      if (hostTheme === "light" || hostTheme === "dark") {
        root.setAttribute("data-theme", hostTheme);
      }
    }
  }

  injectTogglesIfNeeded();
  const applied = applyStyle(initialStyle);
  updateInjectedToggleUI();
  return applied;
}

export function setAsciiStyle(style: AsciiStyle): AsciiStyle {
  return applyStyle(style);
}

export function toggleAsciiStyle(): AsciiStyle {
  const current = getAsciiStyle();
  return applyStyle(current === "ascii" ? "default" : "ascii");
}

export function getAsciiStyle(): AsciiStyle {
  return normalizeStyle(root.getAttribute("data-style"));
}

export function setAsciiMode(mode: AsciiMode): AsciiMode {
  if (!config.managedMode) {
    return normalizeMode(root.getAttribute(config.themeAttr));
  }

  const next = normalizeMode(mode);
  root.setAttribute("data-ascii-mode", next);
  persistState(getAsciiStyle(), next);
  updateInjectedToggleUI();
  return next;
}

export function toggleAsciiMode(): AsciiMode {
  if (!config.managedMode) {
    return normalizeMode(root.getAttribute(config.themeAttr));
  }

  const current = normalizeMode(root.getAttribute("data-ascii-mode"));
  return setAsciiMode(current === "dark" ? "light" : "dark");
}

export function renderAsciiStickers(rootNode: ParentNode = document): void {
  renderStickers(rootNode);
}
