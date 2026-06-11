import { beforeEach, describe, expect, it } from "vitest";

import { initAsciiTheme, setTheme } from "../src/core";
import "../packages/web-component/src/index";

describe("web component", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    initAsciiTheme({ managedMode: true, defaultStyle: "default" });
  });

  it("renders and toggles style", () => {
    const element = document.createElement("ascii-theme-toggle");
    element.setAttribute("controls", "style");
    document.body.append(element);

    const button = element.querySelector("button");
    expect(button?.textContent).toBe("ASCII");
    button?.click();
    expect(document.documentElement.getAttribute("data-style")).toBe("ascii");
  });

  it("emits focused events for style and theme changes", () => {
    const element = document.createElement("ascii-theme-toggle");
    document.body.append(element);

    let styleEvents = 0;
    let themeEvents = 0;

    element.addEventListener("ascii-style-change", () => {
      styleEvents += 1;
    });
    element.addEventListener("ascii-theme-change", () => {
      themeEvents += 1;
    });

    const buttons = element.querySelectorAll("button");
    buttons[0]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(styleEvents).toBe(1);
    expect(themeEvents).toBe(0);

    setTheme("matrix");
    expect(themeEvents).toBe(1);
  });
});
