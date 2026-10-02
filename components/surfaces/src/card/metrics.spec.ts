import { describe, expect, it } from "vitest";

import { asided, bled, marked, ruled, sectioned, spaced, titled } from "#card/metrics.ts";

describe("metrics", () => {
  it("publishes the density-scaled inset and gap and applies them to the root", () => {
    expect(spaced("md")).toStrictEqual({
      "--card-gap": "calc({spacing.gap.md} * var(--density, 1))",
      "--card-inset": "calc({spacing.inset.md} * var(--density, 1))",
      gap: "var(--card-gap)",
      padding: "var(--card-inset)",
    });
  });

  it.each([
    { size: "sm", textStyle: "label.lg" },
    { size: "md", textStyle: "heading.sm" },
    { size: "xl", textStyle: "heading.lg" },
  ] as const)("sets the title to $textStyle at $size", ({ size, textStyle }) => {
    expect(titled(size)).toStrictEqual({ textStyle });
  });

  it("sizes an image in the indicator as a round 40px avatar at md", () => {
    expect(marked("md")["& img"]).toStrictEqual({
      borderRadius: "full",
      boxSize: "calc({sizes.10} * var(--density, 1))",
      objectFit: "cover",
    });
  });

  it.each([
    { gap: "md", size: "sm" },
    { gap: "lg", size: "md" },
    { gap: "xl", size: "lg" },
    { gap: "xl", size: "xl" },
  ] as const)("spaces the indicator from the title by gap.$gap at $size", ({ gap, size }) => {
    expect(marked(size)).toMatchObject({
      marginInlineEnd: `calc({spacing.gap.${gap}} * var(--density, 1))`,
    });
  });

  it("spaces the aside from the header text by gap.lg at md", () => {
    expect(asided("md")).toStrictEqual({
      marginInlineStart: "calc({spacing.gap.lg} * var(--density, 1))",
    });
  });

  it("sizes an icon in the indicator to the icon size of the card size", () => {
    expect(marked("lg")["& > svg"]).toStrictEqual({
      boxSize: "calc({sizes.icon.lg} * var(--density, 1))",
    });
  });

  it("bleeds a band to the top edge only as the first child", () => {
    expect(bled()).toStrictEqual({
      "&:first-child": { marginBlockStart: "calc(-1 * var(--card-inset))" },
      "&:last-child": { marginBlockEnd: "calc(-1 * var(--card-inset))" },
      marginInline: "calc(-1 * var(--card-inset))",
    });
  });

  it("keeps a section's content at the inset", () => {
    expect(sectioned()).toMatchObject({
      marginInline: "calc(-1 * var(--card-inset))",
      paddingInline: "var(--card-inset)",
    });
  });

  it("renders a full-width hairline with the inset above and below it", () => {
    expect(ruled()).toStrictEqual({
      borderBlockStartWidth: "hairline",
      borderColor: "border",
      borderStyle: "solid",
      marginBlockStart: "calc(var(--card-inset) - var(--card-gap))",
      marginInline: "calc(-1 * var(--card-inset))",
      paddingBlockStart: "var(--card-inset)",
      paddingInline: "var(--card-inset)",
    });
  });

  it("rules a section that is neither the first band nor after the picture", () => {
    expect(sectioned()["&:not(:first-child, .card__media + *)"]).toStrictEqual(ruled());
  });

  it("pads a first section by the inset at the top edge", () => {
    expect(sectioned()["&:first-child"]).toStrictEqual({
      marginBlockStart: "calc(-1 * var(--card-inset))",
      paddingBlockStart: "var(--card-inset)",
    });
  });
});
