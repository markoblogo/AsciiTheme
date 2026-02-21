export function getRoot(): HTMLElement {
  return document.documentElement;
}

export function queryAll<T extends Element>(
  selector: string,
  root: ParentNode = document,
): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function readDataAttr(
  element: HTMLElement,
  key: string,
): string | undefined {
  return element.dataset[key];
}

export function setDataAttr(
  element: HTMLElement,
  key: string,
  value: string,
): void {
  element.dataset[key] = value;
}

export function getSystemMode(): "light" | "dark" {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getPreferredMode(): "light" | "dark" {
  return getSystemMode();
}
