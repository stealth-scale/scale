import { describe, expect, it } from "vitest";

import { paged } from "#carousel/keys.ts";

function part(orientation: "horizontal" | "vertical", dir: "ltr" | "rtl" = "ltr"): HTMLElement {
  const element = document.createElement("div");

  element.dataset["orientation"] = orientation;
  element.dir = dir;

  return element;
}

describe("paged", () => {
  it.each([
    { key: "ArrowRight", want: { type: "PAGE.NEXT" } },
    { key: "ArrowLeft", want: { type: "PAGE.PREV" } },
    { key: "Home", want: { index: 0, type: "PAGE.SET" } },
    { key: "End", want: { index: 4, type: "PAGE.SET" } },
  ])("returns $want.type for $key in a horizontal carousel", ({ key, want }) => {
    expect(paged(key, part("horizontal"), 4)).toStrictEqual(want);
  });

  it.each([
    { key: "ArrowRight", want: { type: "PAGE.PREV" } },
    { key: "ArrowLeft", want: { type: "PAGE.NEXT" } },
  ])("returns $want.type for $key in a right-to-left carousel", ({ key, want }) => {
    expect(paged(key, part("horizontal", "rtl"), 4)).toStrictEqual(want);
  });

  it.each([
    { key: "ArrowDown", want: { type: "PAGE.NEXT" } },
    { key: "ArrowUp", want: { type: "PAGE.PREV" } },
  ])("returns $want.type for $key in a vertical carousel", ({ key, want }) => {
    expect(paged(key, part("vertical"), 4)).toStrictEqual(want);
  });

  it("returns undefined for a key across a vertical carousel", () => {
    expect(paged("ArrowRight", part("vertical"), 4)).toBeUndefined();
  });

  it("returns undefined for a key that moves no page", () => {
    expect(paged("a", part("horizontal"), 4)).toBeUndefined();
  });
});
