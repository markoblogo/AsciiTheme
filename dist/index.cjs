"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/node.ts
var node_exports = {};
__export(node_exports, {
  AsciiTheme: () => AsciiTheme,
  STYLE_EVENT: () => STYLE_EVENT,
  THEME_EVENT: () => THEME_EVENT,
  addSticker: () => addSticker2,
  getAsciiMode: () => getAsciiMode,
  getAsciiStyle: () => getAsciiStyle,
  getAsciiThemeState: () => getAsciiThemeState,
  getTheme: () => getTheme,
  getThemes: () => getThemes,
  initAsciiTheme: () => initAsciiTheme,
  registerTheme: () => registerTheme,
  removeSticker: () => removeSticker2,
  renderAsciiStickers: () => renderAsciiStickers2,
  setAsciiMode: () => setAsciiMode,
  setAsciiStyle: () => setAsciiStyle,
  setTheme: () => setTheme,
  subscribeAsciiTheme: () => subscribeAsciiTheme,
  toggleAsciiMode: () => toggleAsciiMode,
  toggleAsciiStyle: () => toggleAsciiStyle,
  updateSticker: () => updateSticker2
});
module.exports = __toCommonJS(node_exports);

// src/dom.ts
function getRoot() {
  return document.documentElement;
}
function queryAll(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}
function getSystemMode() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function getPreferredMode() {
  return getSystemMode();
}

// src/storage.ts
function readState(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    const obj = parsed;
    return {
      style: obj.style === "ascii" ? "ascii" : obj.style === "default" ? "default" : void 0,
      mode: obj.mode === "dark" ? "dark" : obj.mode === "light" ? "light" : void 0,
      theme: typeof obj.theme === "string" ? obj.theme : void 0
    };
  } catch {
    return {};
  }
}
function writeState(storageKey, state) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
  }
}

