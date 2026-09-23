/**
 * Declares the alert slot recipe: a notice with a leading icon, a title, a description, trailing
 * controls and a close trigger.
 *
 * @remarks
 *   `status` sets `colorPalette` and nothing else, so it combines freely with `variant` and `size`
 *   and a theme retints every alert through the palettes. The title states the severity in words,
 *   because WCAG 1.4.1 rejects a status told by color alone. `variant` reads the `flat.*` layer
 *   styles, whose fill and ink are the pairs the contrast gate measures. The indicator and the
 *   close trigger inherit the root's ink, so a solid alert draws both in the contrast ink. The
 *   recipe has no `effect` axis, because `motion` already animates the root and `edge` already
 *   paints its pseudo-element.
 */

import {
  cornerVariants,
  defineSlotRecipe,
  dense,
  flatVariants,
  iconSizes,
  interactive,
  motionVariants,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
  statusVariants,
  touchTarget,
} from "@stealthscale/theme/authoring";

/**
 * Sizes of the icon box and the root's gap, inset and text style.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Alert slot recipe, a subtle info notice at the md size by default.
 *
 * @remarks
 *   The indicator, the content and the trailing controls are centred on the whole notice. An
 *   icon pinned to the first line of a three-line notice stood apart from the text below it.
 */
export const recipe = defineSlotRecipe({
  base: {
    aside: { alignItems: "center", display: "flex", flex: "0 0 auto" },

    /**
     * The close trigger is a square of 1.5em, at least 24px, with a 1em glyph. A negative end
     * margin of half the box less the glyph puts the glyph on the padding edge, level with the
     * indicator at the start. Without it the glyph measured 20px from the end at `md` against the
     * indicator's 16px from the start. Its focus ring is drawn inside, because a ring outside it
     * falls on the alert's fill.
     */
    closeTrigger: {
      ...interactive(),
      ...touchTarget(),
      _hover: { background: "colorPalette.emphasized" },
      "& > svg": { boxSize: "1em" },
      alignItems: "center",
      appearance: "none",
      background: "transparent",
      borderRadius: "l1",
      borderStyle: "none",
      boxSize: "max({sizes.6}, 1.5em)",
      color: "currentcolor",
      display: "inline-flex",
      flex: "0 0 auto",
      focusVisibleRing: "inside",
      justifyContent: "center",
      marginInlineEnd: "calc((1em - max({sizes.6}, 1.5em)) / 2)",
      padding: "0",
    },
    content: { display: "flex", flex: "1", minInlineSize: "0" },
    description: { color: "inherit" },
    indicator: {
      "& > svg": { boxSize: "100%" },
      alignItems: "center",
      display: "inline-flex",
      flex: "0 0 auto",
    },
    /**
     * The root draws a hairline outline in forced colors. The solid, subtle and plain looks have
     * no border, and with their fills replaced the alert read as loose text next to a cross.
     */
    root: {
      _highContrast: {
        outlineColor: "CanvasText",
        outlineOffset: "calc({borderWidths.hairline} * -1)",
        outlineStyle: "solid",
        outlineWidth: "hairline",
      },
      alignItems: "center",
      display: "flex",
      inlineSize: "full",
    },
    title: { fontWeight: "medium" },
  },
  className: "alert",
  compoundVariants: [
    /**
     * The close trigger on a solid alert hovers to a tint of the contrast ink and draws its focus
     * ring in the contrast ink. The `emphasized` role is lighter than the solid fill, and the
     * `focusRing` role is as dark as it.
     */
    {
      css: {
        closeTrigger: {
          _hover: { background: "colorPalette.contrast/20" },
          focusRingColor: "colorPalette.contrast",
        },
      },
      name: "contrasted",
      variant: "solid",
    },
  ],
  defaultVariants: {
    layout: "stacked",
    radius: "l3",
    size: "md",
    status: "info",
    variant: "subtle",
  },
  jsx: [/^Alert(\.\w+)?$/u],
  slots: ["root", "indicator", "content", "title", "description", "aside", "closeTrigger"],
  staticCss: [statusEmitted(), { status: ["neutral"] }],
  variants: {
    /**
     * The edge that carries a rule in the palette's solid color. Unset by default.
     *
     * @remarks
     *   Each value reads one of the theme's `indicator.*` layer styles, which paint a
     *   pseudo-element along that edge. `end` is logical: the right edge in a left-to-right
     *   document and the left edge in a right-to-left one.
     */
    edge: {
      top: { root: { layerStyle: "indicator.top" } },

      bottom: { root: { layerStyle: "indicator.bottom" } },

      end: { root: { layerStyle: "indicator.end" } },
    },

    /**
     * Whether the title sits above the description or on the same line with it.
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
     * The severity of the alert. It sets `colorPalette` and nothing else.
     */
    status: {
      ...onSlot("root", statusVariants()),

      neutral: { root: { colorPalette: "neutral" } },
    },

    /**
     * The fill and edge of the alert, from the `flat.*` layer styles.
     */
    variant: onSlot("root", flatVariants()),
  },
});
