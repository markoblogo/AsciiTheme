import { effectScope } from "vue";
import { beforeEach, describe, expect, it } from "vitest";

import { initAsciiTheme, setTheme } from "../src/core";
import { useAsciiTheme } from "../packages/vue/src/index";

describe("vue wrapper", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    initAsciiTheme({ managedMode: true, defaultStyle: "ascii" });
  });

  it("reflects theme updates", () => {
    const scope = effectScope();
    let current = "";
    scope.run(() => {
      const theme = useAsciiTheme();
      current = String(theme.theme.value);
    });

    expect(current).toBe("light");
    setTheme("matrix");
    scope.run(() => {
      const theme = useAsciiTheme();
      current = String(theme.theme.value);
    });
    expect(current).toBe("matrix");
    scope.stop();
  });
});
