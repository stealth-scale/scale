/**
 * Styles a keycap's look, size and palette.
 *
 * @remarks
 *   A keycap sits in a line of text, so its height reads the tag scale: 19.2, 21.6 and 24px at
 *   `sm`, `md` and `lg` at the foundation's metrics, against 24px lines of body text. Its minimum
 *   width equals its height and its text is centred, so a one-character key is square. The face is
 *   the body face, because the theme's monospace stack renders `⌘` from a fallback font shorter
 *   than the letters beside it. `staticCss` lists every palette, because `Kbd.Group` and data can
 *   set the value at run time.
 */

import {
  below,
  defineRecipe,
  dense,
  flatVariants,
  PALETTES,
  paletteVariants,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Size of a keycap.
 */
type KeySize = "lg" | "md" | "sm";

/**
 * Maps each size to the gap token of the inline padding: 4, 4 and 6px at the foundation's metrics.
 */
const PAD: Readonly<Record<KeySize, string>> = { lg: "sm", md: "xs", sm: "xs" };

/**
 * Returns the height, minimum width, inline padding and text style of a keycap at one size.
 *
 * @remarks
 *   The height is the tag one size smaller and the label one size smaller, so a keycap is a mark
 *   in a line of text and not a control.
 */
function keySize(size: KeySize): SystemStyleObject {
  const height = dense(`{sizes.tag.${below(size)}}`);

  return {
    height,
    minInlineSize: height,
    paddingInline: dense(`{spacing.gap.${PAD[size]}}`),
    textStyle: `label.${below(size)}`,
  };
}

/**
 * Defaults to the raised look at `md` in the neutral palette.
 */
export const recipe = defineRecipe({
  base: {
    alignItems: "center",
    borderRadius: "l1",
    colorPalette: "neutral",
    display: "inline-flex",
    flexShrink: "0",
    fontFamily: "body",
    fontWeight: "medium",
    justifyContent: "center",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  className: "kbd",
  defaultVariants: { size: "md", variant: "raised" },
  jsx: [/^Kbd\.(?:Root|Group)$/u],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Semantic palette of the fill, the edge and the text.
     */
    palette: paletteVariants(),

    /**
     * Height, minimum width, inline padding and text style.
     */
    size: sizeVariants(keySize, ["sm", "md", "lg"]),

    /**
     * Look of the keycap.
     *
     * @remarks
     *   `raised` is a keycap: the subtle fill, a hairline edge in `colorPalette.muted` and a 2px
     *   bottom edge in `colorPalette.border`. The other looks read the `flat` layer styles.
     *   `subtle` has no edge, so it draws a `CanvasText` hairline in forced colours.
     */
    variant: {
      ...flatVariants(["outline", "plain"]),
      raised: {
        background: "colorPalette.subtle",
        borderBlockEndColor: "colorPalette.border",
        borderBlockEndWidth: "indicator",
        borderColor: "colorPalette.muted",
        borderWidth: "control",
        color: "colorPalette.fg",
      },
      subtle: {
        _highContrast: {
          outlineColor: "CanvasText",
          outlineOffset: "calc({borderWidths.hairline} * -1)",
          outlineStyle: "solid",
          outlineWidth: "hairline",
        },
        layerStyle: "flat.subtle",
      },
    },
  },
});
