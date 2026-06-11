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

// src/stickers.ts
var stickers_exports = {};
__export(stickers_exports, {
  addSticker: () => addSticker,
  removeSticker: () => removeSticker,
  renderAsciiStickers: () => renderAsciiStickers,
  restoreAsciiStickers: () => restoreAsciiStickers,
  updateSticker: () => updateSticker
});
module.exports = __toCommonJS(stickers_exports);

// src/dom.ts
function queryAll(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
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
function renderPreset(config, tick = 0) {
  const preset = config.preset ?? "box";
  if (preset === "progress") {
    const max = config.max ?? 100;
    const value = clampProgress(config.value ?? 0, max);
    const filled = Math.round(value / max * 5);
    return `[${"\u2593".repeat(filled)}${"\u2591".repeat(5 - filled)} ${Math.round(value / max * 100)}%]`;
  }
  if (preset === "clock") {
    const now = /* @__PURE__ */ new Date();
    return `[${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}]`;
  }
  if (preset === "status-badge") {
    const status = (config.status ?? config.content ?? "LIVE").trim().toUpperCase();
    return `[\u25C8 ${status}]`;
  }
  if (preset === "spinner") {
    const frame = SPINNER_FRAMES[tick % SPINNER_FRAMES.length];
    return `[${frame}] ${(config.content ?? "Loading").trim()}`;
  }
  return makeBox(config.content ?? "");
}
function applyDecorativeState(host, config) {
  const decorative = config.decorative ?? !host.matches("button, a, [role='button']");
  if (decorative) {
    host.setAttribute("aria-hidden", "true");
    host.removeAttribute("aria-label");
    return;
  }
  host.removeAttribute("aria-hidden");
  if (config.ariaLabel) {
    host.setAttribute("aria-label", config.ariaLabel);
  }
}
function applyStickerClasses(host, pre, config) {
  const animation = config.animation ?? (config.animate && config.preset === "spinner" ? "spinner" : void 0);
  host.className = ["ascii-sticker-host", config.className ?? ""].filter(Boolean).join(" ");
  host.dataset.asciiStickerId = config.id;
  host.dataset.asciiStickerPreset = config.preset ?? "box";
  host.dataset.asciiStickerPosition = config.position ?? "inline";
  pre.className = "ascii-sticker";
  if (config.category) {
    pre.classList.add(`ascii-sticker--${config.category}`);
  }
  if (animation && animation !== "spinner") {
    pre.classList.add(`ascii-sticker--${animation}`);
  }
  if (config.animate && animation === "spinner") {
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
function createStickerRecord(config) {
  const host = document.createElement("div");
  const pre = document.createElement("pre");
  host.append(pre);
  applyStickerClasses(host, pre, config);
  applyDecorativeState(host, config);
  pre.textContent = renderPreset(config);
  return {
    config: { ...config, mount: config.mount ?? "append", position: config.position ?? "inline" },
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
function addSticker(config) {
  removeSticker(config.id);
  const record = createStickerRecord(config);
  stickerRegistry.set(config.id, record);
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
