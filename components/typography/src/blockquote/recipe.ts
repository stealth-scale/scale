/**
 * Slot recipe for the blockquote, covering its four slots and five variant axes.
 *
 * @remarks
 *   No value here is a literal: every one resolves to a text style, a semantic spacing token, a
 *   palette role, a layer style or an animation style, so a theme swap moves the whole component
 *   without an edit to this file. The icon slot sets colour only. Sizing the mark is the icon
 *   component's job, and declaring a size here would fight its recipe at the same specificity.
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
 * The size steps, shared by the `body` text styles and the semantic spacing scale so that one
 * variant value can index both.
 */
const STEPS = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Defines the blockquote's slots and variants. Unset, a blockquote renders on the neutral palette
 * as a `subtle` rule down the leading edge, at `md`, aligned to the start, and without motion.
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
     * Moves the content's text style and the root's gap and leading inset together, so the rule
     * stays proportional to the type at every step.
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
