/**
 * Recipe for the segment group: a track of options a person chooses one of, and a thumb that
 * slides to the checked option.
 *
 * @remarks
 *   Four slots: the root is the track, the indicator is the thumb, each item is the `label` an
 *   option renders in, and the item text is the option's words. The machine measures the checked
 *   item into `--left`, `--top`, `--width` and `--height`, and the thumb reads all four, so it
 *   covers the item in either orientation and in either direction. The track is a control's height
 *   at every size: its padding and its edge come off the items, which never go under the 24px
 *   target floor. The track is as wide as its items in a flex or grid parent that stretches its
 *   children, and a fitted track fills its container. Items abut, and a hairline at an item's start
 *   separates two options when neither is checked. The focus ring is drawn inside the item's edge,
 *   over the thumb, and in the contrast ink on a solid thumb. The thumb slides at the theme's move
 *   pace and jumps under reduced motion. Until the machine measures, which covers a server render,
 *   a checked item renders the thumb's fill itself. The recipe has no `effect` axis, because the
 *   thumb moves on every choice and a glow would move with it.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  interactive,
  onSlot,
  PALETTES,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the group is offered at.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Room between the track's edge and the items.
 */
const PAD = "{spacing.0.5}";

/**
 * Corner of the items and the thumb, concentric with the track's corner.
 */
const INNER = `calc({radii.l2} - ${PAD} - {borderWidths.control})`;

/**
 * Returns the height of an item at one size: the control height less the track's padding and edge
 * on both sides, and never under the 24px target floor.
 */
function inner(size: (typeof SIZES)[number]): string {
  return `max({sizes.6}, calc(${dense(`{sizes.control.${size}}`)} - (${PAD} + {borderWidths.control}) * 2))`;
}

/**
 * Defines the segment group recipe: a surface thumb on a muted track at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    indicator: {
      _disabled: { layerStyle: "disabled" },
      _motionReduce: { "--transition-duration": "0s" },
      "--transition-duration": "{durations.move}",
      "--transition-timing-function": "{easings.move}",
      borderRadius: INNER,
      height: "var(--height)",
      left: "var(--left)",
      pointerEvents: "none",
      top: "var(--top)",
      width: "var(--width)",
    },
    item: {
      ...interactive(),
      _before: {
        _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
        background: "border",
        content: '""',
        position: "absolute",
        transitionDuration: "move",
        transitionProperty: "opacity",
        transitionTimingFunction: "move",
      },
      _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
      _horizontal: {
        _before: {
          insetBlock: "{spacing.1.5}",
          insetInlineStart: "0",
          width: "{borderWidths.hairline}",
        },
      },
      _vertical: {
        _before: {
          height: "{borderWidths.hairline}",
          insetBlockStart: "0",
          insetInline: "{spacing.1.5}",
        },
      },
      "&:is(:first-of-type, [data-state=checked])": { _before: { opacity: "0" } },
      "&:not([data-disabled])": { _hover: { color: "fg" } },
      "&[data-state=checked] + &": { _before: { opacity: "0" } },
      "& > svg": { flexShrink: "0" },
      alignItems: "center",
      borderRadius: INNER,
      color: "fg.muted",
      display: "inline-flex",
      focusVisibleRing: "inside",
      justifyContent: "center",
      minInlineSize: "0",
      position: "relative",
      whiteSpace: "nowrap",
    },
    itemText: {
      minInlineSize: "0",
      overflowX: "clip",
      overflowY: "visible",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    root: {
      _invalid: { borderColor: "border.error" },
      _vertical: { flexDirection: "column" },
      background: "bg.muted",
      blockSize: "fit",
      borderColor: "transparent",
      borderRadius: "l2",
      borderWidth: "control",
      display: "inline-flex",
      inlineSize: "fit",
      maxInlineSize: "full",
      padding: PAD,
      verticalAlign: "middle",
    },
  },
  className: "segment-group",
  compoundVariants: [
    /**
     * Squares every item of an iconic group and removes its inline padding, so the icon is centred.
     *
     * @remarks
     *   The rule is a compound because the size axis writes the padding, and the compiler emits it
     *   after the iconic axis in the same cascade layer.
     */
    {
      css: { item: { aspectRatio: "square", paddingInline: "0" } },
      iconic: true,
      name: "squared",
    },

    /**
     * Fills the thumb with `Highlight` and sets the checked item's words in `HighlightText` under
     * forced colors, where every look's fill gives way to the system colors.
     *
     * @remarks
     *   The rule is a compound because each look writes the thumb's fill and the checked words'
     *   color, and the compiler emits the looks in a later cascade layer than the base.
     */
    {
      css: {
        indicator: { _highContrast: { background: "Highlight", forcedColorAdjust: "none" } },
        item: {
          _highContrast: { _checked: { color: "HighlightText", forcedColorAdjust: "none" } },
        },
      },
      name: "forced-thumb",
      variant: ["solid", "surface", "outline"],
    },
  ],
  defaultVariants: {
    palette: "primary",
    size: "md",
    variant: "surface",
  },
  jsx: [/^SegmentGroup(\.\w+)?$/u],
  slots: ["root", "indicator", "item", "itemText"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Whether the group fills the width of its container and its items share it equally.
     */
    fitted: {
      true: {
        item: { _horizontal: { flex: "1 1 0" } },
        root: { display: "flex", inlineSize: "full" },
      },
    },

    /**
     * Whether every item shows its icon alone, with the words kept for assistive technology.
     */
    iconic: {
      true: { item: { "& > :not(svg)": { srOnly: true } } },
    },

    /**
     * Palette of the solid and outline thumbs and of the focus ring, set on the root.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Item height, text size, inset and gap. The track's height is the control height of the same
     * name, the words read the label role, and the inset, the gap and a leading icon read the step
     * below.
     */
    size: onSlot(
      "item",
      sizeVariants(
        (size) => ({
          "& > svg": { boxSize: dense(`{sizes.icon.${below(size)}}`) },
          gap: dense(`{spacing.gap.${below(size)}}`),
          height: inner(size),
          paddingInline: dense(`{spacing.inset.${below(size)}}`),
          textStyle: `label.${size}`,
        }),
        SIZES,
      ),
    ),

    /**
     * Surface of the track and fill of the thumb.
     *
     * @remarks
     *   `solid` fills the thumb with the palette's solid, `surface` raises a panel-colored thumb
     *   with a hairline edge off the muted track, and `outline` draws the track's edge in the field
     *   edge color and tints the thumb with the palette's subtle fill. A checked item takes the ink
     *   that goes with its thumb. On a solid thumb the ring is inset one ring width further, so the
     *   solid fill is on both sides of the contrast ink.
     */
    variant: {
      solid: {
        indicator: { background: "colorPalette.solid" },
        item: {
          _checked: {
            _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -2)" },
            color: "colorPalette.contrast",
            focusRingColor: "colorPalette.contrast",
          },
          "&[data-ssr]": { _checked: { background: "colorPalette.solid" } },
        },
      },

      surface: {
        indicator: { background: "bg.panel", borderColor: "border", borderWidth: "hairline" },
        item: {
          _checked: { color: "fg" },
          "&[data-ssr]": { _checked: { background: "bg.panel" } },
        },
      },

      outline: {
        indicator: { background: "colorPalette.subtle" },
        item: {
          _checked: { color: "colorPalette.fg" },
          "&[data-ssr]": { _checked: { background: "colorPalette.subtle" } },
        },
        root: {
          _invalid: { borderColor: "border.error" },
          background: "transparent",
          borderColor: "border.emphasized",
        },
      },
    },
  },
});
