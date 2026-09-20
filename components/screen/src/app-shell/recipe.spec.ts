import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { PANEL_RAIL, PANEL_SIZE, recipe, STICKY_OFFSET, STICKY_TOP } from "#app-shell/recipe.ts";

/**
 * The parts a shell draws, which the check is handed to read the slots by.
 */
const PARTS = [
  "root",
  "header",
  "body",
  "navbar",
  "main",
  "aside",
  "footer",
  "content",
  "trigger",
  "backdrop",
];

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["AppShell"], parts: PARTS })).toStrictEqual([]);
  });

  it("names its class app-shell", () => {
    expect(recipe.className).toBe("app-shell");
  });

  it("styles the ten parts a shell draws", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("offers the three axes a shell takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["divided", "scroll", "variant"]);
  });

  it("scrolls a plain divided page when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ divided: true, scroll: "page", variant: "plain" });
  });

  it("parts each bar and each panel from the page with one hairline on its inner edge", () => {
    expect(recipe.variants?.["divided"]?.["true"]).toStrictEqual({
      aside: { borderColor: "border", borderInlineStartWidth: "hairline" },
      footer: { borderBlockStartWidth: "hairline", borderColor: "border" },
      header: { borderBlockEndWidth: "hairline", borderColor: "border" },
      navbar: { borderColor: "border", borderInlineEndWidth: "hairline" },
    });
  });

  it("opens each panel to the theme's layout size for it", () => {
    expect(recipe.base?.["navbar"]).toMatchObject({ [PANEL_SIZE]: "sizes.sidebar" });
    expect(recipe.base?.["aside"]).toMatchObject({ [PANEL_SIZE]: "sizes.aside" });
  });

  it("fills a bar that pins to the window with the panel surface", () => {
    expect(recipe.base?.["header"]?.["&[data-sticky]"]).toMatchObject({
      background: "bg.panel",
      position: "sticky",
    });
    expect(recipe.base?.["footer"]?.["&[data-sticky]"]).toMatchObject({ background: "bg.panel" });
  });

  it("offers the three ways the page and the panels are set against the ground", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["floating", "inset", "plain"]);
  });

  it("names the properties a panel and a pinned bar are measured by", () => {
    expect([PANEL_RAIL, PANEL_SIZE, STICKY_OFFSET, STICKY_TOP]).toStrictEqual([
      "--app-shell-panel-rail",
      "--app-shell-panel-size",
      "--app-shell-sticky-offset",
      "--app-shell-sticky-top",
    ]);
  });

  it("gives a panel over the page the rung above the backdrop", () => {
    expect(recipe.base?.["navbar"]?.["&[data-overlaid]"]).toMatchObject({ zIndex: "modal" });
    expect(recipe.base?.["backdrop"]).toMatchObject({ zIndex: "overlay" });
  });

  it("takes no press through a backdrop that is not over anything", () => {
    expect(recipe.base?.["backdrop"]).toMatchObject({ opacity: "0", pointerEvents: "none" });
    expect(recipe.base?.["backdrop"]?.["&[data-state=open]"]).toStrictEqual({
      opacity: "1",
      pointerEvents: "auto",
    });
  });

  it("clears the notch and the home bar on a panel over the page", () => {
    expect(recipe.base?.["aside"]?.["&[data-overlaid]"]).toMatchObject({
      paddingBlockEnd: "safe.bottom",
      paddingBlockStart: "safe.top",
    });
  });

  it("brings a sheet into sight the moment it opens", () => {
    expect(recipe.base?.["navbar"]?.["&[data-overlaid]"]).toMatchObject({
      transitionDelay: "0s",
      transitionDuration: "{durations.move}, 0s",
      transitionProperty: "translate, visibility",
    });
  });

  it("takes a sheet out of sight once its slide has ended", () => {
    expect(recipe.base?.["navbar"]?.["&[data-overlaid]"]?.["&[data-state=closed]"]).toMatchObject({
      transitionDelay: "0s, {durations.moderate}",
    });
    expect(recipe.base?.["aside"]?.["&[data-overlaid]"]?.["&[data-state=closed]"]).toMatchObject({
      transitionDelay: "0s, {durations.moderate}",
    });
    expect(recipe.base?.["aside"]?.["&[data-overlaid]"]?.["_motionReduce"]).toStrictEqual({
      transitionDelay: "0s",
    });
  });

  it("closes a panel to the rail its collapse states", () => {
    expect(recipe.base?.["navbar"]?.["&[data-collapse=icons]"]).toStrictEqual({
      [PANEL_RAIL]: "sizes.rail",
    });
    expect(recipe.base?.["navbar"]?.["&[data-state=closed]"]).toStrictEqual({
      inlineSize: `var(${PANEL_RAIL})`,
    });
  });

  it("keeps what a panel holds at the width it opens to", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      flexShrink: "0",
      inlineSize: `var(${PANEL_SIZE})`,
    });
  });

  it("states no motion for a reader who asked for none", () => {
    expect(recipe.base?.["backdrop"]?.["_motionReduce"]).toStrictEqual({
      transitionDuration: "0s",
    });
    expect(recipe.base?.["navbar"]?.["_motionReduce"]).toStrictEqual({ transitionDuration: "0s" });
  });

  it("moves nothing before the root has settled", () => {
    const unsettled = ".app-shell__root:not([data-settled]) &";

    expect(recipe.base?.["navbar"]?.[unsettled]).toStrictEqual({ transitionDuration: "0s" });
    expect(recipe.base?.["aside"]?.[unsettled]).toStrictEqual({ transitionDuration: "0s" });
    expect(recipe.base?.["backdrop"]?.[unsettled]).toStrictEqual({ transitionDuration: "0s" });
  });

  it("gives the page a row of its own beside a panel that has dropped under it", () => {
    expect(recipe.base?.["body"]?.["&:has(> [data-stacked]) > .app-shell__main"]).toStrictEqual({
      flexBasis: "100%",
    });
  });

  it("reaches another part by the class its binding writes rather than by a part attribute", () => {
    expect(JSON.stringify(recipe)).not.toContain("data-part");
  });

  it("tracks every tag under the AppShell namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^AppShell(\.\w+)?$/u]);
  });
});
