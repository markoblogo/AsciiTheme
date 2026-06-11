import { beforeEach, describe, expect, it } from "vitest";

import {
  getAsciiStyle,
  getTheme,
  initAsciiTheme,
  setAsciiStyle,
  setTheme,
} from "../src/core";

describe("integration smoke", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.innerHTML = "";
    document.documentElement.removeAttribute("data-style");
    document.documentElement.removeAttribute("data-ascii-theme");
    document.documentElement.removeAttribute("data-ascii-mode");
    localStorage.clear();
    initAsciiTheme({
      managedMode: true,
      defaultStyle: "default",
      defaultTheme: "light",
      keyboardShortcut: "Alt+T",
    });
  });

  it("covers the six supported style/theme states", () => {
    const states = [
      { style: "default", theme: "light" },
      { style: "default", theme: "dark" },
      { style: "ascii", theme: "light" },
      { style: "ascii", theme: "dark" },
      { style: "ascii", theme: "sepia" },
      { style: "ascii", theme: "matrix" },
    ] as const;

    for (const state of states) {
      setAsciiStyle(state.style);
      setTheme(state.theme);

      expect(getAsciiStyle()).toBe(state.style);
      expect(getTheme()).toBe(state.theme);
      expect(document.documentElement.getAttribute("data-style")).toBe(state.style);
      expect(document.documentElement.getAttribute("data-ascii-theme")).toBe(state.theme);
      expect(document.documentElement.style.getPropertyValue("--a-bg")).not.toBe("");
      expect(document.documentElement.style.colorScheme).toMatch(/light|dark/);
    }
  });

  it("supports the Alt+T keyboard shortcut", () => {
    expect(getAsciiStyle()).toBe("default");
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "t",
        altKey: true,
      }),
    );
    expect(getAsciiStyle()).toBe("ascii");
  });
});
