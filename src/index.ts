import "./style.css";

import { getPreferredMode, getRoot, getSystemMode } from "./dom";
import { readState, writeState } from "./storage";
import { renderAsciiStickers as renderStickers, restoreAsciiStickers } from "./stickers";

export type AsciiStyle = "default" | "ascii";
export type AsciiMode = "light" | "dark";
export type ThemeIntegrationMode = "auto" | "respect" | "managed";
export type ThemeDetection = {
  hasHostTheme: boolean;
  mode?: AsciiMode;
};

export type AsciiThemeOptions = {
  storageKey?: string;
  defaultStyle?: AsciiStyle;
  managedMode?: boolean;
  defaultMode?: AsciiMode;
  themeAttr?: string;
  integrateTheme?: ThemeIntegrationMode;
  detectTheme?: (root: HTMLElement) => ThemeDetection;
  hasHostTheme?: boolean;
  addThemeToggle?: boolean;
  addStyleToggle?: boolean;
  mountSelector?: string | null;
  mountPlacement?: "append" | "prepend" | "afterThemeToggle";
  icons?: {
    sun?: string;
    moon?: string;
  };
  className?: string;
  base?: boolean;
};

type ResolvedAsciiThemeOptions = Omit<
  Required<AsciiThemeOptions>,
  "detectTheme" | "hasHostTheme"
> &
  Pick<AsciiThemeOptions, "detectTheme" | "hasHostTheme">;

const DEFAULTS: ResolvedAsciiThemeOptions = {
  storageKey: "ascii_theme_v1",
  defaultStyle: "default",
  managedMode: false,
  defaultMode: "light",
  themeAttr: "data-theme",
  integrateTheme: "auto",
  addThemeToggle: false,
  addStyleToggle: false,
  mountSelector: "",
  mountPlacement: "append",
  icons: {
    sun: "☀",
    moon: "☾",
  },
  className: "",
  base: false,
};

let config: ResolvedAsciiThemeOptions = { ...DEFAULTS };
let themeToggleButton: HTMLButtonElement | null = null;
let styleToggleButton: HTMLButtonElement | null = null;
let injectedContainer: HTMLElement | null = null;

function normalizeStyle(value: unknown): AsciiStyle {
  return value === "ascii" ? "ascii" : "default";
}

function normalizeMode(value: unknown): AsciiMode {
  return value === "dark" ? "dark" : "light";
}

function readHostMode(themeAttr: string): AsciiMode {
  const root = getRoot();
  const attrMode = root.getAttribute(themeAttr);
  if (attrMode === "dark" || attrMode === "light") {
    return attrMode;
  }

  const dataTheme = root.getAttribute("data-theme");
  if (dataTheme === "dark" || dataTheme === "light") {
    return dataTheme;
  }

  if (root.classList.contains("dark")) {
    return "dark";
  }
  if (root.classList.contains("light")) {
    return "light";
  }

  return "light";
}

function builtInThemeDetection(themeAttr: string): ThemeDetection {
  const root = getRoot();
  const attrMode = root.getAttribute(themeAttr);
  if (attrMode === "dark" || attrMode === "light") {
    return { hasHostTheme: true, mode: attrMode };
  }

  const dataTheme = root.getAttribute("data-theme");
  if (dataTheme === "dark" || dataTheme === "light") {
    return { hasHostTheme: true, mode: dataTheme };
  }

  if (root.classList.contains("dark")) {
    return { hasHostTheme: true, mode: "dark" };
  }
  if (root.classList.contains("light")) {
    return { hasHostTheme: true, mode: "light" };
  }

  return { hasHostTheme: false };
}

