/**
 * Recipe for the hover card: a panel beside a link that previews what the link leads to, with an
 * arrow.
 *
 * @remarks
 *   The machine has no root part. The recipe adds a root with `display: contents`, because the
 *   trigger and the positioner are siblings and a slot recipe passes its variants from an element
 *   above both. The machine writes the positioner's position inline, so the recipe sets no
 *   position. The trigger reads `link()` and is underlined at rest, because the link ink alone
 *   measures 1.64:1 against body text in light mode and 1.38:1 in dark mode on the ink theme, under
 *   the 3:1 that WCAG technique G183 asks for. The panel slides in from the trigger's side, which
 *   it reads from `data-placement`. It is at most `sizes.xs` wide, or as wide as the room the
 *   machine measures on its side of the trigger, `--available-width`, where that is less. The
 *   recipe has no `palette` axis, because every look uses a neutral surface, and no `effect` axis,
 *   because a panel is not a control.
 */

import {
  defineSlotRecipe,
  dense,
  link,
  motion,
  onSlot,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Steps of the size axis.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * Defines the hover card recipe: the surface look at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    arrow: { "--arrow-background": "var(--hover-card-surface)", "--arrow-size": "sizes.icon.sm" },
    arrowTip: { borderInlineStartWidth: "hairline", borderTopWidth: "hairline" },
    content: {
      ...motion("slide-fade.in", "slide-fade.out"),
      display: "flex",
      flexDirection: "column",
      maxInlineSize: "min({sizes.xs}, var(--available-width, {sizes.xs}))",
      position: "relative",
      zIndex: "popover",
    },
    positioner: { position: "relative" },
    root: { display: "contents" },
    trigger: { ...link(), borderRadius: "l1", textDecoration: "underline" },
  },
  className: "hover-card",
  defaultVariants: { size: "md", variant: "surface" },
  jsx: [/^HoverCard(\.\w+)?$/u],
  slots: ["root", "trigger", "positioner", "content", "arrow", "arrowTip"],
  variants: {
    /**
     * Padding of the panel on the inset scale and its text on the body role.
     */
    size: onSlot(
      "content",
      sizeVariants(
        (size) => ({ padding: dense(`{spacing.inset.${size}}`), textStyle: `body.${size}` }),
        SIZES,
      ),
    ),

    /**
     * Surface of the panel: the popover surface inside a hairline edge, the panel surface with a
     * large shadow, or the glass layer style.
     *
     * @remarks
     *   The elevated panel has a transparent hairline edge, which forced colors paint in
     *   `CanvasText`, so the panel keeps its outline where the shadow is not drawn.
     */
    variant: {
      elevated: {
        arrowTip: { borderColor: "var(--hover-card-surface)" },
        content: {
          "--hover-card-surface": "colors.bg.panel",
          background: "var(--hover-card-surface)",
          borderColor: "transparent",
          borderRadius: "l3",
          borderStyle: "solid",
          borderWidth: "hairline",
          boxShadow: "xl",
        },
      },
      glass: {
        arrowTip: { borderColor: "border" },
        content: {
          "--hover-card-surface": "colors.bg.popover",
          borderRadius: "l3",
          layerStyle: "glass",
        },
      },
      surface: {
        arrowTip: { borderColor: "border" },
        content: {
          "--hover-card-surface": "colors.bg.popover",
          background: "var(--hover-card-surface)",
          borderColor: "border",
          borderRadius: "l3",
          borderWidth: "hairline",
          boxShadow: "lg",
        },
      },
    },
  },
});
