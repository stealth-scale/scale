import { describe, expect, it } from "vitest";

import { dense } from "@stealthscale/theme/authoring";

import {
  aligned,
  barred,
  BARRED,
  CLASS,
  LEADING,
  linked,
  placed,
  REPLACED,
  SIZES,
  triggered,
  UNANCHORED,
  UPRIGHT,
  VIEWED,
} from "#navigation-menu/metrics.ts";

describe("metrics", () => {
  it("names the recipe's class navigation-menu", () => {
    expect(CLASS).toBe("navigation-menu");
  });

  it("lists the sizes in reading order", () => {
    expect(SIZES).toStrictEqual(["sm", "md", "lg"]);
  });

  it.each([
    { name: "BARRED", selector: BARRED, want: ".navigation-menu__item > &" },
    { name: "VIEWED", selector: VIEWED, want: ".navigation-menu__viewport > &" },
    { name: "UPRIGHT", selector: UPRIGHT, want: "[data-orientation=vertical] > &" },
    {
      name: "UNANCHORED",
      selector: UNANCHORED,
      want: ".navigation-menu__list:has(> .navigation-menu__indicator) > &",
    },
    {
      name: "REPLACED",
      selector: REPLACED,
      want: ".navigation-menu__list:has(> .navigation-menu__indicator):has(> .navigation-menu__item[data-state=open]) &",
    },
  ])("writes $want as $name", ({ selector, want }) => {
    expect(selector).toBe(want);
  });

  it("sets the bar's muted ink on a row of the bar", () => {
    expect(barred()).toMatchObject({
      color: "fg.muted",
      display: "inline-flex",
      flexDirection: "row",
    });
  });

  it("leaves out the leading icon's inset from a trigger", () => {
    expect(Object.keys(triggered("md"))).not.toContain(LEADING);
  });

  it("sets one step less end inset before a trigger's trailing icon", () => {
    expect(triggered("md")).toMatchObject({
      "&:has(> svg:last-child)": { paddingInlineEnd: dense("{spacing.inset.sm}") },
    });
  });

  it("sizes a trigger's icon one step smaller on the icon scale", () => {
    expect(triggered("lg")).toMatchObject({ "& > svg": { boxSize: dense("{sizes.icon.md}") } });
  });

  it("places a panel one gap under its item", () => {
    expect(placed("md")).toMatchObject({
      insetBlockStart: `calc(100% + ${dense("{spacing.gap.md}")})`,
    });
  });

  it("places a panel one gap beside its item in a vertical menu", () => {
    expect(placed("md")).toMatchObject({
      _vertical: {
        insetBlockStart: "0",
        insetInlineStart: `calc(100% + ${dense("{spacing.gap.md}")})`,
      },
    });
  });

  it("places a panel of a horizontal list with an indicator at its trigger's measured x", () => {
    expect(
      placed("sm")[
        ".navigation-menu__list[data-orientation=horizontal]:has(> .navigation-menu__indicator) &"
      ],
    ).toStrictEqual({ left: "var(--trigger-x, 0px)", right: "auto" });
  });

  it("places a panel of a list with an indicator one gap under its trigger's measured place", () => {
    expect(
      placed("sm")[".navigation-menu__list:has(> .navigation-menu__indicator) &"],
    ).toMatchObject({
      insetBlockStart: `calc(var(--trigger-y, 0px) + var(--trigger-height, 0px) + ${dense("{spacing.gap.sm}")})`,
    });
  });

  it("sizes a panel link's icon on the icon scale", () => {
    expect(linked("md")).toMatchObject({ "& > svg": { boxSize: dense("{sizes.icon.md}") } });
  });

  it("sizes a link in the bar as a trigger with no block padding", () => {
    expect(linked("md")[BARRED]).toStrictEqual({ ...triggered("md"), paddingBlock: "0" });
  });

  it.each([
    { align: "center", back: "calc({borderWidths.hairline} * -1)" },
    { align: "end", back: "calc({borderWidths.hairline} * -2)" },
  ])("moves a viewport aligned $align back by $back", ({ align, back }) => {
    expect(aligned()[`&[data-align=${align}]`]).toStrictEqual({
      _vertical: { marginLeft: "0", marginTop: back },
      marginLeft: back,
    });
  });
});
