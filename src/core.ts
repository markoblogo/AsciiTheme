import {
  getPreferredMode,
  getRoot,
  getSystemMode,
} from "./dom";
import { readState, writeState } from "./storage";
import {
  addSticker as mountSticker,
  renderAsciiStickers as renderStickers,
  removeSticker as unmountSticker,
  restoreAsciiStickers,
  updateSticker as patchSticker,
} from "./stickers";
import {
  BUILT_IN_THEME_ORDER,
  getBuiltInThemes,
  isBinaryTheme,
  normalizeThemeDefinition,
  resolveThemeMode,
} from "./themes";
import type {
  AsciiMode,
  AsciiStyle,
  AsciiThemeController,
  AsciiThemeDefinition,
  AsciiThemeListener,
  AsciiThemeOptions,
  AsciiThemeState,
  StickerConfig,
  ThemeDetection,
  ThemeName,
} from "./types";

type ResolvedAsciiThemeOptions = Omit<
  Required<AsciiThemeOptions>,
  "detectTheme" | "hasHostTheme" | "themes"
> &
  Pick<AsciiThemeOptions, "detectTheme" | "hasHostTheme" | "themes">;

const THEME_EVENT = "ascii-theme-change";
const STYLE_EVENT = "ascii-style-change";

const DEFAULTS: ResolvedAsciiThemeOptions = {
  storageKey: "ascii_theme_v1",
  defaultStyle: "default",
  managedMode: false,
  defaultMode: "light",
  defaultTheme: "light",
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
  transitions: true,
  keyboardShortcut: false,
};

const registry = new Map<ThemeName, AsciiThemeDefinition>();
let config: ResolvedAsciiThemeOptions = { ...DEFAULTS };
let themeToggleButton: HTMLButtonElement | null = null;
let styleToggleButton: HTMLButtonElement | null = null;
let injectedContainer: HTMLElement | null = null;
let keyboardListener: ((event: KeyboardEvent) => void) | null = null;
let currentTheme: ThemeName = "light";

function normalizeStyle(value: unknown): AsciiStyle {
  return value === "ascii" ? "ascii" : "default";
}

function normalizeMode(value: unknown): AsciiMode {
  return value === "dark" ? "dark" : "light";
}

function resetThemeRegistry(extraThemes?: Record<string, AsciiThemeDefinition>): void {
  registry.clear();

  const builtIns = getBuiltInThemes();
  for (const name of BUILT_IN_THEME_ORDER) {
    registry.set(name, normalizeThemeDefinition(name, builtIns[name]));
  }

  if (!extraThemes) {
    return;
  }

  for (const [name, definition] of Object.entries(extraThemes)) {
    registry.set(name, normalizeThemeDefinition(name, definition));
  }
}

function getThemeDefinition(theme: ThemeName): AsciiThemeDefinition {
  return registry.get(theme) ?? registry.get("light")!;
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
      defaultMode: normalizeMode(
        detected.mode ?? readHostMode(options.themeAttr ?? DEFAULTS.themeAttr),
      ),
    };
  }

  return {
    managedMode: requestedManaged ?? (requestedThemeToggle ? true : DEFAULTS.managedMode),
    addThemeToggle: requestedThemeToggle,
    defaultMode: preferredMode,
  };
}

function getAsciiStyle(): AsciiStyle {
  if (config.base) {
    return "ascii";
  }
  return normalizeStyle(getRoot().getAttribute("data-style"));
}

function getAsciiMode(): AsciiMode {
  if (!config.managedMode) {
    return readHostMode(config.themeAttr);
  }
  return resolveThemeMode(currentTheme, getThemeDefinition(currentTheme));
}

function getTheme(): ThemeName {
  return currentTheme;
}

function getState(): AsciiThemeState {
  return {
    style: getAsciiStyle(),
    theme: getTheme(),
    mode: getAsciiMode(),
    managedMode: config.managedMode,
    base: config.base,
  };
}

function emit(eventName: string): void {
  if (typeof window === "undefined") {
    return;
  }
  const detail = getState();
  const event = new CustomEvent<AsciiThemeState>(eventName, { detail });
  window.dispatchEvent(event);
  getRoot().dispatchEvent(new CustomEvent<AsciiThemeState>(eventName, { detail }));
}

function persistState(style: AsciiStyle): void {
  const current = readState(config.storageKey);
  writeState(config.storageKey, {
    ...current,
    style: config.base ? style : undefined,
    theme: currentTheme,
    mode: config.managedMode && isBinaryTheme(currentTheme)
      ? currentTheme
      : undefined,
  });
}

