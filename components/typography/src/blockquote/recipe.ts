/**
 * Styles a block quotation's root, content, caption and icon: look, palette, size, alignment and
 * entrance motion.
 *
 * @remarks
 *   The root is a grid. At `justify="start"` a root that holds an icon puts the icon in a start
 *   gutter beside the quotation and the caption, and at `center` and `end` the icon sits above
 *   them. The root reads the body text style of its size and the icon's font size is `1lh`, so the
 *   icon, at its default `1em`, is one line of the quotation tall at every size. `staticCss` lists
 *   every palette, because data can set the value at run time. The recipe has no `effect` axis,
 *   because a glow or a pulse would compete with the text of a quotation.
 */

import {
  defineSlotRecipe,
  dense,
  motionVariants,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Size steps, shared by the body text style and the spacing scale.
 */
const STEPS = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Maps each size to the gap token one step larger: 6, 8, 12, 16 and 24px at the foundation's
 * metrics.
 */
const WIDER: Readonly<Record<(typeof STEPS)[number], string>> = {
  lg: "xl",
  md: "lg",
  sm: "md",
  xl: "2xl",
  xs: "sm",
};

/**
 * Selects a root that holds an icon.
 */
const MARKED = "&:has(> .blockquote__icon)";

/**
 * Defaults to the subtle look at `md`, aligned to the start, in the neutral palette.
 */
export const recipe = defineSlotRecipe({
  base: {
    caption: { color: "fg.muted", gridColumn: "-2 / -1", textStyle: "caption" },
    content: { gridColumn: "-2 / -1", textWrap: "pretty" },
    icon: { fontSize: "1lh" },
    root: {
      alignContent: "start",
      colorPalette: "neutral",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr)",
      position: "relative",
    },
  },
  className: "blockquote",
  defaultVariants: { justify: "start", size: "md", variant: "subtle" },
  jsx: [/^Blockquote(\.\w+)?$/u],
  slots: ["root", "content", "caption", "icon"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Inline alignment of the parts and their text.
     *
     * @remarks
     *   `start` puts an icon in a start gutter that spans the quotation and the caption. `center`
     *   and `end` put the icon above the quotation.
     */
    justify: {
      start: {
        icon: { gridColumn: "1", gridRow: "1 / span 2" },
        root: {
          justifyItems: "start",
          [MARKED]: { gridTemplateColumns: "auto minmax(0, 1fr)" },
          textAlign: "start",
        },
      },

      center: { root: { justifyItems: "center", textAlign: "center" } },

      end: { root: { justifyItems: "end", textAlign: "end" } },
    },

    /**
     * Entrance animation of the root. Each value reads the theme's animation style of the same
     * name.
     */
    motion: onSlot("root", motionVariants(["rise", "reveal"])),

    /**
     * Semantic palette of the rule, the fill and the icon.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Body text style of the quotation, the gap between the parts one step larger than the size,
     * and the start padding inside the rule.
     */
    size: onSlots({
      root: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${WIDER[size]}}`),
          paddingInlineStart: dense(`{spacing.inset.${size}}`),
          textStyle: `body.${size}`,
        }),
        STEPS,
      ),
    }),

    /**
     * Look of the root and the icon.
     *
     * @remarks
     *   `subtle` and `solid` render a rule down the start edge in `colorPalette.muted` and
     *   `colorPalette.solid`. `surface` fills the root with `colorPalette.subtle`, renders the
     *   solid rule and rounds the end corners. `glass` renders the theme's glass surface. `plain`
     *   renders no rule and no start padding.
     */
    variant: {
      glass: {
        icon: { color: "colorPalette.solid" },
        root: { borderRadius: "l2", layerStyle: "glass", padding: dense("{spacing.inset.md}") },
      },
      plain: {
        icon: { color: "colorPalette.solid" },
        root: { paddingInlineStart: "0" },
      },
      solid: {
        icon: { color: "colorPalette.solid" },
        root: {
          borderInlineStartColor: "colorPalette.solid",
          borderInlineStartWidth: "lg",
        },
      },
      subtle: {
        icon: { color: "colorPalette.fg" },
        root: {
          borderInlineStartColor: "colorPalette.muted",
          borderInlineStartWidth: "lg",
        },
      },
      surface: {
        icon: { color: "colorPalette.solid" },
        root: {
          background: "colorPalette.subtle",
          borderEndEndRadius: "l2",
          borderInlineStartColor: "colorPalette.solid",
          borderInlineStartWidth: "lg",
          borderStartEndRadius: "l2",
          padding: dense("{spacing.inset.lg}"),
        },
      },
    },
  },
});
