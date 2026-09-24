import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#app-shell/app-shell.specimen.tsx";
import { PANEL_RAIL, PANEL_SIZE, recipe, STICKY_OFFSET, STICKY_TOP } from "#app-shell/recipe.ts";

/**
 * Slots of the app shell recipe, in declaration order.
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

  it("declares ten slots", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
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

  it("exports the custom property names of the panels and the pinned bars", () => {
    expect([PANEL_RAIL, PANEL_SIZE, STICKY_OFFSET, STICKY_TOP]).toStrictEqual([
      "--app-shell-panel-rail",
      "--app-shell-panel-size",
      "--app-shell-sticky-offset",
      "--app-shell-sticky-top",
    ]);
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
    expect(recipe.base?.["body"]?.["&:has(> [data-stacked]) > .app-shell__main"]).toStrictEqual({
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
