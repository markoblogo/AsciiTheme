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

// packages/web-component/src/index.ts
var index_exports = {};
__export(index_exports, {
  AsciiThemeToggleElement: () => AsciiThemeToggleElement,
  defineAsciiThemeToggle: () => defineAsciiThemeToggle
});
module.exports = __toCommonJS(index_exports);
var import_ascii_theme = require("@abvx/ascii-theme");
var CYCLE = ["light", "dark", "sepia", "matrix"];
var HTMLElementBase = typeof HTMLElement === "undefined" ? class {
} : HTMLElement;
function nextTheme(current) {
  const index = CYCLE.indexOf(current);
  if (index === -1) {
    return "light";
  }
  return CYCLE[(index + 1) % CYCLE.length];
}
var AsciiThemeToggleElement = class extends HTMLElementBase {
  constructor() {
    super(...arguments);
    this.unsubscribe = null;
    this.lastState = null;
  }
  static get observedAttributes() {
    return ["controls", "theme"];
  }
  connectedCallback() {
    if (this.getAttribute("mount") && this.getAttribute("mount") !== "self") {
      this.setAttribute("mount", "self");
    }
    this.unsubscribe = (0, import_ascii_theme.subscribeAsciiTheme)((state) => {
      this.render(state);
      if (this.lastState && this.lastState.theme !== state.theme) {
        this.dispatchEvent(new CustomEvent("ascii-theme-change", { detail: state }));
      }
      if (this.lastState && this.lastState.style !== state.style) {
        this.dispatchEvent(new CustomEvent("ascii-style-change", { detail: state }));
      }
      this.lastState = state;
    });
    const pinnedTheme = this.getAttribute("theme");
    if (pinnedTheme) {
      (0, import_ascii_theme.setTheme)(pinnedTheme);
    }
    const initialState = (0, import_ascii_theme.getAsciiThemeState)();
    this.lastState = initialState;
    this.render(initialState);
  }
  disconnectedCallback() {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
  attributeChangedCallback() {
    const state = (0, import_ascii_theme.getAsciiThemeState)();
    this.lastState = state;
    this.render(state);
  }
  render(state) {
    const controls = this.getAttribute("controls") ?? "both";
    this.innerHTML = "";
    const group = document.createElement("div");
    group.className = "ascii-theme-toggle-group";
    if (controls === "both" || controls === "style") {
      const styleButton = document.createElement("button");
      styleButton.type = "button";
      styleButton.className = "ascii-theme-toggle-btn";
      styleButton.textContent = state.style === "ascii" ? "Default" : "ASCII";
      styleButton.addEventListener("click", () => {
        (0, import_ascii_theme.toggleAsciiStyle)();
      });
      group.append(styleButton);
    }
    if (controls === "both" || controls === "theme") {
      const themeButton = document.createElement("button");
      themeButton.type = "button";
      themeButton.className = "ascii-theme-toggle-btn";
      const pinnedTheme = this.getAttribute("theme");
      themeButton.textContent = pinnedTheme ? `Theme: ${pinnedTheme}` : `Theme: ${state.theme}`;
      themeButton.addEventListener("click", () => {
        if (pinnedTheme) {
          (0, import_ascii_theme.setTheme)(pinnedTheme);
          return;
        }
        if (state.theme === "light" || state.theme === "dark") {
          (0, import_ascii_theme.toggleAsciiMode)();
          return;
        }
        (0, import_ascii_theme.setTheme)(nextTheme(String(state.theme)));
      });
      group.append(themeButton);
    }
    this.append(group);
  }
};
function defineAsciiThemeToggle() {
  if (typeof window === "undefined" || customElements.get("ascii-theme-toggle")) {
    return;
  }
  customElements.define("ascii-theme-toggle", AsciiThemeToggleElement);
}
defineAsciiThemeToggle();