function applyThemeTokens(theme: ThemeName): void {
  const definition = getThemeDefinition(theme);
  const root = getRoot();
  const ui = definition.ui ?? {};

  currentTheme = theme;
  root.setAttribute("data-ascii-theme", theme);

  root.style.setProperty("--a-bg", definition.ascii.bg);
  root.style.setProperty("--a-fg", definition.ascii.fg);
  root.style.setProperty("--a-muted", definition.ascii.muted);
  root.style.setProperty("--a-border", definition.ascii.border ?? definition.ascii.fg);
  root.style.setProperty("--a-link", definition.ascii.link ?? definition.ascii.fg);
  root.style.setProperty("--a-code-bg", definition.ascii.codeBg ?? definition.ascii.bg);

  root.style.setProperty("--bg", ui.bg ?? definition.ascii.bg);
  root.style.setProperty("--text", ui.fg ?? definition.ascii.fg);
  root.style.setProperty("--muted", ui.muted ?? definition.ascii.muted);
  root.style.setProperty("--border", ui.border ?? definition.ascii.border ?? definition.ascii.fg);
  root.style.setProperty("--a-ui-bg", ui.bg ?? definition.ascii.bg);
  root.style.setProperty("--a-ui-fg", ui.fg ?? definition.ascii.fg);
  root.style.setProperty("--a-ui-border", ui.border ?? definition.ascii.border ?? definition.ascii.fg);
  root.style.setProperty("--a-ui-muted", ui.muted ?? definition.ascii.muted);
  root.style.setProperty("--a-ui-surface", ui.surface ?? ui.card ?? definition.ascii.bg);
  root.style.setProperty("--a-ui-card", ui.card ?? ui.surface ?? definition.ascii.bg);
  root.style.setProperty("--a-color-scheme", definition.colorScheme ?? resolveThemeMode(theme, definition));
  root.style.colorScheme = definition.colorScheme ?? resolveThemeMode(theme, definition);

  if (config.managedMode && isBinaryTheme(theme)) {
    root.setAttribute("data-ascii-mode", theme);
  } else {
    root.removeAttribute("data-ascii-mode");
  }
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
    const icon = mode === "dark"
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
  const shouldInject = Boolean(mountSelector) && (config.addThemeToggle || config.addStyleToggle);

  if (!shouldInject || !mountSelector) {
    return;
  }

  const mount = document.querySelector<HTMLElement>(mountSelector);
  if (!mount) {
    return;
  }

  injectedContainer?.remove();

  const group = document.createElement("div");
  group.className = "ascii-theme-toggle-group";
  group.setAttribute("data-ascii-controls", "1");

  const extraClass = config.className?.trim() || "";
  if (config.addThemeToggle) {
    themeToggleButton = createToggleButton("theme", extraClass);
    themeToggleButton.addEventListener("click", () => {
      toggleAsciiMode();
    });
  } else {
    themeToggleButton = null;
  }

  if (config.addStyleToggle && !config.base) {
    styleToggleButton = createToggleButton("style", extraClass);
    styleToggleButton.addEventListener("click", () => {
      toggleAsciiStyle();
    });
  } else {
    styleToggleButton = null;
  }

  if (themeToggleButton) {
    group.append(themeToggleButton);
  }
  if (styleToggleButton) {
    group.append(styleToggleButton);
  }

  if (config.mountPlacement === "prepend") {
    mount.prepend(group);
  } else {
    mount.append(group);
  }

  injectedContainer = group;
  updateInjectedToggleUI();
}

function applyStyle(style: AsciiStyle, emitChange = true): AsciiStyle {
  const root = getRoot();
  const next = config.base ? "ascii" : normalizeStyle(style);
  root.setAttribute("data-style", next);

  if (next === "ascii") {
    renderStickers(document);
  } else {
    restoreAsciiStickers(document);
  }

  persistState(next);
  updateInjectedToggleUI();
  if (emitChange) {
    emit(STYLE_EVENT);
  }
  return next;
}

function applyTheme(theme: ThemeName, emitChange = true): ThemeName {
  if (!registry.has(theme)) {
    return currentTheme;
  }

  applyThemeTokens(theme);
  persistState(getAsciiStyle());
  updateInjectedToggleUI();

  if (emitChange) {
    emit(THEME_EVENT);
  }
  return currentTheme;
}

function syncThemeToHostMode(): void {
  if (config.managedMode) {
    return;
  }
  const hostMode = readHostMode(config.themeAttr);
  if (isBinaryTheme(hostMode)) {
    applyTheme(hostMode, false);
  }
}

function installKeyboardShortcut(): void {
  if (keyboardListener) {
    window.removeEventListener("keydown", keyboardListener);
    keyboardListener = null;
  }

  if (!config.keyboardShortcut || typeof window === "undefined") {
    return;
  }

  keyboardListener = (event: KeyboardEvent) => {
    if (config.keyboardShortcut !== "Alt+T") {
      return;
    }
    if (event.altKey && !event.metaKey && !event.ctrlKey && event.key.toLowerCase() === "t") {
      event.preventDefault();
      toggleAsciiStyle();
    }
  };

  window.addEventListener("keydown", keyboardListener);
}

function resolveInitialTheme(savedTheme?: ThemeName, savedMode?: AsciiMode): ThemeName {
  if (savedTheme && registry.has(savedTheme)) {
    return savedTheme;
  }

  if (config.defaultTheme && registry.has(config.defaultTheme)) {
    return config.defaultTheme;
  }

  if (savedMode && registry.has(savedMode)) {
    return savedMode;
  }

  if (config.managedMode && registry.has(config.defaultMode)) {
    return config.defaultMode;
  }

  const hostMode = readHostMode(config.themeAttr);
  return registry.has(hostMode) ? hostMode : "light";
}