function resolveThemeIntegration(options: AsciiThemeOptions): {
  managedMode: boolean;
  addThemeToggle: boolean;
  defaultMode: AsciiMode;
} {
  const integration = options.integrateTheme ?? DEFAULTS.integrateTheme;
  const requestedThemeToggle = options.addThemeToggle ?? DEFAULTS.addThemeToggle;
  const requestedManaged = options.managedMode;
  const preferredMode = options.defaultMode
    ? normalizeMode(options.defaultMode)
    : getPreferredMode();

  if (integration === "managed") {
    return {
      managedMode: true,
      addThemeToggle: requestedThemeToggle,
      defaultMode: preferredMode,
    };
  }

  if (integration === "respect") {
    return {
      managedMode: false,
      addThemeToggle: false,
      defaultMode: readHostMode(options.themeAttr ?? DEFAULTS.themeAttr),
    };
  }

  const root = getRoot();
  const detected = options.detectTheme
    ? options.detectTheme(root)
    : builtInThemeDetection(options.themeAttr ?? DEFAULTS.themeAttr);

  const hasHostTheme = options.hasHostTheme ?? detected.hasHostTheme;
  if (hasHostTheme) {
    return {
      managedMode: false,
      addThemeToggle: false,
      defaultMode: normalizeMode(detected.mode ?? readHostMode(options.themeAttr ?? DEFAULTS.themeAttr)),
    };
  }

  return {
    managedMode: requestedManaged ?? (requestedThemeToggle ? true : DEFAULTS.managedMode),
    addThemeToggle: requestedThemeToggle,
    defaultMode: preferredMode,
  };
}

function syncAsciiModeIfManaged(mode?: AsciiMode): void {
  const root = getRoot();
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
    const root = getRoot();
    return normalizeMode(root.getAttribute("data-ascii-mode"));
  }
  return readHostMode(config.themeAttr);
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

  if (!shouldInject || !mountSelector) {
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

  if (config.addStyleToggle && !config.base) {
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
  const root = getRoot();
  const next = config.base ? "ascii" : normalizeStyle(style);
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
  const wantsBase = options.base ?? DEFAULTS.base;
  if (typeof window === "undefined" || typeof document === "undefined") {
    return wantsBase ? "ascii" : normalizeStyle(options.defaultStyle ?? DEFAULTS.defaultStyle);
  }

  const themeOptions: AsciiThemeOptions = {
    ...options,
    managedMode: wantsBase
      ? (options.managedMode ?? true)
      : options.managedMode,
  };
  const integration = resolveThemeIntegration(themeOptions);

  config = {
    ...DEFAULTS,
    ...themeOptions,
    base: wantsBase,
    managedMode: integration.managedMode,
    addThemeToggle: integration.addThemeToggle,
    addStyleToggle: wantsBase ? false : (themeOptions.addStyleToggle ?? DEFAULTS.addStyleToggle),
    defaultStyle: wantsBase
      ? "ascii"
      : normalizeStyle(themeOptions.defaultStyle ?? DEFAULTS.defaultStyle),
    defaultMode: integration.defaultMode,
  };

  if (config.mountPlacement === "afterThemeToggle" && !config.addThemeToggle) {
    config.mountPlacement = "append";
  }

  const saved = readState(config.storageKey);
  const initialStyle = config.base
    ? "ascii"
    : normalizeStyle(saved.style ?? config.defaultStyle);

  if (config.managedMode) {
    const resolvedMode = saved.mode
      ? normalizeMode(saved.mode)
      : options.defaultMode
        ? normalizeMode(options.defaultMode)
        : getSystemMode();
    syncAsciiModeIfManaged(resolvedMode);

    if (!saved.mode) {
      writeState(config.storageKey, {
        ...saved,
        style: initialStyle,
        mode: resolvedMode,
      });
    }
  } else {
    const root = getRoot();
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
  if (config.base) {
    return applyStyle("ascii");
  }
  const current = getAsciiStyle();
  return applyStyle(current === "ascii" ? "default" : "ascii");
}

export function getAsciiStyle(): AsciiStyle {
  if (config.base) {
    return "ascii";
  }
  const root = getRoot();
  return normalizeStyle(root.getAttribute("data-style"));
}

export function setAsciiMode(mode: AsciiMode): AsciiMode {
  if (!config.managedMode) {
    return normalizeMode(readHostMode(config.themeAttr));
  }

  const root = getRoot();
  const next = normalizeMode(mode);
  root.setAttribute("data-ascii-mode", next);
  persistState(getAsciiStyle(), next);
  updateInjectedToggleUI();
  return next;
}

export function toggleAsciiMode(): AsciiMode {
  if (!config.managedMode) {
    return normalizeMode(readHostMode(config.themeAttr));
  }

  const root = getRoot();
  const current = normalizeMode(root.getAttribute("data-ascii-mode"));
  return setAsciiMode(current === "dark" ? "light" : "dark");
}

export function renderAsciiStickers(rootNode: ParentNode = document): void {
  renderStickers(rootNode);
}
