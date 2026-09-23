/**
 * Declares the slot recipe of the tag, a short label with an optional mark at either end and a
 * button that removes it.
 *
 * @remarks
 *   The looks are the flat layer styles the badge uses, so a tag does not repaint under a pointer.
 *   The close trigger is the one control in it, with the focus ring from `interactive()` and a
 *   touch target from `touchTarget()`, because the tag's height is under the 24px WCAG 2.5.8
 *   floor at the smaller sizes. The root does not shrink in a flex row, so a row of tags wraps
 *   instead of cutting every label. With shrinking, three tags at `xl` measured as `led…`, `pay…`
 *   and `archi…`. The root is capped at its container's width, and the label truncates with an
 *   ellipsis when the tag reaches that cap. Marks and the close glyph are sized in `em`, so they
 *   follow the label.
 */

import {
  below,
  cornerVariants,
  defineSlotRecipe,
  dense,
  flatVariants,
  interactive,
  onSlot,
  PALETTES,
  paletteVariants,
  sizeVariants,
  touchTarget,
} from "@stealthscale/theme/authoring";

/**
 * Selects one of the four sizes a tag offers.
 */
type Step = "lg" | "md" | "sm" | "xl";

/**
 * Maps each tag size to the gap token of its inline padding: 6px, 8px, 8px and 12px at the
 * foundation's metrics.
 *
 * @remarks
 *   The tag scale's inset, which the badge uses, measured 12px at `md` on a 24px tag, and 20px at
 *   `xl`. A tag with a mark then had as much room at its ends as the mark was wide.
 */
const PAD: Readonly<Record<Step, string>> = { lg: "md", md: "md", sm: "sm", xl: "lg" };

/**
 * Maps each tag size to the gap token between its parts: 4px at `sm` and `md`, 6px at `lg` and
 * `xl`. The gap one size smaller measured 6px at `md` and 12px at `xl` between a mark and the
 * label.
 */
const GAP: Readonly<Record<Step, string>> = { lg: "sm", md: "xs", sm: "xs", xl: "sm" };

/**
 * Styles the element at either end of the tag, which contains a mark.
 *
 * @remarks
 *   The element is pulled `0.125em` towards the tag's edge, because a mark's glyph has space inside
 *   its box and sat further from the edge than the label does.
 */
const ELEMENT = {
  "& > svg": { blockSize: "1em", inlineSize: "1em" },
  alignItems: "center",
  display: "inline-flex",
  flexShrink: "0",
};

/**
 * Styles a tag at the middle size, in the surface look and the neutral palette.
 */
export const recipe = defineSlotRecipe({
  base: {
    /**
     * The close trigger draws its focus ring inside its box, because a ring outside it fell on the
     * tag's own fill and could not be seen on a solid tag.
     */
    closeTrigger: {
      ...interactive(),
      ...touchTarget(),
      _hover: { background: "colorPalette.emphasized" },
      "& > svg": { blockSize: "0.875em", inlineSize: "0.875em" },
      alignItems: "center",
      appearance: "none",
      background: "transparent",
      blockSize: "1.25em",
      borderRadius: "l1",
      borderStyle: "none",
      color: "currentcolor",
      display: "inline-flex",
      flexShrink: "0",
      focusVisibleRing: "inside",
      inlineSize: "1.25em",
      justifyContent: "center",
      marginInlineEnd: "-0.25em",
      padding: "0",
    },
    endElement: { ...ELEMENT, marginInlineEnd: "-0.125em" },

    /**
     * The label is raised `0.1em` and clipped on the inline axis only.
     *
     * @remarks
     *   A centred line box put the text low in the tag: at `md` the lowercase x-height's centre
     *   measured 1.1px below the tag's centre, and the ink 1.6px below. At `lg` the descenders
     *   ended at the edge of the label's box, where `overflow: hidden` would cut them.
     */
    label: {
      minInlineSize: "0",
      overflowX: "clip",
      overflowY: "visible",
      textOverflow: "ellipsis",
      translate: "0 -0.1em",
      whiteSpace: "nowrap",
    },
    /**
     * The root draws a hairline outline in forced colors mode. The solid, subtle and plain looks
     * have no border, and with their fills replaced a tag read as loose text next to a cross.
     */
    root: {
      _highContrast: {
        outlineColor: "CanvasText",
        outlineOffset: "calc({borderWidths.hairline} * -1)",
        outlineStyle: "solid",
        outlineWidth: "hairline",
      },
      alignItems: "center",
      colorPalette: "neutral",
      display: "inline-flex",
      flexShrink: "0",
      maxInlineSize: "full",
      userSelect: "none",
      verticalAlign: "middle",
      whiteSpace: "nowrap",
    },
    startElement: { ...ELEMENT, marginInlineStart: "-0.125em" },
  },
  className: "tag",
  compoundVariants: [
    /**
     * The close trigger on a solid tag hovers to a tint of the contrast ink and draws its focus
     * ring in the contrast ink. `emphasized` is lighter than the solid fill and put the light cross
     * on a light square, and the `focusRing` role is as dark as the fill.
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
  defaultVariants: { radius: "l2", size: "md", variant: "surface" },
  jsx: [/^Tag\.\w+$/u],
  slots: ["root", "label", "startElement", "endElement", "closeTrigger"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * The halo around the tag, in the palette's solid at half opacity.
     *
     * @remarks
     *   `pulse` animates the halo and stops when the reader prefers reduced motion.
     */
    effect: onSlot("root", {
      glow: { layerStyle: "glow.sm" },
      pulse: { animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" },
    }),
    palette: onSlot("root", paletteVariants()),
    radius: onSlot("root", cornerVariants()),

    /**
     * The height on the tag scale, the label one size smaller, and the padding and gap from
     * `PAD` and `GAP`.
     */
    size: onSlot(
      "root",
      sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${GAP[size]}}`),
          height: dense(`{sizes.tag.${size}}`),
          paddingInline: dense(`{spacing.gap.${PAD[size]}}`),
          textStyle: `label.${below(size)}`,
        }),
        ["sm", "md", "lg", "xl"],
      ),
    ),
    variant: onSlot("root", flatVariants()),
  },
});
