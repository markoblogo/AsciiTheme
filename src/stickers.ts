import { queryAll } from "./dom";

const ORIGINAL_HTML_ATTR = "asciiOriginalHtml";
const RENDERED_ATTR = "data-ascii-sticker-rendered";
const PRE_SELECTOR = "pre.ascii-sticker";

function makeBox(text: string, paddingX = 2): string {
  const label = text.replace(/\s+/g, " ").trim();
  const inner = `${" ".repeat(paddingX)}${label}${" ".repeat(paddingX)}`;
  const top = `┌${"─".repeat(inner.length)}┐`;
  const mid = `│${inner}│`;
  const bot = `└${"─".repeat(inner.length)}┘`;
  return `${top}\n${mid}\n${bot}`;
}

function renderSticker(element: HTMLElement): void {
  if (!element.dataset[ORIGINAL_HTML_ATTR]) {
    element.dataset[ORIGINAL_HTML_ATTR] = element.innerHTML;
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
  pre.className = "ascii-sticker";
  pre.textContent = makeBox(label);

  if (element.matches("button, a, [role='button']")) {
    element.setAttribute("aria-label", label);
  }

  element.appendChild(pre);
  element.setAttribute(RENDERED_ATTR, "1");
}

function restoreSticker(element: HTMLElement): void {
  const original = element.dataset[ORIGINAL_HTML_ATTR];
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
