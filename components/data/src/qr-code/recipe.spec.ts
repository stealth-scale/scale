import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#qr-code/qr-code.specimen.tsx";
import { recipe } from "#qr-code/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: [
          "QrCode.DownloadTrigger",
          "QrCode.Frame",
          "QrCode.Overlay",
          "QrCode.Pattern",
          "QrCode.Root",
        ],
        parts: ["root", "frame", "pattern", "overlay", "downloadTrigger"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to qr-code", () => {
    expect(recipe.className).toBe("qr-code");
  });

  it("declares three axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["effect", "palette", "size"]);
  });

  it("defaults to md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("declares six grid sizes and full", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["2xl", "full", "lg", "md", "sm", "xl", "xs"]);
  });

  it.each([
    { side: "{sizes.16}", size: "xs" },
    { side: "{sizes.20}", size: "sm" },
    { side: "{sizes.32}", size: "md" },
    { side: "{sizes.40}", size: "lg" },
    { side: "{sizes.48}", size: "xl" },
    { side: "{sizes.64}", size: "2xl" },
  ] as const)("sets the side at $size to $side", ({ side, size }) => {
    expect(recipe.variants?.["size"]?.[size]?.["root"]).toStrictEqual({ "--qr-code-side": side });
  });

  it("fills the container at full", () => {
    expect(recipe.variants?.["size"]?.["full"]?.["root"]).toStrictEqual({
      "--qr-code-side": "{sizes.full}",
      inlineSize: "full",
    });
  });

  it("renders the frame's children in the light scheme", () => {
    expect(recipe.base?.["frame"]).toMatchObject({ "& > *": { colorScheme: "light" } });
  });

  it("keeps the frame's colors under forced colors", () => {
    expect(recipe.base?.["frame"]).toMatchObject({ forcedColorAdjust: "none" });
  });

  it("leaves the frame itself in the page's scheme", () => {
    expect(recipe.base?.["frame"]).not.toHaveProperty("colorScheme");
  });

  it("fills the grounds with bg on screen", () => {
    expect(recipe.base?.["frame"]).toMatchObject({ "& > rect": { fill: "bg" } });
  });

  it("places the frame and the overlay in the first cell of the root's grid", () => {
    expect([recipe.base?.["frame"], recipe.base?.["overlay"]]).toStrictEqual([
      expect.objectContaining({ gridArea: "1 / 1 / 2 / 2" }),
      expect.objectContaining({ gridArea: "1 / 1 / 2 / 2" }),
    ]);
  });

  it("sizes the overlay to a quarter of the code's side", () => {
    expect(recipe.base?.["overlay"]).toMatchObject({ inlineSize: "calc(var(--qr-code-side) / 4)" });
  });

  it("fills the pattern with fg", () => {
    expect(recipe.base?.["pattern"]).toStrictEqual({ fill: "fg" });
  });

  it("fills the pattern and the mark with the palette's solid", () => {
    expect(recipe.variants?.["palette"]?.["info"]).toStrictEqual({
      overlay: { color: "colorPalette.solid" },
      pattern: { fill: "colorPalette.solid" },
      root: { colorPalette: "info" },
    });
  });

  it("emits every palette", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "error"],
    });
  });

  it("matches every QrCode tag", () => {
    expect(recipe.jsx).toStrictEqual([/^QrCode\.\w+$/u]);
  });
});
