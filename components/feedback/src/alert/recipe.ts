/**
 * Defines the styles an alert is drawn with.
 *
 * @remarks
 *   Six parts. The root is the box, the indicator holds a mark, the content stacks the title and
 *   the description, and the aside holds whatever a reader acts on.
 *   The status picks the palette and nothing else, so one set of looks and sizes draws a warning
 *   and an error alike and a theme retints every alert at once. Colour never carries the status on
 *   its own: the indicator holds a mark and the title holds words, because an alert that said
 *   `error` in red alone would say nothing to a reader who cannot tell the two reds apart. WCAG
 *   1.4.1 fails a distinction drawn in colour alone.
 *   The looks read the `flat` layer styles, whose fill and ink are the palette pairs the contrast
 *   gate measures. The indicator takes no colour of its own and reads the root's, so a solid alert
 *   marks itself in the ink the gate measured against that fill.
 */

import {
  cornerVariants,
  defineSlotRecipe,
  dense,
  flatVariants,
  iconSizes,
  motionVariants,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
} from "@stealthscale/theme/authoring";

/**
 * The steps an alert offers, which are the three a notice is read at.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Draws a subtle alert about something worth knowing, at the middle size, until a caller says
 * otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    aside: { alignItems: "center", display: "flex", flex: "0 0 auto" },
    content: { display: "flex", flex: "1", minInlineSize: "0" },
    description: { color: "inherit" },
    indicator: { alignItems: "center", display: "inline-flex", flex: "0 0 auto" },
    root: { alignItems: "flex-start", display: "flex", inlineSize: "full" },
    title: { fontWeight: "medium" },
  },
  className: "alert",
  defaultVariants: {
    layout: "stacked",
    radius: "l3",
    size: "md",
    status: "info",
    variant: "subtle",
  },
  jsx: [/^Alert(\.\w+)?$/u],
  slots: ["root", "indicator", "content", "title", "description", "aside"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Whether the title and the description stack or run together on one line.
     */
    layout: {
      inline: {
        content: { alignItems: "baseline", columnGap: dense("{spacing.gap.xs}"), flexWrap: "wrap" },
      },
      stacked: { content: { flexDirection: "column", rowGap: dense("{spacing.gap.xs}") } },
    },

    motion: onSlot("root", motionVariants(["fade", "rise", "reveal"])),
    radius: onSlot("root", cornerVariants()),

    size: onSlots({
      indicator: iconSizes(SIZES),
      root: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          padding: dense(`{spacing.inset.${size}}`),
          textStyle: `body.${size}`,
        }),
        SIZES,
      ),
    }),

    /**
     * What the alert is about, which picks the palette and nothing else.
     */
    status: {
      error: { root: { colorPalette: "error" } },
      info: { root: { colorPalette: "info" } },
      neutral: { root: { colorPalette: "neutral" } },
      success: { root: { colorPalette: "success" } },
      warning: { root: { colorPalette: "warning" } },
    },

    /**
     * How the alert is set off from the page.
     */
    variant: onSlot("root", flatVariants()),
  },
});
