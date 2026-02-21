import { initAsciiTheme } from "../src/index.ts";

initAsciiTheme({
  managedMode: true,
  defaultStyle: "default",
  defaultMode: "light",
  addThemeToggle: true,
  addStyleToggle: true,
  mountSelector: "#demo-toggle-mount",
  mountPlacement: "append",
});
