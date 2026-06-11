import { queryAll } from "./dom";
import type { StickerConfig } from "./types";

const RENDERED_ATTR = "data-ascii-sticker-rendered";
const PRE_SELECTOR = "pre.ascii-sticker";
const originalHtml = new WeakMap<HTMLElement, string>();

type StickerRecord = {
  config: StickerConfig;
  host: HTMLElement;
  pre: HTMLPreElement;
  timer: number | null;
};

const stickerRegistry = new Map<string, StickerRecord>();

const SPINNER_FRAMES = ["|", "/", "-", "\\"];

function makeBox(text: string, paddingX = 2): string {
  const label = text.replace(/\s+/g, " ").trim();
  const inner = `${" ".repeat(paddingX)}${label}${" ".repeat(paddingX)}`;
  const top = `┌${"─".repeat(inner.length)}┐`;
  const mid = `│${inner}│`;
  const bot = `└${"─".repeat(inner.length)}┘`;
  return `${top}\n${mid}\n${bot}`;
}

function clampProgress(value: number, max: number): number {
  if (max <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(value, max));
}

function renderPreset(config: StickerConfig, tick = 0): string {
  const preset = config.preset ?? "box";

  if (preset === "progress") {
    const max = config.max ?? 100;
    const value = clampProgress(config.value ?? 0, max);
    const filled = Math.round((value / max) * 5);
    return `[${"▓".repeat(filled)}${"░".repeat(5 - filled)} ${Math.round((value / max) * 100)}%]`;
  }

  if (preset === "clock") {
    const now = new Date();
    return `[${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}]`;
  }

  if (preset === "status-badge") {
    const status = (config.status ?? config.content ?? "LIVE").trim().toUpperCase();
    return `[◈ ${status}]`;
  }

  if (preset === "spinner") {
    const frame = SPINNER_FRAMES[tick % SPINNER_FRAMES.length];
    return `[${frame}] ${(config.content ?? "Loading").trim()}`;
  }

  return makeBox(config.content ?? "");
}

function applyDecorativeState(host: HTMLElement, config: StickerConfig): void {
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

function applyStickerClasses(host: HTMLElement, pre: HTMLPreElement, config: StickerConfig): void {
  const animation = config.animation ?? (config.animate && config.preset === "spinner" ? "spinner" : undefined);
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

function startTicker(record: StickerRecord): void {
  clearTicker(record);

  const preset = record.config.preset ?? "box";
  if (preset !== "clock" && preset !== "spinner") {
    return;
  }

  const intervalMs = record.config.intervalMs ?? (preset === "clock" ? 1000 : 120);
  let tick = 0;
  record.timer = window.setInterval(() => {
    tick += 1;
    record.pre.textContent = renderPreset(record.config, tick);
  }, intervalMs);
}

function clearTicker(record: StickerRecord): void {
  if (record.timer !== null) {
    window.clearInterval(record.timer);
    record.timer = null;
  }
}

function findTarget(target?: string | HTMLElement): HTMLElement {
  if (target instanceof HTMLElement) {
    return target;
  }
  if (typeof target === "string") {
    const found = document.querySelector<HTMLElement>(target);
    if (found) {
      return found;
    }
  }
  return document.body;
}

function createStickerRecord(config: StickerConfig): StickerRecord {
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
    timer: null,
  };
}

function mountRecord(record: StickerRecord): void {
  const target = findTarget(record.config.target);
  if (record.config.mount === "prepend") {
    target.prepend(record.host);
  } else {
    target.append(record.host);
  }
  startTicker(record);
}

function renderSticker(element: HTMLElement): void {
  if (!originalHtml.has(element)) {
    originalHtml.set(element, element.innerHTML);
  }

  const label = (element.getAttribute("data-ascii-sticker") || "").trim();
  if (!label) {
    return;
  }

  const existing = element.querySelector<HTMLPreElement>(PRE_SELECTOR);
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

function restoreSticker(element: HTMLElement): void {
  const original = originalHtml.get(element);
  if (original === undefined) {
    return;
  }
  element.innerHTML = original;
  element.removeAttribute(RENDERED_ATTR);
}

export function renderAsciiStickers(root: ParentNode = document): void {
  const stickers = queryAll<HTMLElement>("[data-ascii-sticker]", root);
  for (const sticker of stickers) {
    renderSticker(sticker);
  }
}

export function restoreAsciiStickers(root: ParentNode = document): void {
  const stickers = queryAll<HTMLElement>("[data-ascii-sticker]", root);
  for (const sticker of stickers) {
    restoreSticker(sticker);
  }
}

export function addSticker(config: StickerConfig): HTMLElement {
  removeSticker(config.id);
  const record = createStickerRecord(config);
  stickerRegistry.set(config.id, record);
  mountRecord(record);
  return record.host;
}

export function removeSticker(id: string): void {
  const record = stickerRegistry.get(id);
  if (!record) {
    return;
  }
  clearTicker(record);
  record.host.remove();
  stickerRegistry.delete(id);
}

export function updateSticker(id: string, patch: Partial<StickerConfig>): void {
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