// src/stickers.ts
var RENDERED_ATTR = "data-ascii-sticker-rendered";
var PRE_SELECTOR = "pre.ascii-sticker";
var originalHtml = /* @__PURE__ */ new WeakMap();
var stickerRegistry = /* @__PURE__ */ new Map();
var SPINNER_FRAMES = ["|", "/", "-", "\\"];
function makeBox(text, paddingX = 2) {
  const label = text.replace(/\s+/g, " ").trim();
  const inner = `${" ".repeat(paddingX)}${label}${" ".repeat(paddingX)}`;
  const top = `\u250C${"\u2500".repeat(inner.length)}\u2510`;
  const mid = `\u2502${inner}\u2502`;
  const bot = `\u2514${"\u2500".repeat(inner.length)}\u2518`;
  return `${top}
${mid}
${bot}`;
}
function clampProgress(value, max) {
  if (max <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(value, max));
}
function renderPreset(config2, tick = 0) {
  const preset = config2.preset ?? "box";
  if (preset === "progress") {
    const max = config2.max ?? 100;
    const value = clampProgress(config2.value ?? 0, max);
    const filled = Math.round(value / max * 5);
    return `[${"\u2593".repeat(filled)}${"\u2591".repeat(5 - filled)} ${Math.round(value / max * 100)}%]`;
  }
  if (preset === "clock") {
    const now = /* @__PURE__ */ new Date();
    return `[${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}]`;
  }
  if (preset === "status-badge") {
    const status = (config2.status ?? config2.content ?? "LIVE").trim().toUpperCase();
    return `[\u25C8 ${status}]`;
  }
  if (preset === "spinner") {
    const frame = SPINNER_FRAMES[tick % SPINNER_FRAMES.length];
    return `[${frame}] ${(config2.content ?? "Loading").trim()}`;
  }
  return makeBox(config2.content ?? "");
}
function applyDecorativeState(host, config2) {
  const decorative = config2.decorative ?? !host.matches("button, a, [role='button']");
  if (decorative) {
    host.setAttribute("aria-hidden", "true");
    host.removeAttribute("aria-label");
    return;
  }
  host.removeAttribute("aria-hidden");
  if (config2.ariaLabel) {
    host.setAttribute("aria-label", config2.ariaLabel);
  }
}
function applyStickerClasses(host, pre, config2) {
  const animation = config2.animation ?? (config2.animate && config2.preset === "spinner" ? "spinner" : void 0);
  host.className = ["ascii-sticker-host", config2.className ?? ""].filter(Boolean).join(" ");
  host.dataset.asciiStickerId = config2.id;
  host.dataset.asciiStickerPreset = config2.preset ?? "box";
  host.dataset.asciiStickerPosition = config2.position ?? "inline";
  pre.className = "ascii-sticker";
  if (config2.category) {
    pre.classList.add(`ascii-sticker--${config2.category}`);
  }
  if (animation && animation !== "spinner") {
    pre.classList.add(`ascii-sticker--${animation}`);
  }
  if (config2.animate && animation === "spinner") {
    pre.classList.add("ascii-sticker--spinner");
  }
}
function startTicker(record) {
  clearTicker(record);
  const preset = record.config.preset ?? "box";
  if (preset !== "clock" && preset !== "spinner") {
    return;
  }
  const intervalMs = record.config.intervalMs ?? (preset === "clock" ? 1e3 : 120);
  let tick = 0;
  record.timer = window.setInterval(() => {
    tick += 1;
    record.pre.textContent = renderPreset(record.config, tick);
  }, intervalMs);
}
function clearTicker(record) {
  if (record.timer !== null) {
    window.clearInterval(record.timer);
    record.timer = null;
  }
}
function findTarget(target) {
  if (target instanceof HTMLElement) {
    return target;
  }
  if (typeof target === "string") {
    const found = document.querySelector(target);
    if (found) {
      return found;
    }
  }
  return document.body;
}
function createStickerRecord(config2) {
  const host = document.createElement("div");
  const pre = document.createElement("pre");
  host.append(pre);
  applyStickerClasses(host, pre, config2);
  applyDecorativeState(host, config2);
  pre.textContent = renderPreset(config2);
  return {
    config: { ...config2, mount: config2.mount ?? "append", position: config2.position ?? "inline" },
    host,
    pre,
    timer: null
  };
}
function mountRecord(record) {
  const target = findTarget(record.config.target);
  if (record.config.mount === "prepend") {
    target.prepend(record.host);
  } else {
    target.append(record.host);
  }
  startTicker(record);
}
function renderSticker(element) {
  if (!originalHtml.has(element)) {
    originalHtml.set(element, element.innerHTML);
  }
  const label = (element.getAttribute("data-ascii-sticker") || "").trim();
  if (!label) {
    return;
  }
  const existing = element.querySelector(PRE_SELECTOR);
  if (element.getAttribute(RENDERED_ATTR) === "1" && existing) {
    existing.textContent = makeBox(label);
    return;
  }
  element.innerHTML = "";
  const pre = document.createElement("pre");
  pre.className = "ascii-sticker ascii-sticker--legacy";
  pre.textContent = makeBox(label);
  if (element.matches("button, a, [role='button']")) {
    element.setAttribute("aria-label", label);
  }
  element.appendChild(pre);
  element.setAttribute(RENDERED_ATTR, "1");
}
function restoreSticker(element) {
  const original = originalHtml.get(element);
  if (original === void 0) {
    return;
  }
  element.innerHTML = original;
  element.removeAttribute(RENDERED_ATTR);
}
function renderAsciiStickers(root = document) {
  const stickers = queryAll("[data-ascii-sticker]", root);
  for (const sticker of stickers) {
    renderSticker(sticker);
  }
}
function restoreAsciiStickers(root = document) {
  const stickers = queryAll("[data-ascii-sticker]", root);
  for (const sticker of stickers) {
    restoreSticker(sticker);
  }
}
function addSticker(config2) {
  removeSticker(config2.id);
  const record = createStickerRecord(config2);
  stickerRegistry.set(config2.id, record);
  mountRecord(record);
  return record.host;
}
function removeSticker(id) {
  const record = stickerRegistry.get(id);
  if (!record) {
    return;
  }
  clearTicker(record);
  record.host.remove();
  stickerRegistry.delete(id);
}
function updateSticker(id, patch) {
  const record = stickerRegistry.get(id);
  if (!record) {
    return;
  }
  record.config = { ...record.config, ...patch, id };
  applyStickerClasses(record.host, record.pre, record.config);
  applyDecorativeState(record.host, record.config);
  record.pre.textContent = renderPreset(record.config);
  startTicker(record);
}

