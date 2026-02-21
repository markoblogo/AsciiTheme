export const ROOT = document.documentElement;

export function getRoot(): HTMLElement {
  return ROOT;
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

export function getPreferredMode(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
