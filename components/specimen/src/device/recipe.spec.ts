import { describe, expect, it } from "vitest";

import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#device/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Device"] })).toStrictEqual([]);
  });

  it("names its class device", () => {
    expect(recipe.className).toBe("device");
  });

  it("draws the bar over the stage that holds the frame", () => {
    expect(recipe.slots).toStrictEqual(["root", "bar", "picker", "size", "stage", "frame"]);
  });

  it("offers no axis because a device is one thing", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("wraps the bar where its pickers run out of room and pushes the size to its end", () => {
    expect(recipe.base?.["bar"]).toMatchObject({ display: "flex", flexWrap: "wrap" });
    expect(recipe.base?.["size"]).toStrictEqual({ marginInlineStart: "auto" });
  });

  it("scrolls the stage across rather than shrinking the frame", () => {
    expect(recipe.base?.["stage"]).toMatchObject({ overflowX: "auto" });
    expect(recipe.base?.["frame"]).toMatchObject({ display: "block", flexShrink: "0" });
  });

  it("outlines the frame with a dashed hairline outside its box and leaves it see-through", () => {
    expect(recipe.base?.["frame"]).toMatchObject({
      background: "transparent",
      outlineColor: "border.emphasized",
      outlineStyle: "dashed",
      outlineWidth: "hairline",
    });
    expect(recipe.base?.["frame"]).not.toHaveProperty("borderWidth");
    expect(recipe.base?.["stage"]).toHaveProperty("padding");
  });

  it("sizes the frame from the properties the root writes", () => {
    expect(recipe.base?.["frame"]).toMatchObject({
      blockSize: "var(--device-height)",
      inlineSize: "var(--device-width)",
    });
  });

  it("keeps the bar a small control tall before the pickers arrive", () => {
    expect(recipe.base?.["bar"]).toHaveProperty("minBlockSize");
  });

  it("tracks the device and every part under its namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Device(\.\w+)?$/u]);
  });
});
