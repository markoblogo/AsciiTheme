import { beforeEach, describe, expect, it } from "vitest";

import {
  addSticker,
  removeSticker,
  renderAsciiStickers,
  updateSticker,
} from "../src/stickers";

describe("stickers", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders legacy label boxes", () => {
    const host = document.createElement("div");
    host.setAttribute("data-ascii-sticker", "NEW RELEASE");
    document.body.append(host);

    renderAsciiStickers();
    expect(host.textContent).toContain("NEW RELEASE");
  });

  it("supports dynamic progress stickers", () => {
    const host = addSticker({
      id: "progress",
      preset: "progress",
      value: 60,
      max: 100,
    });
    expect(host.textContent).toContain("60%");

    updateSticker("progress", { value: 80 });
    expect(host.textContent).toContain("80%");

    removeSticker("progress");
    expect(document.body.textContent ?? "").not.toContain("80%");
  });
});
