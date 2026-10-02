/**
 * Declares the table of contents slot recipe for a list of links to the headings on a page, with
 * an indicator next to the links whose headings are visible.
 *
 * @remarks
 *   The machine measures the active rows and writes their offset and height to the indicator as
 *   `--top` and `--height`, so the recipe sets only the indicator's width and color. Each item
 *   carries its heading's depth as `--depth`, and the recipe indents it by one gap per level below
 *   `h2`. Active links take the default ink at medium weight, and the others are muted. Links
 *   truncate to one line. The root is at least 11rem wide, so a page of short headings gets the
 *   same width as a page of long ones, and never wider than its container. The title and the
 *   links share their inline start padding, so the title text and the link text start at the same
 *   offset. Under forced colors the indicator paints `CanvasText`, because the browser replaces
 *   its background with Canvas. The recipe has no `effect` axis, because the rail has no box.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  paletteVariants,
  sizeVariants,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Custom property with the height of the pinned bars above the page, set by the application
 * shell.
 *
 * @remarks
 *   The aside placement adds it to its sticky offset, so the rail sticks below the bars. Without
 *   a shell the property is unset and the offset falls back to 0px.
 */
const STUCK = "--app-shell-sticky-top";

/**
 * Sizes the recipe offers. Links read the body text style one size smaller, and the title reads
 * the label text style two sizes smaller.
 */
const STEPS = ["sm", "md", "lg"] as const;

/**
 * Room a focus ring takes outside an element: its offset and its width.
 */
const RING_ROOM = "calc(var(--focus-ring-offset, 0px) + var(--focus-ring-width, 0px))";

/**
 * Returns the gap between the title and the list at a size, one gap step smaller than the size.
 *
 * @param size - The recipe's size.
 */
function spaced(size: (typeof STEPS)[number]): Record<"gap", string> {
  return { gap: dense(`{spacing.gap.${below(size)}}`) };
}

/**
 * Table of contents slot recipe, inline at the md size by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    /**
     * The column of the title and the list inside the aside placement's scroll area, padded by
     * the room a focus ring takes at its edges.
     */
    content: { display: "flex", flexDirection: "column", padding: RING_ROOM },
    indicator: {
      _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
      _motionReduce: { transitionDuration: "0s" },
      background: "colorPalette.solid",
      blockSize: "var(--height)",
      borderRadius: "full",
      inlineSize: "{borderWidths.indicator}",
      insetBlockStart: "var(--top)",
      insetInlineStart: "0",
      position: "absolute",
      transitionDuration: "move",
      transitionProperty: "top, height",
      transitionTimingFunction: "move",
    },
    item: { paddingInlineStart: "calc((var(--depth) - 2) * {spacing.gap.md})" },
    link: {
      ...truncate(),
      _hover: { color: "fg" },
      "&[data-active]": { color: "fg", fontWeight: "medium" },
      borderRadius: "l2",
      color: "fg.muted",
      cursor: "button",
      display: "block",
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
      textDecoration: "none",
      transitionDuration: "press",
      transitionProperty: "common",
    },
    list: {
      display: "flex",
      flexDirection: "column",
      listStyle: "none",
      margin: "0",
      padding: "0",
      position: "relative",
    },
    root: {
      colorPalette: "primary",
      display: "flex",
      flexDirection: "column",
      minInlineSize: "min({sizes.44}, 100%)",
    },
    /**
     * The aside placement's scroll area, pulled out at its start edges by the room its content's
     * padding takes, so the title and the links start where the root starts.
     *
     * @remarks
     *   The end edges are inside the root, because a box past the root's end edges is overflow a
     *   scrolling container around the root scrolls to.
     */
    scroller: {
      marginBlockStart: `calc(${RING_ROOM} * -1)`,
      marginInlineStart: `calc(${RING_ROOM} * -1)`,
    },
    title: {
      color: "fg.muted",
      fontWeight: "semibold",
      letterSpacing: "wider",
      textTransform: "uppercase",
    },
  },
  className: "toc",
  defaultVariants: { placement: "inline", size: "md" },
  jsx: [/^Toc(\.\w+)?$/u],
  slots: ["root", "scroller", "content", "title", "list", "item", "link", "indicator"],
  variants: {
    /**
     * The semantic palette of the indicator and the focus ring. Without a value the root reads
     * `primary`.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Whether the root sticks to the top of the viewport or stays in the document flow.
     *
     * @remarks
     *   `aside` sets `position: sticky` with an offset below the application shell's pinned bars,
     *   and caps the root at the viewport height. The root renders its title and list in the
     *   primitives package's scroll area, which fills the root. `inline` is the default and leaves
     *   placement to the container, such as a drawer or a column on a narrow screen.
     */
    placement: onSlot("root", {
      aside: {
        alignSelf: "start",
        insetBlockStart: `calc(var(${STUCK}, 0px) + ${dense("{spacing.gap.lg}")})`,
        maxBlockSize: `calc(100dvh - var(${STUCK}, 0px) - ${dense("{spacing.gap.lg}")} * 2)`,
        position: "sticky",
      },
      inline: { position: "static" },
    }),

    /**
     * The text styles, the row padding and the gap between the title and the list.
     */
    size: onSlots({
      content: sizeVariants(spaced, STEPS),
      link: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.gap.${below(below(size))}}`),
          paddingInlineEnd: dense(`{spacing.inset.${below(size)}}`),
          paddingInlineStart: dense(`{spacing.inset.${size}}`),
          textStyle: `body.${below(size)}`,
        }),
        STEPS,
      ),
      root: sizeVariants(spaced, STEPS),
      title: sizeVariants(
        (size) => ({
          paddingInlineEnd: dense(`{spacing.inset.${below(size)}}`),
          paddingInlineStart: dense(`{spacing.inset.${size}}`),
          textStyle: `label.${below(below(size))}`,
        }),
        STEPS,
      ),
    }),
  },
});
