/**
 * Recipe for the dialog: a panel over a dimmed page, with a header, a body, a footer and a close
 * button.
 *
 * @remarks
 *   The machine has no root part. The recipe adds a root with `display: contents`, because the
 *   trigger and the portalled backdrop and positioner are siblings and a slot recipe passes its
 *   variants from an element above all three. The positioner covers the window and places the
 *   panel with margins, so a panel taller than the window starts at the top and scrolls. The panel
 *   has no padding. Each band pads its sides and its top, and the last band also pads its bottom.
 *   A child with a background and an edge of its own therefore fills a plain panel. The positioner
 *   and the backdrop read the `--layer-index` the machine writes, so the backdrop of a nested
 *   dialog covers the dialog under it. The recipe has no `palette` axis, because the panel reads
 *   the neutral `bg.panel`, and no `effect` axis, because a panel is not a control.
 */

import {
  axis,
  defineSlotRecipe,
  dense,
  interactive,
  motion,
  onSlot,
  overlay,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, which the selectors across parts are built from.
 */
const CLASS = "dialog";

/**
 * Custom property on the panel that contains the padding of every band.
 */
const INSET = "--dialog-inset";

/**
 * Custom property on the panel that contains the side of the close button's box.
 */
const CLOSE = "--dialog-close";

/**
 * Custom property on the panel that contains the side of the close button's glyph.
 */
const MARK = "--dialog-mark";

/**
 * Padding of a band, read from the panel.
 */
const PADDED = `var(${INSET})`;

/**
 * Custom property the primitives scroll area reads on its root for the offset of its focus ring.
 */
const RING_OFFSET = "--scroll-area-ring-offset";

/**
 * Sizes on the width scale the panel offers, beside `cover` and `full`.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Maps each size to the named width the panel is at most: 24, 28, 32, 42 and 56rem.
 */
const WIDTHS = { lg: "2xl", md: "lg", sm: "md", xl: "4xl", xs: "sm" };

/**
 * Stacking level of the positioner: the modal level of the z-index scale plus the index the machine
 * writes for the layer.
 */
const LAYERED = "calc({zIndex.modal} + var(--layer-index, 0))";

/**
 * Places the panel may take, in the order the window reads them.
 */
const PLACEMENTS = ["top", "center", "bottom"] as const;

/**
 * Maps each placement to the automatic margin that moves the panel there.
 */
const MARGINS = {
  bottom: { marginBlockStart: "auto" },
  center: { marginBlock: "auto" },
  top: { marginBlockEnd: "auto" },
};

/**
 * Defines the dialog recipe: an elevated panel at size `md`, placed at the top of the window, that
 * scrolls with the window.
 */
export const recipe = defineSlotRecipe({
  base: {
    actionTrigger: interactive(),
    backdrop: {
      ...overlay(),
      pointerEvents: "auto",
      zIndex: `calc(${LAYERED} - 1)`,
    },
    body: {
      [`.${CLASS}__scroller:has(~ .${CLASS}__footer) &`]: { paddingBlockEnd: "0" },
      padding: PADDED,
      textStyle: "body.md",
    },
    closeTrigger: {
      ...interactive(),
      _hover: { color: "fg" },
      "& > svg": { boxSize: `var(${MARK})` },
      alignItems: "center",
      borderRadius: "l1",
      boxSize: `var(${CLOSE})`,
      color: "fg.muted",
      display: "inline-flex",
      insetBlockStart: `calc(${PADDED} + (1lh - var(${CLOSE})) / 2)`,
      insetInlineEnd: `calc(${PADDED} - (var(${CLOSE}) - var(${MARK})) / 2)`,
      justifyContent: "center",
      position: "absolute",
      textStyle: "heading.md",
    },
    content: {
      ...motion("scale-fade.in", "scale-fade.out"),
      [CLOSE]: dense("{sizes.control.xs}"),
      color: "fg",
      display: "flex",
      flexDirection: "column",
      inlineSize: "full",
      [INSET]: dense("{spacing.inset.xl}"),
      [MARK]: dense("{sizes.icon.md}"),
      outline: "none",
      position: "relative",
    },
    description: { color: "fg.muted", textStyle: "body.md" },
    footer: {
      alignItems: "center",
      display: "flex",
      flexShrink: "0",
      flexWrap: "wrap",
      gap: dense("{spacing.gap.md}"),
      justifyContent: "flex-end",
      padding: PADDED,
    },
    header: {
      [`.${CLASS}__content:has(> .${CLASS}__closeTrigger) > &`]: {
        paddingInlineEnd: `calc(${PADDED} + var(${CLOSE}))`,
      },
      [`&:has(~ .${CLASS}__footer)`]: { paddingBlockEnd: "0" },
      [`&:has(~ .${CLASS}__scroller)`]: { paddingBlockEnd: "0" },
      display: "flex",
      flexDirection: "column",
      flexShrink: "0",
      gap: dense("{spacing.gap.sm}"),
      padding: PADDED,
    },
    positioner: {
      alignItems: "flex-start",
      display: "flex",
      inset: "0",
      justifyContent: "center",
      overscrollBehaviorY: "none",
      paddingBlock: "{spacing.16}",
      paddingInline: "{spacing.inset.md}",
      position: "fixed",
      zIndex: LAYERED,
    },
    root: { display: "contents" },
    scroller: { flex: "1", [RING_OFFSET]: "calc({borderWidths.ring} * -1)" },
    title: { fontWeight: "semibold", textStyle: "heading.md" },
    trigger: {
      ...interactive(),
      alignItems: "center",
      display: "inline-flex",
      gap: dense("{spacing.gap.xs}"),
    },
  },
  className: CLASS,
  defaultVariants: {
    placement: "top",
    scrollBehavior: "outside",
    size: "md",
    variant: "elevated",
  },
  jsx: [/^Dialog(\.\w+)?$/u],
  slots: [
    "root",
    "trigger",
    "backdrop",
    "positioner",
    "content",
    "header",
    "title",
    "description",
    "scroller",
    "body",
    "footer",
    "closeTrigger",
    "actionTrigger",
  ],
  variants: {
    /**
     * Place of the panel in the window: at the top, in the middle, or at the bottom.
     *
     * @remarks
     *   The panel's automatic margins place it, so a panel taller than the window starts at the top
     *   under every placement, and the window scrolls to its end.
     */
    placement: onSlot("content", axis(PLACEMENTS, (placement) => MARGINS[placement])()),

    /**
     * What scrolls when the panel is taller than the window: the body inside the panel, or the
     * window around it.
     *
     * @remarks
     *   Inside, the panel is at most as tall as the window less the positioner's padding, so the
     *   body's scroll area scrolls and the header and the footer remain in view. Outside, the
     *   positioner scrolls and takes pointer events, so the wheel scrolls it anywhere in the
     *   window.
     */
    scrollBehavior: {
      inside: { content: { maxBlockSize: "full" }, positioner: { overflowY: "hidden" } },
      outside: { positioner: { overflowY: "auto", pointerEvents: "auto" } },
    },

    /**
     * Width of the panel: at most a named width, the window inside a margin, or the whole window.
     */
    size: {
      ...onSlot(
        "content",
        sizeVariants((size) => ({ maxInlineSize: `{sizes.${WIDTHS[size]}}` }), SIZES),
      ),
      cover: { content: { blockSize: "full" }, positioner: { padding: "{spacing.10}" } },
      full: {
        content: { borderRadius: "0", minBlockSize: "full" },
        positioner: { padding: "0" },
      },
    },

    /**
     * Look of the panel: `bg.panel` with an extra-large shadow, or a transparent box for a child
     * with a background and an edge of its own.
     *
     * @remarks
     *   The elevated panel has a transparent hairline edge, which forced colors paint in
     *   `CanvasText`, so the panel keeps its outline where the shadow is not drawn.
     */
    variant: {
      elevated: {
        content: {
          background: "bg.panel",
          borderColor: "transparent",
          borderRadius: "l3",
          borderStyle: "solid",
          borderWidth: "hairline",
          boxShadow: "xl",
        },
      },
      plain: { content: { background: "transparent" } },
    },
  },
});
