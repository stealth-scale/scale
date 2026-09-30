/**
 * Recipe for a floating panel: a window over the page that a person drags by its header, resizes
 * from its edges and corners, minimizes, maximizes and closes.
 *
 * @remarks
 *   The machine has no root part. The recipe adds a root with `display: contents`, because the
 *   trigger and the portalled positioner are siblings and a slot recipe passes its variants from an
 *   element above both. The machine fixes the positioner to the window and writes its place and
 *   size inline. The positioner stacks at `banner` plus the panel's place in the stack of open
 *   panels: above the page's sticky bands, and under a backdrop, a dialog, a popover, a toast and a
 *   tooltip. The panel has the dialog's surface, a transparent hairline edge that forced colors
 *   paint in `CanvasText`, and a ring outside it while it has keyboard focus. The resize triggers
 *   are strips `sizes.2` wide inside the panel's edges, and squares of that side at its corners.
 *   The panel does not clip its children, so a corner's square takes the pointer beyond the rounded
 *   corner. The machine clips a minimized panel to its header inline. The header pads its controls
 *   clear of the strips, and the body's scroll area ends clear of the end and bottom strips, so its
 *   bar takes the pointer. The recipe has no `palette` axis, because
 *   the panel reads the neutral `bg.panel`, and no `effect` axis, because a panel is not a
 *   control.
 */

import {
  defineSlotRecipe,
  dense,
  interactive,
  motion,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, which a selector across its parts writes.
 */
export const CLASS = "floating-panel";

/**
 * Width of a resize trigger's strip, and the side of a corner's square.
 */
const STRIP = "{sizes.2}";

/**
 * Stacking level of the positioner: the banner level of the z-index scale plus the panel's place in
 * the stack of open panels, which the machine writes as `--z-index`.
 */
const LAYERED = "calc({zIndex.banner} + var(--z-index, 0))";

/**
 * Custom property the primitives scroll area reads on its root for the offset of its focus ring.
 */
const RING_OFFSET = "--scroll-area-ring-offset";

/**
 * Defines the floating panel recipe.
 */
export const recipe = defineSlotRecipe({
  base: {
    body: { padding: dense("{spacing.inset.sm}"), textStyle: "body.sm" },
    closeTrigger: { flexShrink: "0" },
    content: {
      ...motion("scale-fade.in", "scale-fade.out"),
      background: "bg.panel",
      borderColor: "transparent",
      borderRadius: "l3",
      borderStyle: "solid",
      borderWidth: "hairline",
      boxShadow: "lg",
      color: "fg",
      display: "flex",
      flexDirection: "column",
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
      position: "relative",
    },
    control: {
      alignItems: "center",
      display: "flex",
      flexShrink: "0",
      gap: dense("{spacing.gap.xs}"),
    },
    dragTrigger: {
      "&[data-disabled]": { cursor: "auto" },
      "& > svg": { boxSize: "icon.sm", color: "fg.subtle", flexShrink: "0" },
      [`.${CLASS}__header[data-dragging] > &`]: { cursor: "dragging" },
      alignItems: "center",
      alignSelf: "stretch",
      cursor: "drag",
      display: "flex",
      flex: "1",
      gap: dense("{spacing.gap.sm}"),
      minInlineSize: "0",
      touchAction: "none",
      userSelect: "none",
    },
    header: {
      alignItems: "center",
      borderBlockEndColor: "border",
      borderBlockEndStyle: "solid",
      borderBlockEndWidth: "hairline",
      display: "flex",
      flexShrink: "0",
      gap: dense("{spacing.gap.sm}"),
      paddingBlock: dense("{spacing.inset.xs}"),
      paddingInlineEnd: dense("{spacing.inset.xs}"),
      paddingInlineStart: dense("{spacing.inset.sm}"),
    },
    positioner: { zIndex: LAYERED },
    resizeTrigger: {
      "&:is([data-axis=e], [data-axis=w])": { inlineSize: STRIP },
      "&:is([data-axis=n], [data-axis=s])": { blockSize: STRIP },
      "&:is([data-axis=ne], [data-axis=nw], [data-axis=se], [data-axis=sw])": {
        blockSize: STRIP,
        inlineSize: STRIP,
      },
      "&[data-disabled]": { display: "none" },
      zIndex: "docked",
    },
    root: { display: "contents" },
    scroller: {
      "&[hidden]": { display: "none" },
      flex: "1",
      marginBlockEnd: STRIP,
      marginInlineEnd: STRIP,
      minBlockSize: "0",
      [RING_OFFSET]: "calc({borderWidths.ring} * -1)",
    },
    stageTrigger: { "&[hidden]": { display: "none" }, flexShrink: "0" },
    title: { ...truncate(), fontWeight: "semibold", textStyle: "label.md" },
    trigger: {
      ...interactive(),
      alignItems: "center",
      display: "inline-flex",
      gap: dense("{spacing.gap.xs}"),
    },
  },
  className: CLASS,
  jsx: [/^FloatingPanel(\.\w+)?$/u],
  slots: [
    "root",
    "trigger",
    "positioner",
    "content",
    "header",
    "dragTrigger",
    "title",
    "control",
    "stageTrigger",
    "closeTrigger",
    "scroller",
    "body",
    "resizeTrigger",
  ],
});