// src/themes.ts
var BUILT_IN_THEME_ORDER = [
  "light",
  "dark",
  "sepia",
  "matrix"
];
var BUILT_IN_THEMES = {
  light: {
    label: "Light",
    mode: "light",
    colorScheme: "light",
    ascii: {
      bg: "#ffffff",
      fg: "#0b2a7a",
      muted: "#1a409c",
      border: "#0b2a7a",
      link: "#0b2a7a",
      codeBg: "#eef2ff"
    },
    ui: {
      bg: "#f7f9ff",
      fg: "#121a2b",
      muted: "#3f4f73",
      border: "rgba(18, 26, 43, 0.22)",
      card: "#ffffff",
      surface: "#ffffff"
    }
  },
  dark: {
    label: "Dark",
    mode: "dark",
    colorScheme: "dark",
    ascii: {
      bg: "#000000",
      fg: "#39ff14",
      muted: "#2ddd18",
      border: "#39ff14",
      link: "#39ff14",
      codeBg: "#051305"
    },
    ui: {
      bg: "#0b0c10",
      fg: "rgba(255, 255, 255, 0.92)",
      muted: "rgba(255, 255, 255, 0.62)",
      border: "rgba(255, 255, 255, 0.18)",
      card: "#101722",
      surface: "#101722"
    }
  },
  sepia: {
    label: "Sepia",
    mode: "light",
    colorScheme: "light",
    ascii: {
      bg: "#f3ead6",
      fg: "#5b4636",
      muted: "#7c5d49",
      border: "#5b4636",
      link: "#7b5330",
      codeBg: "#e6d8bd"
    },
    ui: {
      bg: "#f4ecd8",
      fg: "#4f3b2d",
      muted: "#7f644d",
      border: "rgba(91, 70, 54, 0.28)",
      card: "#fcf4e4",
      surface: "#f8efdc"
    }
  },
  matrix: {
    label: "Matrix",
    mode: "dark",
    colorScheme: "dark",
    ascii: {
      bg: "#020b02",
      fg: "#39ff14",
      muted: "#1fbd33",
      border: "#39ff14",
      link: "#64ff70",
      codeBg: "#041204"
    },
    ui: {
      bg: "#050805",
      fg: "#b9ffbe",
      muted: "#74c977",
      border: "rgba(57, 255, 20, 0.28)",
      card: "#0c140c",
      surface: "#0c140c"
    }
  }
};
function getBuiltInThemes() {
  return { ...BUILT_IN_THEMES };
}
function normalizeAsciiTokens(tokens) {
  return {
    ...tokens,
    border: tokens.border ?? tokens.fg,
    link: tokens.link ?? tokens.fg,
    codeBg: tokens.codeBg ?? tokens.bg
  };
}
function normalizeUiTokens(ascii, ui) {
  return {
    bg: ui?.bg ?? ascii.bg,
    fg: ui?.fg ?? ascii.fg,
    muted: ui?.muted ?? ascii.muted,
    border: ui?.border ?? ascii.border ?? ascii.fg,
    card: ui?.card ?? ui?.surface ?? ascii.bg,
    surface: ui?.surface ?? ui?.card ?? ascii.bg
  };
}
function normalizeThemeDefinition(name, definition) {
  const ascii = normalizeAsciiTokens(definition.ascii);
  const colorScheme = definition.colorScheme ?? definition.mode ?? "light";
  return {
    label: definition.label ?? String(name),
    mode: definition.mode ?? (colorScheme === "dark" ? "dark" : "light"),
    colorScheme,
    ascii,
    ui: normalizeUiTokens(ascii, definition.ui)
  };
}
function resolveThemeMode(themeName, definition) {
  if (themeName === "dark" || themeName === "matrix") {
    return "dark";
  }
  if (themeName === "light" || themeName === "sepia") {
    return "light";
  }
  return definition.mode ?? definition.colorScheme ?? "light";
}
function isBinaryTheme(themeName) {
  return themeName === "light" || themeName === "dark";
}

