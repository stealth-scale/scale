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
  statusEmitted,
  statusVariants,
} from "@stealthscale/theme/authoring";

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
      center: { root: { alignItems: "center", textAlign: "center" } },
      end: { root: { alignItems: "flex-end", textAlign: "end" } },
      start: { root: { alignItems: "flex-start", textAlign: "start" } },
    },
    motion: onSlot("root", motionVariants(["rise", "reveal"])),
    size: {
      lg: {
        content: { textStyle: "body.lg" },
        root: { gap: dense("{spacing.gap.lg}"), paddingInlineStart: dense("{spacing.inset.lg}") },
      },
      md: {
        content: { textStyle: "body.md" },
        root: { gap: dense("{spacing.gap.md}"), paddingInlineStart: dense("{spacing.inset.md}") },
      },
      sm: {
        content: { textStyle: "body.sm" },
        root: { gap: dense("{spacing.gap.sm}"), paddingInlineStart: dense("{spacing.inset.sm}") },
      },
      xl: {
        content: { textStyle: "body.xl" },
        root: { gap: dense("{spacing.gap.xl}"), paddingInlineStart: dense("{spacing.inset.xl}") },
      },
      xs: {
        content: { textStyle: "body.xs" },
        root: { gap: dense("{spacing.gap.xs}"), paddingInlineStart: dense("{spacing.inset.xs}") },
      },
    },
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
