/**
 * Declares the timeline's slot recipe: entries in the order they happened, each an indicator on a
 * rail and the words beside it.
 *
 * @remarks
 *   The root is an ordered list laid out as a grid of three columns: the words before the rail,
 *   the rail, and the words after it. Each item is a subgrid row, so dates written before the rail
 *   line up down the list at the widest date's width. `rail` sets where the rail runs: at the start
 *   with the words before it sized to their content, in the centre with both sides taking an equal
 *   share, or at the end. The connector draws the rail down its item as a hairline, and the last
 *   item's rail stops at its indicator unless the timeline is `ongoing`. The indicator is a circle
 *   on the icon scale, 16, 20, 24 and 32px from `sm` to `xl`, opaque and ringed in `bg.panel`, so
 *   the rail never runs through it. A one-line title is as tall as the indicator and centred on it.
 *   The indicators are marks in a list rather than a box a reader acts on, so the timeline offers
 *   no `effect` axis.
 */

import {
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
const CLASS = "timeline";

/**
 * Custom property the root sets to the indicator's side, which the rail's column reads.
 */
export const INDICATOR = "--timeline-indicator";

/**
 * Custom property the root sets to the room between the rail and the words.
 */
const GAP = "--timeline-gap";

/**
 * Custom property the root sets to the room below each entry's words.
 */
const SPACE = "--timeline-space";

/**
 * Sizes the timeline offers.
 */
const SIZES = ["sm", "md", "lg", "xl"] as const;

/**
 * Describes one size's gaps and text styles.
 */
interface Metric {
  /**
   * Text style of the description.
   */
  readonly description: string;

  /**
   * Step of the gap scale between the rail and the words.
   */
  readonly gap: string;

  /**
   * Text style of a number in the indicator.
   */
  readonly mark: string;

  /**
   * Step of the gap scale below each entry's words.
   */
  readonly space: string;

  /**
   * Text style of the title.
   */
  readonly title: string;
}

/**
 * Maps each size to its gaps on the gap scale and to the text styles of its parts.
 *
 * @remarks
 *   The words are 8, 12, 12 and 16px from the rail and the entries 12, 16, 24 and 24px apart at the
 *   foundation's metrics.
 */
const METRICS: Readonly<Record<(typeof SIZES)[number], Metric>> = {
  lg: { description: "body.sm", gap: "lg", mark: "label.sm", space: "2xl", title: "label.md" },
  md: { description: "body.xs", gap: "lg", mark: "label.xs", space: "xl", title: "label.sm" },
  sm: { description: "body.xs", gap: "md", mark: "label.xs", space: "lg", title: "label.xs" },
  xl: { description: "body.md", gap: "xl", mark: "label.md", space: "2xl", title: "label.lg" },
};

/**
 * Styles a neutral timeline with solid indicators at the middle size, the rail at the start.
 */
export const recipe = defineSlotRecipe({
  base: {
    connector: {
      "&::before": {
        borderColor: "border",
        borderInlineStartWidth: "hairline",
        content: '""',
        insetBlock: "0",
        insetInlineStart: "50%",
        marginInlineStart: "calc({borderWidths.hairline} / -2)",
        position: "absolute",
      },
      alignItems: "flex-start",
      display: "flex",
      gridColumn: "2",
      justifyContent: "center",
      position: "relative",
    },
    content: {
      [`&:has(+ .${CLASS}__connector)`]: {
        [`& > .${CLASS}__title`]: { justifyContent: "flex-end" },
        alignItems: "flex-end",
        paddingInlineEnd: `var(${GAP})`,
        paddingInlineStart: "0",
        textAlign: "end",
      },
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.xs}"),
      minInlineSize: "0",
      paddingBlockEnd: `var(${SPACE})`,
      paddingInlineStart: `var(${GAP})`,
    },
    description: { color: "fg.muted", minInlineSize: "0" },
    indicator: {
      "& > svg": { blockSize: "60%", inlineSize: "60%" },
      alignItems: "center",
      backgroundColor: "bg.panel",
      blockSize: `var(${INDICATOR})`,
      borderRadius: "full",
      display: "inline-flex",
      flexShrink: "0",
      fontVariantNumeric: "tabular-nums",
      inlineSize: `var(${INDICATOR})`,
      justifyContent: "center",
      lineHeight: "1",
      outlineColor: "bg.panel",
      outlineStyle: "solid",
      outlineWidth: "control",
      position: "relative",
    },
    item: {
      [`&:last-child > .${CLASS}__connector::before`]: { display: "none" },
      [`&:last-child > .${CLASS}__content`]: { paddingBlockEnd: "0" },
      display: "grid",
      gridColumn: "1 / -1",
      gridTemplateColumns: "subgrid",
    },
    root: {
      display: "grid",
      listStyle: "none",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
    title: {
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      gap: "0.375em",
      minBlockSize: `var(${INDICATOR})`,
    },
  },
  className: CLASS,
  defaultVariants: { palette: "neutral", rail: "start", size: "md", variant: "solid" },
  jsx: [/^Timeline\.\w+$/u],
  slots: ["root", "item", "connector", "indicator", "content", "title", "description"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Whether the run is still going, which draws the rail past the last indicator.
     */
    ongoing: {
      true: {
        item: {
          [`&:last-child > .${CLASS}__connector::before`]: { display: "block" },
          [`&:last-child > .${CLASS}__content`]: { paddingBlockEnd: `var(${SPACE})` },
        },
      },
    },
    palette: onSlot("root", paletteVariants()),

    /**
     * Where the rail runs, and how the words on either side of it share the width.
     */
    rail: {
      center: {
        root: { gridTemplateColumns: `minmax(0, 1fr) var(${INDICATOR}) minmax(0, 1fr)` },
      },
      end: { root: { gridTemplateColumns: `minmax(0, 1fr) var(${INDICATOR}) auto` } },
      start: { root: { gridTemplateColumns: `auto var(${INDICATOR}) minmax(0, 1fr)` } },
    },

    /**
     * The indicator's side and the text styles of the words and the marks.
     */
    size: onSlots({
      description: sizeVariants((size) => ({ textStyle: METRICS[size].description }), SIZES),
      indicator: sizeVariants((size) => ({ textStyle: METRICS[size].mark }), SIZES),
      root: sizeVariants(
        (size) => ({
          [GAP]: dense(`{spacing.gap.${METRICS[size].gap}}`),
          [INDICATOR]: dense(`{sizes.icon.${size}}`),
          [SPACE]: dense(`{spacing.gap.${METRICS[size].space}}`),
        }),
        SIZES,
      ),
      title: sizeVariants((size) => ({ textStyle: METRICS[size].title }), SIZES),
    }),
    variant: onSlot("indicator", flatVariants(["solid", "subtle", "outline", "plain"])),
  },
});
