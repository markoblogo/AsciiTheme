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
};

const DEFAULTS: Required<AsciiThemeOptions> = {
  storageKey: "ascii_theme_v1",
  defaultStyle: "default",
  managedMode: false,
  defaultMode: "light",
  themeAttr: "data-theme",
};

let config: Required<AsciiThemeOptions> = { ...DEFAULTS };
const root = getRoot();

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

  return applyStyle(initialStyle);
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
