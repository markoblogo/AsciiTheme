import { addSticker, initAsciiTheme } from "../src/index.ts";
import "../packages/web-component/src/index.ts";

initAsciiTheme({
  managedMode: true,
  defaultStyle: "default",
  defaultMode: "light",
  defaultTheme: "sepia",
  addThemeToggle: true,
  addStyleToggle: true,
  mountSelector: "#demo-toggle-mount",
  mountPlacement: "append",
  keyboardShortcut: "Alt+T",
});

addSticker({
  id: "demo-live",
  preset: "status-badge",
  status: "LIVE",
  position: "bottom-right",
});
