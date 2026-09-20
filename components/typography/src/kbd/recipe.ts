/**
 * States what a key is: a key a reader is asked to press, drawn as a keycap in a look and a size,
 * in the palette of its status.
 *
 * @remarks
 *   Every value is a label role, a semantic control height, a semantic inset, a layer style or a
 *   palette, so a theme moves all of them. The raised look is written from tokens by hand, because
 *   no layer style draws a keycap: a fill edged at the control's width with a foot at the
 *   indicator's is what reads as a key rather than as a word. The other looks come from the
 *   foundation's layer styles.
 */

import {
  defineRecipe,
  dense,
  flatVariants,
  statusEmitted,
  statusVariants,
} from "@stealthscale/theme/authoring";

/**
 * Draws a keycap on the neutral palette, raised and in the middle size until a caller says
 * otherwise, set in the mono face so a key reads as what it is.
 */
export const recipe = defineRecipe({
  base: {
    alignItems: "center",
    borderRadius: "l1",
    colorPalette: "neutral",
    display: "inline-flex",
    fontFamily: "mono",
    fontWeight: "medium",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  className: "kbd",
  defaultVariants: { size: "md", variant: "raised" },
  jsx: [/Kbd$/u],
  staticCss: [statusEmitted()],
  variants: {
    size: {
      lg: {
        height: dense("{sizes.control.md}"),
        paddingInline: dense("{spacing.inset.sm}"),
        textStyle: "label.md",
      },
      md: {
        height: dense("{sizes.control.sm}"),
        paddingInline: dense("{spacing.inset.xs}"),
        textStyle: "label.sm",
      },
      sm: {
        height: dense("{sizes.control.xs}"),
        paddingInline: dense("{spacing.inset.xs}"),
        textStyle: "label.xs",
      },
    },
    status: statusVariants(),
    variant: {
      ...flatVariants(["outline", "subtle", "plain"]),
      raised: {
        background: "colorPalette.subtle",
        borderBlockEndWidth: "indicator",
        borderColor: "colorPalette.muted",
        borderWidth: "control",
        color: "colorPalette.fg",
      },
    },
  },
});
