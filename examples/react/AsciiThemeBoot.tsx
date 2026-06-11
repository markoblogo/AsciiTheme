"use client";

import { AsciiThemeBoot, useAsciiTheme } from "@abvx/ascii-theme/react";
import "@abvx/ascii-theme/style.css";

export function AppAsciiThemeBoot() {
  return (
    <AsciiThemeBoot
      options={{
        managedMode: true,
        defaultStyle: "default",
        defaultTheme: "sepia",
      }}
    />
  );
}

export function ThemeInspector() {
  const theme = useAsciiTheme();

  return (
    <div>
      <button type="button" onClick={() => theme.toggleStyle()}>
        {theme.style === "ascii" ? "Default" : "ASCII"}
      </button>
      <button type="button" onClick={() => theme.setTheme("matrix")}>
        Matrix
      </button>
      <p>
        {theme.style} / {theme.theme} / {theme.mode}
      </p>
    </div>
  );
}
