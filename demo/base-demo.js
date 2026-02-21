import { initAsciiTheme } from "../src/index.ts";

initAsciiTheme({
  base: true,
  managedMode: true,
  defaultMode: "light",
  addThemeToggle: true,
  addStyleToggle: false,
  mountSelector: "#base-toggle-mount",
  mountPlacement: "append",
});
