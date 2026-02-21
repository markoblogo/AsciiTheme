import {
  getAsciiStyle,
  initAsciiTheme,
  setAsciiStyle,
  setAsciiMode,
  toggleAsciiMode,
} from "../src/index.ts";

initAsciiTheme({
  managedMode: true,
  defaultStyle: "default",
  defaultMode: "light",
});

const styleBtn = document.getElementById("style-toggle");
const modeBtn = document.getElementById("mode-toggle");
const root = document.documentElement;

const syncStyleButton = () => {
  if (!styleBtn) return;
  styleBtn.textContent = getAsciiStyle() === "ascii" ? "Default" : "ASCII";
};

const syncModeButton = () => {
  if (!modeBtn) return;
  const mode = root.getAttribute("data-ascii-mode") || "light";
  modeBtn.textContent = `Mode: ${mode}`;
};

syncStyleButton();
syncModeButton();

styleBtn?.addEventListener("click", () => {
  const next = getAsciiStyle() === "ascii" ? "default" : "ascii";
  setAsciiStyle(next);
  syncStyleButton();
});

modeBtn?.addEventListener("click", () => {
  const next = toggleAsciiMode();
  setAsciiMode(next);
  syncModeButton();
});
