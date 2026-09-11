import { beforeEach, describe, expect, it } from "vitest";

import {
  getAsciiMode,
  getAsciiStyle,
  getTheme,
  initAsciiTheme,
  registerTheme,
  setAsciiStyle,
  setTheme,
  toggleAsciiMode,
} from "../src/core";

describe("core theme registry", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = "";
    document.documentElement.removeAttribute("data-style");
    document.documentElement.removeAttribute("data-ascii-theme");
    document.documentElement.removeAttribute("data-ascii-mode");
    localStorage.clear();
  });

  it("keeps legacy mode api working", () => {
    initAsciiTheme({ managedMode: true, defaultStyle: "ascii" });
    expect(getAsciiStyle()).toBe("ascii");
    expect(getTheme()).toBe("light");

    toggleAsciiMode();
    expect(getAsciiMode()).toBe("dark");
    expect(getTheme()).toBe("dark");
  });

  it("supports sepia and custom themes", () => {
    initAsciiTheme({ managedMode: true, defaultStyle: "ascii", defaultTheme: "sepia" });
    expect(document.documentElement.getAttribute("data-ascii-theme")).toBe("sepia");

    registerTheme("solarized", {
      ascii: {
        bg: "#002b36",
        fg: "#93a1a1",
        muted: "#839496",
      },
      colorScheme: "dark",
    });

    setTheme("solarized");
    expect(getTheme()).toBe("solarized");
    expect(localStorage.getItem("ascii_theme_v1")).toContain("solarized");
  });

  it("restores a saved style on initialization", () => {
    initAsciiTheme({ defaultStyle: "default" });
    setAsciiStyle("ascii");

    initAsciiTheme({ defaultStyle: "default" });

    expect(getAsciiStyle()).toBe("ascii");
  });

  it("removes injected controls when a later initialization disables them", () => {
    document.body.innerHTML = '<div id="controls"></div>';
    initAsciiTheme({ addStyleToggle: true, mountSelector: "#controls" });
    expect(document.querySelector("[data-ascii-controls]")).not.toBeNull();

    initAsciiTheme();

    expect(document.querySelector("[data-ascii-controls]")).toBeNull();
  });
});
