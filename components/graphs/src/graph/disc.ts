/**
 * Styles a network's node for the graph recipe: a disc with the node's icon, and its name under
 * it.
 *
 * @remarks
 *   The disc is as wide as its `--graph-disc`, which the preset writes from the node's weight, and
 *   is a circle from the theme's panel with a hairline edge. The name is one line on a pill in the
 *   panel's color, so an edge under it does not cross the letters. The node's box is the disc and
 *   the name, so the view's fit and the overview map include the name. The node's handles are in a
 *   hub, a line of no height half a handle below the disc's middle, so the top of each handle, the
 *   point React Flow starts a top handle's edges at, is the disc's centre. The hub is hidden, and
 *   React Flow still measures the handles in it. A selected disc takes the focus ink on its edge,
 *   and a dimmed node, `data-dimmed`, recedes by a dashed edge and a muted name, not by opacity on
 *   its words.
 */

/**
 * Styles of the node's box: the disc above its name, centred.
 */
export const DISC_NODE = {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: "1",
  position: "relative",
};

/**
 * Styles of the disc: a circle as wide as `--graph-disc` with the node's icon in its middle.
 */
export const DISC = {
  ".react-flow__node.selected &": {
    _highContrast: { borderColor: "Highlight" },
    borderColor: "border.focus",
    boxShadow: "0 0 0 {borderWidths.hairline} {colors.border.focus}",
  },
  "[data-dimmed] > &": { borderStyle: "dashed", boxShadow: "none" },
  "& > svg": { boxSize: "icon.sm" },
  alignItems: "center",
  background: "bg.panel",
  borderColor: "border",
  borderRadius: "full",
  borderStyle: "solid",
  borderWidth: "hairline",
  boxShadow: "xs",
  boxSize: "var(--graph-disc)",
  color: "fg.muted",
  display: "flex",
  justifyContent: "center",
  position: "relative",
};

/**
 * Styles of the hub the handles are in: a hidden line of no height, half a handle below the disc's
 * middle.
 */
export const DISC_HUB = {
  blockSize: "0",
  insetBlockStart: "calc(50% + {sizes.2.5} / 2)",
  insetInline: "0",
  position: "absolute",
  visibility: "hidden",
};

/**
 * Styles of the name under the disc: one line on a pill in the panel's color.
 */
export const DISC_LABEL = {
  "[data-dimmed] > &": { color: "fg.muted", fontWeight: "normal" },
  background: "bg.panel",
  borderRadius: "l1",
  color: "fg",
  fontWeight: "medium",
  paddingInline: "1",
  textStyle: "body.xs",
  whiteSpace: "nowrap",
};
