// packages/web-component/src/index.ts
import {
  getAsciiThemeState,
  setTheme,
  subscribeAsciiTheme,
  toggleAsciiMode,
  toggleAsciiStyle
} from "@abvx/ascii-theme";
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
    this.unsubscribe = subscribeAsciiTheme((state) => {
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
      setTheme(pinnedTheme);
    }
    const initialState = getAsciiThemeState();
    this.lastState = initialState;
    this.render(initialState);
  }
  disconnectedCallback() {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
  attributeChangedCallback() {
    const state = getAsciiThemeState();
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
        toggleAsciiStyle();
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
          setTheme(pinnedTheme);
          return;
        }
        if (state.theme === "light" || state.theme === "dark") {
          toggleAsciiMode();
          return;
        }
        setTheme(nextTheme(String(state.theme)));
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
export {
  AsciiThemeToggleElement,
  defineAsciiThemeToggle
};
