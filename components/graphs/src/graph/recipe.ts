/**
 * Styles a graph's figure, canvas, controls, overview map, summary, empty state and nodes, and
 * restyles the classes React Flow writes with the theme's tokens.
 *
 * @remarks
 *   The canvas is a panel as wide as the figure and as tall as its ratio, because React Flow
 *   measures its box after the first render and renders nothing in a box 0 pixels high. The empty
 *   state takes the canvas's place at the same ratio. The controls are a row at the figure's start
 *   above the canvas, and the overview map a panel at its end below the canvas, so neither covers a
 *   node. A node is a card 256px wide, the width `layoutGraph` places a node by, with a header of
 *   an icon, a title, a subtitle, a status and actions, a body, and a problem line in the error
 *   ink. A tag renders above the card's top edge at its end, and a branch control straddles the
 *   middle of its bottom edge, where the card keeps half the control's height free. A network's
 *   node is a disc with its name under it instead of a card. A selected node takes the focus ink
 *   on its edge, and a node the canvas dims recedes by a dashed edge and a muted title, not by
 *   opacity on its words. A port's name is written beside its handle, outside
 *   the node, on the side the handle is on. The recipe has no `palette` axis, because a graph is
 *   not a control and its colors are the theme's roles.
 */

import {
  defineSlotRecipe,
  dense,
  onSlots,
  ratioVariants,
  truncate,
} from "@stealthscale/theme/authoring";

import { DISC, DISC_HUB, DISC_LABEL, DISC_NODE } from "#graph/disc.ts";
import { FLOW } from "#graph/flow.ts";

/**
 * Styles of the overview map's box: a panel 176 by 112 pixels at the end of the figure, the map's
 * nodes in the muted ink and the part out of view behind a wash.
 */
const OVERVIEW = {
  "& .react-flow__minimap-mask": {
    fill: "bg.muted",
    fillOpacity: "{opacity.muted}",
    stroke: "none",
  },
  "& .react-flow__minimap-node": { _highContrast: { fill: "CanvasText" }, fill: "fg.muted" },
  "& .react-flow__minimap-svg": { blockSize: "28", display: "block", inlineSize: "44" },
  background: "bg.panel",
  borderColor: "border",
  borderRadius: "l2",
  borderStyle: "solid",
  borderWidth: "hairline",
  marginInlineStart: "auto",
  overflow: "hidden",
};

/**
 * Rule of the hairline that parts a node's body and problem line from its header.
 */
const RULED = {
  borderBlockStartColor: "border",
  borderBlockStartStyle: "solid",
  borderBlockStartWidth: "hairline",
  paddingBlock: dense("{spacing.inset.xs}"),
  paddingInline: dense("{spacing.inset.sm}"),
  textStyle: "body.xs",
};

/**
 * Defines the graph recipe: a figure whose canvas is as wide as the figure and as tall as its
 * ratio, by default the video ratio.
 */
