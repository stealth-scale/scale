/**
 * Declares the message's slot recipe, which lays out one turn of a conversation.
 *
 * @remarks
 *   A turn is the run of messages one person sent together. It has one avatar, one header and a
 *   bubble per message. `align="end"` puts the reader's own turns at the end of the line: the row
 *   runs the other way and the column aligns its bubbles to the end. A bubble takes the flat looks,
 *   because it is read and never pressed. It is at most 80% of the column wide, so the two sides of
 *   a conversation are apart. The plain look has no fill and no padding and takes the whole column,
 *   for an answer that reads as a document. A bubble has a hairline outline under forced colors,
 *   where every fill is replaced.
 */

import {
  axis,
  defineSlotRecipe,
  dense,
  flatVariants,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, which a selector across parts reads.
 */
const CLASS = "message";

/**
 * Selects the actions of a turn, from a rule on the root.
 */
const ACTIONS = `.${CLASS}__actions`;

/**
 * Sizes the message offers.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Describes one size's text styles and steps.
 */
interface Metric {
  /**
   * Step of the gap scale between the avatar and the column.
   */
  readonly gap: string;

  /**
   * Step of the inset scale inside a bubble, at its start and end.
   */
  readonly inline: string;

  /**
   * Text style of the header, the footer and the status.
   */
  readonly meta: string;

  /**
   * Step of the gap scale inside a bubble, above and below its words.
   */
  readonly padding: string;

  /**
   * Text style of a bubble's words.
   */
  readonly text: string;
}

/**
 * Maps each size to its steps and text styles.
 */
const METRICS: Readonly<Record<(typeof SIZES)[number], Metric>> = {
  lg: { gap: "lg", inline: "md", meta: "label.sm", padding: "md", text: "body.lg" },
  md: { gap: "md", inline: "sm", meta: "label.xs", padding: "sm", text: "body.md" },
  sm: { gap: "sm", inline: "xs", meta: "label.xs", padding: "xs", text: "body.sm" },
};

/**
 * Ends of the line a turn can belong to, in the order a documentation page shows them.
 */
const SIDES = ["start", "end"] as const;

/**
 * Styles a turn at the start of the line in the neutral palette's subtle look, at the middle size.
 */
export const recipe = defineSlotRecipe({
  base: {
    actions: {
      alignItems: "center",
      display: "flex",
      gap: dense("{spacing.gap.xs}"),
    },
    avatar: {
      alignItems: "center",
      display: "flex",
      flexShrink: "0",
    },
    bubble: {
      _highContrast: {
        outlineColor: "CanvasText",
        outlineStyle: "solid",
        outlineWidth: "hairline",
      },
      "&[data-failed]": { colorPalette: "error" },
      borderRadius: "l3",
      maxInlineSize: "80%",
      minInlineSize: "0",
      overflowWrap: "anywhere",
    },
    content: {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      gap: dense("{spacing.gap.xs}"),
      minInlineSize: "0",
    },
    footer: {
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      flexWrap: "wrap",
      gap: dense("{spacing.gap.sm}"),
    },
    header: {
      alignItems: "baseline",
      color: "fg.muted",
      display: "flex",
      flexWrap: "wrap",
      gap: dense("{spacing.gap.sm}"),
    },
    root: {
      alignItems: "flex-start",
      display: "flex",
      inlineSize: "full",
      minInlineSize: "0",
    },
    status: {
      "&[data-status=failed]": { color: "fg.error" },
      "&[data-status=read]": { color: "colorPalette.fg", colorPalette: "primary" },
      "& > svg": { blockSize: "1em", flexShrink: "0", inlineSize: "1em" },
      alignItems: "center",
      display: "inline-flex",
      gap: "0.25em",
    },
  },
  className: CLASS,
  compoundVariants: [
    {
      css: {
        bubble: {
          _highContrast: { outlineStyle: "none" },
          maxInlineSize: "full",
          paddingBlock: "0",
          paddingInline: "0",
        },
      },
      look: "plain",
      name: "document",
    },
  ],
  defaultVariants: {
    align: "start",
    look: "subtle",
    palette: "neutral",
    reveal: "hover",
    size: "md",
  },
  jsx: [/^Message\.\w+$/u],
  slots: ["root", "avatar", "content", "header", "bubble", "footer", "status", "actions"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Which end of the line the turn belongs to: the row runs the other way at the end, and the
     * column aligns its bubbles to that end.
     */
    align: onSlots({
      content: axis(SIDES, (side) => ({
        alignItems: side === "start" ? "flex-start" : "flex-end",
      }))(),
      root: axis(SIDES, (side) => ({ flexDirection: side === "start" ? "row" : "row-reverse" }))(),
    }),
    look: onSlot("bubble", flatVariants()),
    palette: onSlot("root", paletteVariants()),

    /**
     * When the actions of the turn are visible.
     *
     * @remarks
     *   With `hover`, the actions are transparent until a pointer is over the turn or focus is
     *   inside it. A coarse pointer cannot hover, so under one they are always opaque. They are in
     *   the tab order under both values, so Tab reveals them.
     */
    reveal: {
      always: { actions: { opacity: "1" } },
      hover: {
        actions: {
          _touch: { opacity: "1" },
          opacity: "0",
          transitionDuration: "press",
          transitionProperty: "common",
          transitionTimingFunction: "press",
        },
        root: {
          [`&:focus-within ${ACTIONS}, &:hover ${ACTIONS}`]: { opacity: "1" },
        },
      },
    },

    size: onSlots({
      bubble: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.gap.${METRICS[size].padding}}`),
          paddingInline: dense(`{spacing.inset.${METRICS[size].inline}}`),
          textStyle: METRICS[size].text,
        }),
        SIZES,
      ),
      footer: sizeVariants((size) => ({ textStyle: METRICS[size].meta }), SIZES),
      header: sizeVariants((size) => ({ textStyle: METRICS[size].meta }), SIZES),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${METRICS[size].gap}}`) }), SIZES),
    }),
  },
});
