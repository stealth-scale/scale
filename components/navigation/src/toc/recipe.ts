/**
 * States what a table of contents is: a rail of links to the headings on a page, with a mark
 * beside whichever headings are on screen.
 *
 * @remarks
 *   Six parts. The root is the landmark, the title names it, the list holds one item per heading,
 *   each item holds the link to its heading, and the indicator is the mark that slides down the
 *   list to the rows naming the headings on screen.
 *   The machine measures the active rows and writes their place on the root as custom properties,
 *   so the recipe states the indicator's thickness and its colour and never its place. Each item
 *   carries its heading's depth as a custom property, and a heading one level in is indented by
 *   one gap for each level below the top.
 *   The links are muted and the one naming a heading on screen is set in the page's ink and a
 *   step heavier, so a reader scanning the rail finds where they are without reading the mark.
 *   A long title is cut short on one line, because a rail of many titles is a list to scan rather
 *   than a column of prose. The rail is at least eleven rems wide, so a page of short titles
 *   draws the same rail as a page of long ones. The title of the rail is set small in capitals, so
 *   it reads as the label of the list rather than as a heading of the page.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  sizeVariants,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * The property a rail beside the page reads the room the bars above it take from.
 *
 * @remarks
 *   The application shell states it on every pinned bar, so a rail that sticks stops under them
 *   rather than sliding beneath. A page with no pinned bar writes nothing and the rail sticks to
 *   the top of the window.
 */
const STUCK = "--app-shell-sticky-top";

/**
 * The steps the rail is offered at, which read the body role a step below and the label role two
 * below.
 */
const STEPS = ["sm", "md", "lg"] as const;

/**
 * Draws a rail at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    indicator: {
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
      minInlineSize: "44",
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
  slots: ["root", "title", "list", "item", "link", "indicator"],
  variants: {
    /**
     * Where the rail is placed against the page it lists.
     *
     * @remarks
     *   Beside the page it sticks to the top of the window as the reader scrolls, which is the
     *   whole of what a table of contents is for: the mark moves down a rail that stays where the
     *   reader can see it. Written into the flow it scrolls away with the first heading it names,
     *   and a reader is left with a rail they have to scroll back to.
     *   It keeps the room the bars above it take, through the same property a sticky bar reads, so
     *   a page with a header does not slide the rail under it.
     *   `inline` is the default and stands where it is written: a rail in a drawer, or over a page
     *   on a narrow screen, is placed by whatever holds it.
     */
    placement: onSlot("root", {
      aside: {
        alignSelf: "start",
        insetBlockStart: `calc(var(${STUCK}, 0px) + ${dense("{spacing.gap.lg}")})`,
        maxBlockSize: `calc(100dvh - var(${STUCK}, 0px) - ${dense("{spacing.gap.lg}")} * 2)`,
        overflowY: "auto",
        position: "sticky",
      },
      inline: { position: "static" },
    }),

    /**
     * How big the rail is read at.
     */
    size: onSlots({
      link: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.gap.${below(below(size))}}`),
          paddingInlineEnd: dense(`{spacing.inset.${below(size)}}`),
          paddingInlineStart: dense(`{spacing.inset.${size}}`),
          textStyle: `body.${below(size)}`,
        }),
        STEPS,
      ),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), STEPS),
      title: sizeVariants(
        (size) => ({
          paddingInline: dense(`{spacing.inset.${below(size)}}`),
          textStyle: `label.${below(below(size))}`,
        }),
        STEPS,
      ),
    }),
  },
});