export const recipe = defineSlotRecipe({
  base: {
    canvas: {
      ...FLOW,
      background: "bg.panel",
      borderColor: "border",
      borderRadius: "l2",
      borderStyle: "solid",
      borderWidth: "hairline",
      inlineSize: "full",
      isolation: "isolate",
      minInlineSize: "0",
      overflow: "hidden",
      position: "relative",
    },
    caption: { color: "fg.muted", textStyle: "body.sm" },
    controls: {
      alignItems: "center",
      alignSelf: "flex-start",
      display: "flex",
      gap: dense("{spacing.gap.xs}"),
      maxInlineSize: "full",
    },
    disc: DISC,
    discHub: DISC_HUB,
    discLabel: DISC_LABEL,
    discNode: DISC_NODE,
    empty: {
      alignItems: "center",
      background: "bg.panel",
      borderColor: "border",
      borderRadius: "l2",
      borderStyle: "dashed",
      borderWidth: "hairline",
      color: "fg.muted",
      display: "flex",
      inlineSize: "full",
      justifyContent: "center",
      padding: dense("{spacing.inset.md}"),
      textAlign: "center",
      textStyle: "body.sm",
    },
    level: {
      color: "fg.muted",
      fontVariantNumeric: "tabular-nums",
      minInlineSize: "10",
      paddingInline: dense("{spacing.inset.xs}"),
      textAlign: "center",
      textStyle: "body.xs",
    },
    node: {
      ".react-flow__node.selected > &": {
        _highContrast: { borderColor: "Highlight" },
        borderColor: "border.focus",
        boxShadow: "0 0 0 {borderWidths.hairline} {colors.border.focus}",
      },
      "&:has(> .graph__nodeBranch)": {
        paddingBlockEnd: `calc(${dense("{sizes.control.xs}")} / 2)`,
      },
      "&[data-dimmed]": { borderStyle: "dashed", boxShadow: "none" },
      "&[data-invalid]": { borderColor: "border.error" },
      background: "bg.panel",
      borderColor: "border",
      borderRadius: "l2",
      borderStyle: "solid",
      borderWidth: "hairline",
      boxShadow: "xs",
      color: "fg",
      display: "flex",
      flexDirection: "column",
      inlineSize: "64",
      position: "relative",
      textAlign: "start",
      textStyle: "body.sm",
    },
    nodeActions: { alignItems: "center", display: "flex", flexShrink: "0" },
    nodeBody: { ...RULED, color: "fg.muted" },
    nodeBranch: {
      display: "inline-flex",
      insetBlockEnd: "0",
      left: "50%",
      position: "absolute",
      translate: "-50% 50%",
    },
    nodeHeader: {
      alignItems: "flex-start",
      display: "flex",
      gap: dense("{spacing.gap.sm}"),
      paddingBlock: dense("{spacing.inset.xs}"),
      paddingInline: dense("{spacing.inset.sm}"),
    },
    nodeIcon: {
      "& > svg": { boxSize: "icon.sm" },
      color: "fg.muted",
      display: "inline-flex",
      flexShrink: "0",
      marginBlockStart: "0.5",
    },
    nodeProblem: { ...RULED, color: "fg.error" },
    nodeSubtitle: { ...truncate(), color: "fg.muted", textStyle: "body.xs" },
    nodeTag: {
      display: "inline-flex",
      insetBlockEnd: "100%",
      insetInlineEnd: dense("{spacing.inset.sm}"),
      marginBlockEnd: "1",
      pointerEvents: "none",
      position: "absolute",
    },
    nodeText: { display: "flex", flex: "1", flexDirection: "column", minInlineSize: "0" },
    nodeTitle: {
      ...truncate(),
      "[data-dimmed] &": { color: "fg.muted", fontWeight: "normal" },
      fontWeight: "medium",
    },
    overview: OVERVIEW,
    portName: {
      ".react-flow__handle-bottom > &": {
        insetBlockStart: "100%",
        left: "50%",
        marginBlockStart: "1",
        translate: "-50% 0",
      },
      ".react-flow__handle-left > &": {
        marginInlineEnd: "1.5",
        right: "100%",
        top: "50%",
        translate: "0 -50%",
      },
      ".react-flow__handle-right > &": {
        left: "100%",
        marginInlineStart: "1.5",
        top: "50%",
        translate: "0 -50%",
      },
      ".react-flow__handle-top > &": {
        insetBlockEnd: "100%",
        left: "50%",
        marginBlockEnd: "1",
        translate: "-50% 0",
      },
      "&[data-hidden]": { srOnly: true },
      background: "bg.panel",
      borderRadius: "l1",
      color: "fg.muted",
      paddingInline: "1",
      pointerEvents: "none",
      position: "absolute",
      textStyle: "body.xs",
      whiteSpace: "nowrap",
    },
    remove: {
      display: "inline-flex",
      left: "0",
      pointerEvents: "all",
      position: "absolute",
      top: "0",
      transform: "translate(-50%, -50%) translate(var(--graph-edge-x), var(--graph-edge-y))",
    },
    root: {
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.md}"),
      inlineSize: "full",
      margin: "0",
      minInlineSize: "0",
    },
    summary: {
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      flexWrap: "wrap",
      gap: dense("{spacing.gap.sm}"),
      textStyle: "body.sm",
    },
  },
  className: "graph",
  defaultVariants: { ratio: "video" },
  jsx: [/^Graph(\.\w+)?$/u],
  slots: [
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
  ],
  variants: {
    /**
     * Aspect ratio of the canvas, one of the theme's ratios, which the empty state takes in the
     * canvas's place.
     *
     * @remarks
     *   React Flow measures the canvas's box after the first render and renders nothing in a box 0
     *   pixels high. The ratio gives the box its height before that measurement.
     */
    ratio: onSlots({ canvas: ratioVariants(), empty: ratioVariants() }),
  },
});
