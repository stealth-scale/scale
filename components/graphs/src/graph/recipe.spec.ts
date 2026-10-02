import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import { DISC, DISC_HUB, DISC_LABEL, DISC_NODE } from "#graph/disc.ts";
import { FLOW } from "#graph/flow.ts";
import page from "#graph/graph.specimen.tsx";
import { recipe } from "#graph/recipe.ts";

/**
 * Returns the base styles of a slot.
 */
function base(slot: string): unknown {
  return (recipe.base as Readonly<Record<string, unknown>> | undefined)?.[slot];
}

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Graph"] })).toStrictEqual([]);
  });

  it("sets className to graph", () => {
    expect(recipe.className).toBe("graph");
  });

  it("declares twenty-five slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "canvas",
      "controls",
      "level",
      "caption",
      "node",
      "nodeHeader",
      "nodeIcon",
      "nodeText",
      "nodeTitle",
      "nodeSubtitle",
      "nodeActions",
      "nodeBody",
      "nodeProblem",
      "nodeTag",
      "nodeBranch",
      "discNode",
      "disc",
      "discHub",
      "discLabel",
      "portName",
      "remove",
      "overview",
      "summary",
      "empty",
    ]);
  });

  it.each([
    { slot: "discNode", want: DISC_NODE },
    { slot: "disc", want: DISC },
    { slot: "discHub", want: DISC_HUB },
    { slot: "discLabel", want: DISC_LABEL },
  ])("styles the $slot slot with the disc's rules", ({ slot, want }) => {
    expect(base(slot)).toStrictEqual(want);
  });

  it("declares the ratio axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["ratio"]);
  });

  it("defaults to the video ratio", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ ratio: "video" });
  });

  it("sets the canvas's aspect ratio from the ratio axis", () => {
    expect(recipe.variants?.ratio.square).toMatchObject({ canvas: { aspectRatio: "square" } });
  });

  it("sets the empty state's aspect ratio from the ratio axis", () => {
    expect(recipe.variants?.ratio.square).toMatchObject({ empty: { aspectRatio: "square" } });
  });

  it("dashes the empty state's edge", () => {
    expect(base("empty")).toMatchObject({ borderStyle: "dashed", borderWidth: "hairline" });
  });

  it("centres the empty state's message in the muted ink", () => {
    expect(base("empty")).toMatchObject({
      alignItems: "center",
      color: "fg.muted",
      justifyContent: "center",
    });
  });

  it("sets the summary in a row that wraps", () => {
    expect(base("summary")).toMatchObject({ display: "flex", flexWrap: "wrap" });
  });

  it("places the tag above the card's top edge at its end", () => {
    expect(base("nodeTag")).toMatchObject({
      insetBlockEnd: "100%",
      insetInlineEnd: "calc({spacing.inset.sm} * var(--density, 1))",
      position: "absolute",
    });
  });

  it("lets the pointer pass through the tag", () => {
    expect(base("nodeTag")).toMatchObject({ pointerEvents: "none" });
  });

  it("places the branch control across the middle of the card's bottom edge", () => {
    expect(base("nodeBranch")).toMatchObject({
      insetBlockEnd: "0",
      left: "50%",
      position: "absolute",
      translate: "-50% 50%",
    });
  });

  it("keeps half a small control's height free under a card with a branch control", () => {
    expect(base("node")).toMatchObject({
      "&:has(> .graph__nodeBranch)": {
        paddingBlockEnd: "calc(calc({sizes.control.xs} * var(--density, 1)) / 2)",
      },
    });
  });

  it("sets the overview map at the end of the row it is in", () => {
    expect(base("overview")).toMatchObject({ marginInlineStart: "auto" });
  });

  it("spreads React Flow's rules into the canvas", () => {
    expect(base("canvas")).toMatchObject(FLOW);
  });

  it("isolates the canvas's layers from the page", () => {
    expect(base("canvas")).toMatchObject({ isolation: "isolate", overflow: "hidden" });
  });

  it("edges a selected node in the focus ink", () => {
    expect(base("node")).toMatchObject({
      ".react-flow__node.selected > &": {
        _highContrast: { borderColor: "Highlight" },
        borderColor: "border.focus",
      },
    });
  });

  it("dashes a dimmed node's edge", () => {
    expect(base("node")).toMatchObject({
      "&[data-dimmed]": { borderStyle: "dashed", boxShadow: "none" },
    });
  });

  it("mutes a dimmed node's title", () => {
    expect(base("nodeTitle")).toMatchObject({
      "[data-dimmed] &": { color: "fg.muted", fontWeight: "normal" },
    });
  });

  it("edges an invalid node in the error border", () => {
    expect(base("node")).toMatchObject({ "&[data-invalid]": { borderColor: "border.error" } });
  });

  it("makes a node 256px wide", () => {
    expect(base("node")).toMatchObject({ inlineSize: "64" });
  });

  it("writes a problem in the error ink", () => {
    expect(base("nodeProblem")).toMatchObject({ color: "fg.error" });
  });

  it("hides a port's name visually while its side has one port", () => {
    expect(base("portName")).toMatchObject({ "&[data-hidden]": { srOnly: true } });
  });

  it("writes a port's name on the panel's background over the edges", () => {
    expect(base("portName")).toMatchObject({ background: "bg.panel", pointerEvents: "none" });
  });

  it.each([
    { side: "top", want: { insetBlockEnd: "100%", left: "50%" } },
    { side: "bottom", want: { insetBlockStart: "100%", left: "50%" } },
    { side: "left", want: { right: "100%", top: "50%" } },
    { side: "right", want: { left: "100%", top: "50%" } },
  ])("writes a port's name outside the $side side of its node", ({ side, want }) => {
    expect(base("portName")).toMatchObject({ [`.react-flow__handle-${side} > &`]: want });
  });

  it("places the remove control at its edge's middle", () => {
    expect(base("remove")).toMatchObject({
      pointerEvents: "all",
      transform: "translate(-50%, -50%) translate(var(--graph-edge-x), var(--graph-edge-y))",
    });
  });

  it("sets the controls in a row at the figure's start", () => {
    expect(base("controls")).toMatchObject({ alignSelf: "flex-start", display: "flex" });
  });

  it("sizes the overview map 176 by 112 pixels", () => {
    expect(base("overview")).toMatchObject({
      "& .react-flow__minimap-svg": { blockSize: "28", inlineSize: "44" },
    });
  });

  it("paints the overview map's nodes in the muted ink", () => {
    expect(base("overview")).toMatchObject({ "& .react-flow__minimap-node": { fill: "fg.muted" } });
  });

  it("paints the overview map's nodes in CanvasText under forced colors", () => {
    expect(base("overview")).toMatchObject({
      "& .react-flow__minimap-node": { _highContrast: { fill: "CanvasText" } },
    });
  });

  it("washes the part of the overview map out of view", () => {
    expect(base("overview")).toMatchObject({
      "& .react-flow__minimap-mask": { fill: "bg.muted", fillOpacity: "{opacity.muted}" },
    });
  });
});
