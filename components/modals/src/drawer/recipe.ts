/**
 * Recipe for the drawer: a panel attached to one edge of the window over a dimmed page, with a
 * header, a body, a footer and a close button.
 *
 * @remarks
 *   The machine has no root part. The recipe adds a root with `display: contents`, because the
 *   trigger and the portalled backdrop and positioner are siblings and a slot recipe passes its
 *   variants from an element above all three. The positioner covers the window and aligns the panel
 *   to the edge the placement names. A panel at the start or the end is as tall as the window, one
 *   at the top or the bottom as wide, and its body's scroll area scrolls while the header and the
 *   footer remain in view. The size axis writes `--drawer-size`, which the placement reads as the
 *   panel's width at the start and the end and as its greatest height at the top and the bottom.
 *   The panel slides the whole way in from its edge, and start and end swap edges under
 *   right-to-left. The recipe has no `palette` axis, because the panel reads the neutral
 *   `bg.panel`, and no `effect` axis, because a panel is not a control.
 */

import {
  axis,
  defineSlotRecipe,
  dense,
  interactive,
  motion,
  onSlot,
  onSlots,
  overlay,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, which the selectors across parts are built from.
 */
const CLASS = "drawer";

/**
 * Custom property on the panel that contains the padding of every band.
 */
const INSET = "--drawer-inset";

/**
 * Custom property on the panel that contains the side of the close button's box.
 */
const CLOSE = "--drawer-close";

/**
 * Custom property on the panel that contains the side of the close button's glyph.
 */
const MARK = "--drawer-mark";

/**
 * Custom property on the panel that contains its size across the edge it is attached to.
 */
const SIZE = "--drawer-size";

/**
 * Padding of a band, read from the panel.
 */
const PADDED = `var(${INSET})`;

/**
 * Custom property the primitives scroll area reads on its root for the offset of its focus ring.
 */
const RING_OFFSET = "--scroll-area-ring-offset";

/**
 * Stacking level of the positioner: the modal level of the z-index scale plus the index the machine
 * writes for the layer.
 */
const LAYERED = "calc({zIndex.modal} + var(--layer-index, 0))";

/**
 * Edges the panel may be attached to, in the order a page reads them.
 */
const PLACEMENTS = ["start", "end", "top", "bottom"] as const;

/**
 * Sizes the panel offers, the named widths first and the whole window last.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl", "full"] as const;

/**
 * Maps each size to the value of `--drawer-size`: 20, 28, 32, 42 and 56rem, and the whole window.
 */
const MEASURES = {
  full: "{sizes.full}",
  lg: "{sizes.2xl}",
  md: "{sizes.lg}",
  sm: "{sizes.md}",
  xl: "{sizes.4xl}",
  xs: "{sizes.xs}",
};

/**
 * Returns the styles of the panel against a side edge: the width of `--drawer-size`, and the slide
 * from that edge, from the other one under right-to-left.
 */
function side(edge: "left" | "right", mirrored: "left" | "right"): SystemStyleObject {
  return {
    ...motion(`sheet.${edge}.in`, `sheet.${edge}.out`),
    _rtl: motion(`sheet.${mirrored}.in`, `sheet.${mirrored}.out`),
    maxInlineSize: `var(${SIZE})`,
  };
}

/**
 * Returns the styles of the panel against the top or the bottom edge: the window's width, at most
 * the height of `--drawer-size`, and the slide from that edge.
 */
function across(edge: "bottom" | "top"): SystemStyleObject {
  return { ...motion(`sheet.${edge}.in`, `sheet.${edge}.out`), maxBlockSize: `var(${SIZE})` };
}

/**
 * Maps each placement to the panel's measure and motion.
 */
const PANELS = {
  bottom: across("bottom"),
  end: side("right", "left"),
  start: side("left", "right"),
  top: across("top"),
};

/**
 * Maps each placement to the positioner's alignment, which places the panel against its edge.
 */
const ALIGNED = {
  bottom: { alignItems: "flex-end" },
  end: { alignItems: "stretch", justifyContent: "flex-end" },
  start: { alignItems: "stretch", justifyContent: "flex-start" },
  top: { alignItems: "flex-start" },
};

/**
 * Defines the drawer recipe: an extra-small panel at the end of the window.
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
      background: "bg.panel",
      borderColor: "transparent",
      borderStyle: "solid",
      borderWidth: "hairline",
      boxShadow: "xl",
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
      display: "flex",
      inset: "0",
      overscrollBehaviorY: "none",
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
  defaultVariants: { placement: "end", size: "xs" },
  jsx: [/^Drawer(\.\w+)?$/u],
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
     * Inset of the panel from the window by the middle inset, with the roundest corner.
     */
    contained: {
      true: { content: { borderRadius: "l3" }, positioner: { padding: "{spacing.inset.md}" } },
    },

    /**
     * Edge of the window the panel is attached to: the inline start or end, the top, or the bottom.
     */
    placement: onSlots({
      content: axis(PLACEMENTS, (placement) => PANELS[placement])(),
      positioner: axis(PLACEMENTS, (placement) => ALIGNED[placement])(),
    }),

    /**
     * Size of the panel across its edge: at most a named width, or the whole window.
     */
    size: onSlot("content", axis(SIZES, (size) => ({ [SIZE]: MEASURES[size] }))()),
  },
});
