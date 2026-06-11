import { act } from "react";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it } from "vitest";

import { initAsciiTheme } from "../src/core";
import { useAsciiTheme } from "../packages/react/src/index";

describe("react wrapper", () => {
  beforeEach(() => {
    // React 19 expects an explicit act-enabled test environment.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
    document.body.innerHTML = '<div id="app"></div>';
    initAsciiTheme({ managedMode: true, defaultStyle: "default" });
  });

  it("stays in sync with core state", () => {
    const container = document.getElementById("app")!;
    const root = createRoot(container);
    const snapshots: string[] = [];

    function Probe() {
      const theme = useAsciiTheme();
      snapshots.push(`${theme.style}:${theme.theme}`);
      return null;
    }

    act(() => {
      root.render(<Probe />);
    });

    expect(snapshots.at(-1)).toBe("default:light");
  });
});