export function initAsciiTheme(options: AsciiThemeOptions = {}): AsciiStyle {
  const wantsBase = options.base ?? DEFAULTS.base;
  if (typeof window === "undefined" || typeof document === "undefined") {
    return wantsBase ? "ascii" : normalizeStyle(options.defaultStyle ?? DEFAULTS.defaultStyle);
  }

  resetThemeRegistry(options.themes);

  const themeOptions: AsciiThemeOptions = {
    ...options,
    managedMode: wantsBase ? (options.managedMode ?? true) : options.managedMode,
  };
  const integration = resolveThemeIntegration(themeOptions);

  config = {
    ...DEFAULTS,
    ...themeOptions,
    base: wantsBase,
    managedMode: integration.managedMode,
    addThemeToggle: integration.addThemeToggle,
    addStyleToggle: wantsBase ? false : (themeOptions.addStyleToggle ?? DEFAULTS.addStyleToggle),
    defaultStyle: wantsBase ? "ascii" : normalizeStyle(themeOptions.defaultStyle ?? DEFAULTS.defaultStyle),
    defaultMode: integration.defaultMode,
    defaultTheme: themeOptions.defaultTheme ?? integration.defaultMode,
  };

  if (config.mountPlacement === "afterThemeToggle" && !config.addThemeToggle) {
    config.mountPlacement = "append";
  }

  const root = getRoot();
  root.setAttribute("data-ascii-transitions", config.transitions ? "on" : "off");

  const saved = readState(config.storageKey);
  const initialStyle = config.base ? "ascii" : normalizeStyle(config.defaultStyle);
  const initialTheme = resolveInitialTheme(saved.theme, saved.mode);

  applyTheme(initialTheme, false);

  if (!config.managedMode) {
    root.removeAttribute("data-ascii-mode");
    if (config.themeAttr !== "data-theme") {
      const hostTheme = root.getAttribute(config.themeAttr);
      if (hostTheme === "light" || hostTheme === "dark") {
        root.setAttribute("data-theme", hostTheme);
      }
    }
    syncThemeToHostMode();
  }

  installKeyboardShortcut();
  injectTogglesIfNeeded();
  const applied = applyStyle(initialStyle, false);
  persistState(applied);
  updateInjectedToggleUI();
  emit(THEME_EVENT);
  emit(STYLE_EVENT);
  return applied;
}

export function setAsciiStyle(style: AsciiStyle): AsciiStyle {
  return applyStyle(style);
}

export function toggleAsciiStyle(): AsciiStyle {
  if (config.base) {
    return applyStyle("ascii");
  }
  return applyStyle(getAsciiStyle() === "ascii" ? "default" : "ascii");
}

export function setAsciiMode(mode: AsciiMode): AsciiMode {
  if (!config.managedMode) {
    syncThemeToHostMode();
    return readHostMode(config.themeAttr);
  }

  setTheme(mode);
  return mode;
}

export function toggleAsciiMode(): AsciiMode {
  return setAsciiMode(getAsciiMode() === "dark" ? "light" : "dark");
}

export function setTheme(theme: ThemeName): ThemeName {
  return applyTheme(theme);
}

export function registerTheme(name: ThemeName, definition: AsciiThemeDefinition): void {
  registry.set(name, normalizeThemeDefinition(name, definition));
  if (name === currentTheme) {
    applyTheme(name);
  }
}

export function getThemes(): Record<string, AsciiThemeDefinition> {
  return Object.fromEntries(registry.entries());
}

export function getAsciiThemeState(): AsciiThemeState {
  return getState();
}

export function subscribeAsciiTheme(listener: AsciiThemeListener): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<AsciiThemeState>).detail;
    listener(detail ?? getState());
  };

  window.addEventListener(THEME_EVENT, handler);
  window.addEventListener(STYLE_EVENT, handler);
  return () => {
    window.removeEventListener(THEME_EVENT, handler);
    window.removeEventListener(STYLE_EVENT, handler);
  };
}

export function renderAsciiStickers(rootNode: ParentNode = document): void {
  renderStickers(rootNode);
}

export function addSticker(config: StickerConfig): HTMLElement {
  return mountSticker(config);
}

export function removeSticker(id: string): void {
  unmountSticker(id);
}

export function updateSticker(id: string, patch: Partial<StickerConfig>): void {
  patchSticker(id, patch);
}

export const AsciiTheme: AsciiThemeController = {
  init: initAsciiTheme,
  getState: getAsciiThemeState,
  subscribe: subscribeAsciiTheme,
  setStyle: setAsciiStyle,
  toggleStyle: toggleAsciiStyle,
  getStyle: getAsciiStyle,
  setMode: setAsciiMode,
  toggleMode: toggleAsciiMode,
  getMode: getAsciiMode,
  setTheme,
  getTheme,
  registerTheme,
  getThemes,
};

export { getAsciiStyle, getAsciiMode, getTheme, THEME_EVENT, STYLE_EVENT };