// src/core.ts
var THEME_EVENT = "ascii-theme-change";
var STYLE_EVENT = "ascii-style-change";
var DEFAULTS = {
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
    sun: "\u2600",
    moon: "\u263E"
  },
  className: "",
  base: false,
  transitions: true,
  keyboardShortcut: false
};
var registry = /* @__PURE__ */ new Map();
var config = { ...DEFAULTS };
var themeToggleButton = null;
var styleToggleButton = null;
var injectedContainer = null;
var keyboardListener = null;
var currentTheme = "light";
function normalizeStyle(value) {
  return value === "ascii" ? "ascii" : "default";
}
function normalizeMode(value) {
  return value === "dark" ? "dark" : "light";
}
function resetThemeRegistry(extraThemes) {
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
function getThemeDefinition(theme) {
  return registry.get(theme) ?? registry.get("light");
}
function readHostMode(themeAttr) {
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
function builtInThemeDetection(themeAttr) {
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
function resolveThemeIntegration(options) {
  const integration = options.integrateTheme ?? DEFAULTS.integrateTheme;
  const requestedThemeToggle = options.addThemeToggle ?? DEFAULTS.addThemeToggle;
  const requestedManaged = options.managedMode;
  const preferredMode = options.defaultMode ? normalizeMode(options.defaultMode) : getPreferredMode();
  if (integration === "managed") {
    return {
      managedMode: true,
      addThemeToggle: requestedThemeToggle,
      defaultMode: preferredMode
    };
  }
  if (integration === "respect") {
    return {
      managedMode: false,
      addThemeToggle: false,
      defaultMode: readHostMode(options.themeAttr ?? DEFAULTS.themeAttr)
    };
  }
  const root = getRoot();
  const detected = options.detectTheme ? options.detectTheme(root) : builtInThemeDetection(options.themeAttr ?? DEFAULTS.themeAttr);
  const hasHostTheme = options.hasHostTheme ?? detected.hasHostTheme;
  if (hasHostTheme) {
    return {
      managedMode: false,
      addThemeToggle: false,
      defaultMode: normalizeMode(
        detected.mode ?? readHostMode(options.themeAttr ?? DEFAULTS.themeAttr)
      )
    };
  }
  return {
    managedMode: requestedManaged ?? (requestedThemeToggle ? true : DEFAULTS.managedMode),
    addThemeToggle: requestedThemeToggle,
    defaultMode: preferredMode
  };
}
function getAsciiStyle() {
  if (config.base) {
    return "ascii";
  }
  return normalizeStyle(getRoot().getAttribute("data-style"));
}
function getAsciiMode() {
  if (!config.managedMode) {
    return readHostMode(config.themeAttr);
  }
  return resolveThemeMode(currentTheme, getThemeDefinition(currentTheme));
}
function getTheme() {
  return currentTheme;
}
function getState() {
  return {
    style: getAsciiStyle(),
    theme: getTheme(),
    mode: getAsciiMode(),
    managedMode: config.managedMode,
    base: config.base
  };
}
function emit(eventName) {
  if (typeof window === "undefined") {
    return;
  }
  const detail = getState();
  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
  getRoot().dispatchEvent(new CustomEvent(eventName, { detail }));
}
function persistState(style) {
  const current = readState(config.storageKey);
  writeState(config.storageKey, {
    ...current,
    style: config.base ? style : void 0,
    theme: currentTheme,
    mode: config.managedMode && isBinaryTheme(currentTheme) ? currentTheme : void 0
  });
}
function applyThemeTokens(theme) {
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
function updateInjectedToggleUI() {
  if (styleToggleButton) {
    const style = getAsciiStyle();
    const toAscii = style !== "ascii";
    styleToggleButton.textContent = toAscii ? "ASCII" : "Default";
    styleToggleButton.setAttribute(
      "aria-label",
      toAscii ? "Switch to ASCII style" : "Switch to default style"
    );
  }
  if (themeToggleButton) {
    const mode = getAsciiMode();
    const icon = mode === "dark" ? config.icons.moon ?? "\u263E" : config.icons.sun ?? "\u2600";
    themeToggleButton.textContent = icon;
    themeToggleButton.setAttribute(
      "aria-label",
      mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}
function createToggleButton(type, className) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `ascii-theme-toggle-btn ${className}`.trim();
  button.dataset.asciiToggleType = type;
  return button;
}
function injectTogglesIfNeeded() {
  const mountSelector = config.mountSelector;
  const shouldInject = Boolean(mountSelector) && (config.addThemeToggle || config.addStyleToggle);
  if (!shouldInject || !mountSelector) {
    return;
  }
  const mount = document.querySelector(mountSelector);
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
function applyStyle(style, emitChange = true) {
  const root = getRoot();
  const next = config.base ? "ascii" : normalizeStyle(style);
  root.setAttribute("data-style", next);
  if (next === "ascii") {
    renderAsciiStickers(document);
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
function applyTheme(theme, emitChange = true) {
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
function syncThemeToHostMode() {
  if (config.managedMode) {
    return;
  }
  const hostMode = readHostMode(config.themeAttr);
  if (isBinaryTheme(hostMode)) {
    applyTheme(hostMode, false);
  }
}
function installKeyboardShortcut() {
  if (keyboardListener) {
    window.removeEventListener("keydown", keyboardListener);
    keyboardListener = null;
  }
  if (!config.keyboardShortcut || typeof window === "undefined") {
    return;
  }
  keyboardListener = (event) => {
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
function resolveInitialTheme(savedTheme, savedMode) {
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
function initAsciiTheme(options = {}) {
  const wantsBase = options.base ?? DEFAULTS.base;
  if (typeof window === "undefined" || typeof document === "undefined") {
    return wantsBase ? "ascii" : normalizeStyle(options.defaultStyle ?? DEFAULTS.defaultStyle);
  }
  resetThemeRegistry(options.themes);
  const themeOptions = {
    ...options,
    managedMode: wantsBase ? options.managedMode ?? true : options.managedMode
  };
  const integration = resolveThemeIntegration(themeOptions);
  config = {
    ...DEFAULTS,
    ...themeOptions,
    base: wantsBase,
    managedMode: integration.managedMode,
    addThemeToggle: integration.addThemeToggle,
    addStyleToggle: wantsBase ? false : themeOptions.addStyleToggle ?? DEFAULTS.addStyleToggle,
    defaultStyle: wantsBase ? "ascii" : normalizeStyle(themeOptions.defaultStyle ?? DEFAULTS.defaultStyle),
    defaultMode: integration.defaultMode,
    defaultTheme: themeOptions.defaultTheme ?? integration.defaultMode
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
function setAsciiStyle(style) {
  return applyStyle(style);
}
function toggleAsciiStyle() {
  if (config.base) {
    return applyStyle("ascii");
  }
  return applyStyle(getAsciiStyle() === "ascii" ? "default" : "ascii");
}
function setAsciiMode(mode) {
  if (!config.managedMode) {
    syncThemeToHostMode();
    return readHostMode(config.themeAttr);
  }
  setTheme(mode);
  return mode;
}
function toggleAsciiMode() {
  return setAsciiMode(getAsciiMode() === "dark" ? "light" : "dark");
}
function setTheme(theme) {
  return applyTheme(theme);
}
function registerTheme(name, definition) {
  registry.set(name, normalizeThemeDefinition(name, definition));
  if (name === currentTheme) {
    applyTheme(name);
  }
}
function getThemes() {
  return Object.fromEntries(registry.entries());
}
function getAsciiThemeState() {
  return getState();
}
function subscribeAsciiTheme(listener) {
  if (typeof window === "undefined") {
    return () => {
    };
  }
  const handler = (event) => {
    const detail = event.detail;
    listener(detail ?? getState());
  };
  window.addEventListener(THEME_EVENT, handler);
  window.addEventListener(STYLE_EVENT, handler);
  return () => {
    window.removeEventListener(THEME_EVENT, handler);
    window.removeEventListener(STYLE_EVENT, handler);
  };
}
function renderAsciiStickers2(rootNode = document) {
  renderAsciiStickers(rootNode);
}
function addSticker2(config2) {
  return addSticker(config2);
}
function removeSticker2(id) {
  removeSticker(id);
}
function updateSticker2(id, patch) {
  updateSticker(id, patch);
}
var AsciiTheme = {
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
  getThemes
};
