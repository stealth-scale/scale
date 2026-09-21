/**
 * Declares the slot recipe the alert is styled from.
 *
 * @remarks
 *   Six slots: `root` is the container, `indicator` holds the icon, `content` groups `title` and
 *   `description`, and `aside` holds trailing controls. `status` switches `colorPalette` and
 *   nothing else, which keeps it orthogonal to `variant` and `size`, lets a warning and an error
 *   share one set of generated styles, and lets a theme retint every alert at once. Severity is
 *   never encoded in colour alone, because WCAG 1.4.1 rejects a distinction a reader who cannot
 *   separate two reds is unable to resolve. `variant` maps to the `flat` layer styles, whose fill
 *   and foreground are the token pairs the contrast gate measures, and the indicator inherits from
 *   the root so that a `solid` alert draws its icon in the foreground measured against its fill.
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
  statusVariants,
} from "@stealthscale/theme/authoring";

/**
 * Lists the three size steps an alert offers, shared by the icon and by the root's spacing scale.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Styles an alert, defaulting to a subtle informational notice at the middle size.
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
  staticCss: [statusEmitted(), { status: ["neutral"] }],
  variants: {
    /**
     * The edge that carries a rule in the palette's solid colour. Unset by default.
     *
     * @remarks
     *   Each value selects one of the theme's three `indicator.*` layer styles, which paint a
     *   pseudo-element along the named edge. The theme ships all three and no component reached
     *   them until this variant existed. The rule takes the palette's solid token, so `status`
     *   colours it and a theme swap moves it. `end` is a logical edge: it resolves to the right
     *   under left-to-right writing and to the left under right-to-left.
     */
    edge: {
      top: { root: { layerStyle: "indicator.top" } },

      bottom: { root: { layerStyle: "indicator.bottom" } },

      end: { root: { layerStyle: "indicator.end" } },
    },

    /**
     * Whether the content slot stacks the title above the description or wraps both onto a shared
     * baseline.
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
     * The severity of the alert. It selects `colorPalette` and affects nothing else.
     */
    status: {
      ...onSlot("root", statusVariants()),

      neutral: { root: { colorPalette: "neutral" } },
    },

    /**
     * The fill treatment that separates the alert from the surface behind it.
     */
    variant: onSlot("root", flatVariants()),
  },
});
