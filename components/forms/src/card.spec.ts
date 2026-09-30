import { describe, expect, it } from "vitest";

import {
  addon,
  addonSizes,
  aligned,
  card,
  content,
  contentSizes,
  description,
  descriptionSizes,
  forcedEdge,
  laidOut,
  onSolid,
  outlineCard,
  SIZES,
  solidCard,
  subtleCard,
  surfaceCard,
  title,
  titleSizes,
} from "#card.ts";

describe("card", () => {
  it("offers the sizes sm md lg", () => {
    expect(SIZES).toStrictEqual(["sm", "md", "lg"]);
  });

  it("renders the focus ring outside the card", () => {
    expect(card()).toMatchObject({ focusVisibleRing: "outside" });
  });

  it("fills a disabled card with bg.subtle", () => {
    expect(card()).toMatchObject({ _disabled: { background: "bg.subtle" } });
  });

  it("keeps the rows of the content to their content", () => {
    expect(content()).toMatchObject({ alignContent: "start", display: "grid" });
  });

  it("sets the title at the medium weight in the first column", () => {
    expect(title()).toMatchObject({ fontWeight: "medium", gridColumn: "1" });
  });

  it("sets the description in the muted ink", () => {
    expect(description()).toMatchObject({ color: "fg.muted" });
  });

  it("draws a hairline over the addon in the card's edge color", () => {
    expect(addon()).toMatchObject({ borderBlockStartWidth: "hairline", borderColor: "inherit" });
  });

  it("sets the md addon in the sm body role", () => {
    expect(addonSizes().md).toMatchObject({ textStyle: "body.sm" });
  });

  it("pads the md content by the md inset", () => {
    expect(contentSizes().md).toMatchObject({
      padding: "calc({spacing.inset.md} * var(--density, 1))",
    });
  });

  it("sets the md description in the sm body role", () => {
    expect(descriptionSizes().md).toStrictEqual({ textStyle: "body.sm" });
  });

  it("sets the md title in the md label role", () => {
    expect(titleSizes().md).toStrictEqual({ textStyle: "label.md" });
  });

  it("centres the words and the mark when aligned to the center", () => {
    expect(aligned("center")).toStrictEqual({ justifyItems: "center", textAlign: "center" });
  });

  it("puts the mark in the second column of an inline card", () => {
    expect(laidOut("inline").mark).toStrictEqual({ gridColumn: "2", gridRow: "1 / span 2" });
  });

  it("puts the mark in the first row of a stacked card", () => {
    expect(laidOut("stacked").mark).toStrictEqual({ gridColumn: "1", gridRow: "1" });
  });

  it("fills a checked solid card with the palette's solid", () => {
    expect(solidCard()).toMatchObject({ _checked: { background: "colorPalette.solid" } });
  });

  it("gives the words on a checked solid card the card's ink", () => {
    expect(onSolid()).toStrictEqual({ _checked: { color: "inherit" } });
  });

  it.each([
    ["solid", solidCard],
    ["subtle", subtleCard],
    ["surface", surfaceCard],
    ["outline", outlineCard],
  ])("restates the invalid edge after the checked edge on the %s look", (_look, look) => {
    expect(Object.keys(look()).filter((key) => key.startsWith("_"))).toStrictEqual([
      "_checked",
      "_invalid",
    ]);
  });

  it("tints a checked surface card with the palette's subtle fill", () => {
    expect(surfaceCard()).toMatchObject({ _checked: { background: "colorPalette.subtle" } });
  });

  it("draws the edge of a checked outline card in the palette's solid", () => {
    expect(outlineCard()).toMatchObject({ _checked: { borderColor: "colorPalette.solid" } });
  });

  it("sets a checked card's edge to Highlight under forced colors", () => {
    expect(forcedEdge()).toStrictEqual({
      _highContrast: { _checked: { borderColor: "Highlight" } },
    });
  });
});
