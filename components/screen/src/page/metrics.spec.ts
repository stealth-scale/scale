import { describe, expect, it } from "vitest";

import { CLASS, COMMAND, FLAT_PALETTE, tabbed, TABS, TABS_IN_NAV, TITLES } from "#page/metrics.ts";
import { recipe } from "#page/recipe.ts";

describe("metrics", () => {
  it("names the page recipe's class", () => {
    expect(CLASS).toBe(recipe.className);
  });

  it("names the tabs and the command palette by their recipes' classes", () => {
    expect([TABS, COMMAND]).toStrictEqual(["tabs", "command"]);
  });

  it("selects the tabs' root as a child of the navigation band", () => {
    expect(TABS_IN_NAV).toBe("& > .tabs__root");
  });

  it("makes a medium page's tabs 48px tall and inset by the md inset", () => {
    expect(tabbed("md")).toStrictEqual({
      "& .tabs__trigger": {
        "--control-inset-end": "calc({spacing.inset.md} * var(--density, 1))",
        "--control-inset-start": "calc({spacing.inset.md} * var(--density, 1))",
        height: "calc({sizes.control.xl} * var(--density, 1))",
      },
      "& > .tabs__root": {
        marginInlineStart: "calc(calc({spacing.inset.md} * var(--density, 1)) * -1)",
      },
    });
  });

  it("makes a small page's tabs 44px tall and inset by the sm inset", () => {
    expect(tabbed("sm")).toMatchObject({
      "& .tabs__trigger": {
        "--control-inset-start": "calc({spacing.inset.sm} * var(--density, 1))",
        height: "calc({sizes.control.lg} * var(--density, 1))",
      },
    });
  });

  it("drops the popover's padding while the machine sets data-state", () => {
    expect(FLAT_PALETTE["&[data-state]"]).toStrictEqual({ padding: "0" });
  });

  it("drops the command palette's edge corners and shadow inside the panel", () => {
    expect(FLAT_PALETTE["& > .command__root"]).toStrictEqual({
      borderRadius: "0",
      borderWidth: "0",
      boxShadow: "none",
      maxBlockSize: "inherit",
    });
  });

  it("sets a medium title one role smaller on a narrow page", () => {
    expect(TITLES.md).toStrictEqual({
      ".page__root[data-narrow] > .page__header > &": { textStyle: "heading.md" },
      textStyle: "heading.lg",
    });
  });
});
