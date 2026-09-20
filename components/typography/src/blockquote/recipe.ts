/**
 * States what a blockquote is: a quotation with a mark beside it and a caption under it, set off
 * from the page by a rule down its leading edge or by a pane of glass, in a size, in the palette
 * of its status, entering with a motion where a page wants one.
 *
 * @remarks
 *   Every value is a body role, a semantic gap, a semantic inset, a palette role, a layer style or
 *   an animation style, so a theme moves all of them. The root takes the variants and every part
 *   draws its slot in them. The icon slot states the mark's colour and nothing of its size,
 *   because the mark is the icon component, and its own recipe sizes it.
 */

import {
  defineSlotRecipe,
  dense,
  motionVariants,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
  statusVariants,
} from "@stealthscale/theme/authoring";

/**
 * The steps a quotation is read at.
 */
const STEPS = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Draws a quotation on the neutral palette in the subtle look and the middle size until a caller
 * says otherwise, lined up on its leading edge, with no motion until a caller asks for one.
 */
export const recipe = defineSlotRecipe({
  base: {
    caption: { color: "fg.muted", textStyle: "caption" },
    content: { fontStyle: "italic" },
    icon: { flexShrink: "0" },
    root: {
      colorPalette: "neutral",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    },
  },
  className: "blockquote",
  defaultVariants: { justify: "start", size: "md", variant: "subtle" },
  jsx: [/^Blockquote(\.\w+)?$/u],
  slots: ["root", "content", "caption", "icon"],
  staticCss: [statusEmitted()],
  variants: {
    justify: {
      start: { root: { alignItems: "flex-start", textAlign: "start" } },

      center: { root: { alignItems: "center", textAlign: "center" } },

      end: { root: { alignItems: "flex-end", textAlign: "end" } },
    },
    motion: onSlot("root", motionVariants(["rise", "reveal"])),
    /**
     * How loud the quotation is, on the five steps the body role offers.
     */
    size: onSlots({
      content: sizeVariants((size) => ({ textStyle: `body.${size}` }), STEPS),
      root: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          paddingInlineStart: dense(`{spacing.inset.${size}}`),
        }),
        STEPS,
      ),
    }),

    status: onSlot("root", statusVariants()),
    variant: {
      glass: {
        icon: { color: "colorPalette.solid" },
        root: { borderRadius: "l2", layerStyle: "glass", padding: dense("{spacing.inset.md}") },
      },
      plain: {
        icon: { color: "colorPalette.solid" },
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
    },
  },
});
