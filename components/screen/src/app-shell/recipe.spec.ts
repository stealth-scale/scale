import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#app-shell/app-shell.specimen.tsx";
import { COLUMN, PANEL_RAIL, PANEL_SIZE, RAIL, SCROLLER, SECTION } from "#app-shell/metrics.ts";
import { recipe } from "#app-shell/recipe.ts";

/**
 * Slots of the app shell recipe, in declaration order.
 */
const PARTS = [
  "root",
  "header",
  "body",
  "bodyViewport",
  "row",
  "navbar",
  "main",
  "mainViewport",
  "aside",
  "footer",
  "content",
  "column",
  "section",
  "scroller",
  "trigger",
  "rail",
  "backdrop",
];

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["AppShell"], parts: PARTS })).toStrictEqual([]);
  });

  it("sets className to app-shell", () => {
    expect(recipe.className).toBe("app-shell");
  });

  it("declares seventeen slots", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("fills no region in the plain look", () => {
    expect(recipe.variants?.["variant"]?.["plain"]).toStrictEqual({
      root: { background: "transparent" },
    });
  });

  it("fills a sheet with the panel ground", () => {
    expect(recipe.base?.["navbar"]?.["&[data-overlaid]"]).toMatchObject({
      background: "bg.panel",
    });
  });

  it("raises a sheet with the lg shadow", () => {
    expect(recipe.base?.["aside"]?.["&[data-overlaid]"]).toMatchObject({ boxShadow: "lg" });
  });

  it("styles a section as a padded band", () => {
    expect(recipe.base?.["section"]).toStrictEqual(SECTION);
  });

  it("styles the root of a section that scrolls", () => {
    expect(recipe.base?.["scroller"]).toStrictEqual(SCROLLER);
  });

  it("styles the content of the main region and of a panel as a column", () => {
    expect(recipe.base?.["column"]).toStrictEqual(COLUMN);
  });

  it("lays the panels and the main region out in the body's row", () => {
    expect(recipe.base?.["row"]).toMatchObject({ display: "flex" });
  });

  it("styles the rail as the strip on a panel's edge", () => {
    expect(recipe.base?.["rail"]).toStrictEqual(RAIL);
  });

  it("declares three axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["divided", "scroll", "variant"]);
  });

  it("defaults to a plain divided shell that scrolls its page", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ divided: true, scroll: "page", variant: "plain" });
  });

  it("separates each bar and each panel from the page with a hairline on its inner edge", () => {
    expect(recipe.variants?.["divided"]?.["true"]).toStrictEqual({
      aside: { borderColor: "border", borderInlineStartWidth: "hairline" },
      footer: { borderBlockStartWidth: "hairline", borderColor: "border" },
      header: { borderBlockEndWidth: "hairline", borderColor: "border" },
      navbar: { borderColor: "border", borderInlineEndWidth: "hairline" },
    });
  });

  it("opens each panel to the theme's layout size", () => {
    expect(recipe.base?.["navbar"]).toMatchObject({ [PANEL_SIZE]: "sizes.sidebar" });
    expect(recipe.base?.["aside"]).toMatchObject({ [PANEL_SIZE]: "sizes.aside" });
  });

  it("fills a pinned bar with the panel surface", () => {
    expect(recipe.base?.["header"]?.["&[data-sticky]"]).toMatchObject({
      background: "bg.panel",
      position: "sticky",
    });
    expect(recipe.base?.["footer"]?.["&[data-sticky]"]).toMatchObject({ background: "bg.panel" });
  });

  it("declares three looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["floating", "inset", "plain"]);
  });

  it("sizes a shell that scrolls its page to the window height", () => {
    expect(recipe.variants?.["scroll"]?.["page"]?.["root"]).toStrictEqual({
      blockSize: "var(--app-shell-window-height, 100dvh)",
    });
  });

  it("sizes a panel over the page to the window height", () => {
    expect(recipe.base?.["navbar"]?.["&[data-overlaid]"]).toMatchObject({
      blockSize: "var(--app-shell-window-height, 100dvh)",
    });
  });

  it("sizes a stuck panel to the window height under the pinned bars", () => {
    expect(
      recipe.variants?.["scroll"]?.["window"]?.["navbar"]?.[
        "&:not([data-overlaid], [data-stacked])"
      ],
    ).toMatchObject({
      blockSize: "calc(var(--app-shell-window-height, 100dvh) - var(--app-shell-sticky-top, 0px))",
      position: "sticky",
    });
  });

  it("sticks no panel that is over the page or under it", () => {
    expect(recipe.variants?.["scroll"]?.["window"]?.["aside"]).not.toHaveProperty("position");
  });

  it("scrolls the body's viewport while a panel is under the page", () => {
    expect(recipe.variants?.["scroll"]?.["page"]?.["bodyViewport"]).toStrictEqual({
      "&:has(> .app-shell__row > [data-stacked])": { overflow: "auto" },
      overflow: "visible",
    });
  });

  it("sets the row to the body's height while the main region scrolls", () => {
    expect(recipe.variants?.["scroll"]?.["page"]?.["row"]).toStrictEqual({
      "&:has(> [data-stacked])": { blockSize: "auto" },
      blockSize: "100%",
    });
  });

  it("stops the main region scrolling while a panel is under the page", () => {
    expect(recipe.variants?.["scroll"]?.["page"]?.["mainViewport"]).toStrictEqual({
      ".app-shell__row:has(> [data-stacked]) > .app-shell__main > &": { overflow: "visible" },
    });
  });

  it("scrolls neither viewport while the window scrolls", () => {
    expect([
      recipe.variants?.["scroll"]?.["window"]?.["bodyViewport"],
      recipe.variants?.["scroll"]?.["window"]?.["mainViewport"],
    ]).toStrictEqual([{ overflow: "visible" }, { overflow: "visible" }]);
  });

  it("pads each bar by the middle gap", () => {
    expect(recipe.base?.["header"]).toMatchObject({
      padding: "calc({spacing.gap.md} * var(--density, 1))",
    });
    expect(recipe.base?.["footer"]).toMatchObject({
      padding: "calc({spacing.gap.md} * var(--density, 1))",
    });
  });

  it("pads a pinned footer by the middle gap and the safe area", () => {
    expect(recipe.base?.["footer"]?.["&[data-sticky]"]).toMatchObject({
      paddingBlockEnd: "calc(calc({spacing.gap.md} * var(--density, 1)) + {spacing.safe.bottom})",
    });
  });

  it("stacks a panel over the page above the backdrop", () => {
    expect(recipe.base?.["navbar"]?.["&[data-overlaid]"]).toMatchObject({ zIndex: "modal" });
    expect(recipe.base?.["backdrop"]).toMatchObject({ zIndex: "overlay" });
  });

  it("disables pointer events on a closed backdrop", () => {
    expect(recipe.base?.["backdrop"]).toMatchObject({ opacity: "0", pointerEvents: "none" });
    expect(recipe.base?.["backdrop"]?.["&[data-state=open]"]).toStrictEqual({
      opacity: "1",
      pointerEvents: "auto",
    });
  });

  it("pads a panel over the page by the safe area", () => {
    expect(recipe.base?.["aside"]?.["&[data-overlaid]"]).toMatchObject({
      paddingBlockEnd: "safe.bottom",
      paddingBlockStart: "safe.top",
    });
  });

  it("shows an opening sheet at once", () => {
    expect(recipe.base?.["navbar"]?.["&[data-overlaid]"]).toMatchObject({
      transitionDelay: "0s",
      transitionDuration: "{durations.move}, 0s",
      transitionProperty: "translate, visibility",
    });
  });

  it("keeps a closed sheet at its open width", () => {
    const sheet = "min(var(--app-shell-panel-size), calc(100% - {sizes.rail}))";

    expect(recipe.base?.["navbar"]?.["&[data-overlaid]"]).toMatchObject({ inlineSize: sheet });
    expect(recipe.base?.["navbar"]?.["&[data-overlaid]"]?.["&[data-state=closed]"]).toMatchObject({
      inlineSize: sheet,
    });
  });

  it("hides a closing sheet after its slide", () => {
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

  it("closes a panel to the rail width its collapse sets", () => {
    expect(recipe.base?.["navbar"]?.["&[data-collapse=icons]"]).toStrictEqual({
      [PANEL_RAIL]: "sizes.rail",
    });
    expect(recipe.base?.["navbar"]?.["&[data-state=closed]"]).toStrictEqual({
      inlineSize: `var(${PANEL_RAIL})`,
    });
  });

  it("keeps a panel's content at the open width", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      flexShrink: "0",
      inlineSize: `var(${PANEL_SIZE})`,
    });
  });

  it("removes the transitions under reduced motion", () => {
    expect(recipe.base?.["backdrop"]?.["_motionReduce"]).toStrictEqual({
      transitionDuration: "0s",
    });
    expect(recipe.base?.["navbar"]?.["_motionReduce"]).toStrictEqual({ transitionDuration: "0s" });
  });

  it("removes the transitions before the root has settled", () => {
    const unsettled = ".app-shell__root:not([data-settled]) &";

    expect(recipe.base?.["navbar"]?.[unsettled]).toStrictEqual({ transitionDuration: "0s" });
    expect(recipe.base?.["aside"]?.[unsettled]).toStrictEqual({ transitionDuration: "0s" });
    expect(recipe.base?.["backdrop"]?.[unsettled]).toStrictEqual({ transitionDuration: "0s" });
  });

  it("gives the main region its own row beside a panel under the page", () => {
    expect(recipe.base?.["row"]?.["&:has(> [data-stacked]) > .app-shell__main"]).toStrictEqual({
      flexBasis: "100%",
    });
  });

  it("selects another part by its class and never by a part attribute", () => {
    expect(JSON.stringify(recipe)).not.toContain("data-part");
  });

  it("matches every AppShell tag", () => {
    expect(recipe.jsx).toStrictEqual([/^AppShell(\.\w+)?$/u]);
  });
});
