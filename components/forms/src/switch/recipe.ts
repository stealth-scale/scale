/**
 * Recipe for the switch: a row that contains the track, its thumb and the label.
 *
 * @remarks
 *   Four slots: the root is the `label` the row renders in, the control is the track, the thumb is
 *   the knob inside the track, and the label is the text. The track reads the theme's field
 *   fragment, so its edge, hover and invalid state match every text field in the form. Two rules
 *   differ from the fragment. The focus ring renders outside, because a ring inside the track
 *   covers the thumb. The coarse-pointer height is dropped, and `touchTarget` widens the target to
 *   a `control.md` square without changing the track. The off thumb takes the edge color, which
 *   the theme's contrast gate measures at 3:1 or more against `bg.panel` and `bg.subtle`, the
 *   surfaces a track rests on. The track is `control` wide and `tag` tall, and the thumb fills its
 *   content box as a square, so the track's padding is the thumb's inset. The palette axis offers
 *   the four palettes that are not
 *   statuses, because the class name leaves out the axis and a palette and a status of one name
 *   would write one class. The status axis is declared after it and overrides it. The recipe has
 *   no `effect` axis, because a glow or a pulse on a 20px track competes with the focus ring.
 */

import {
  cornerVariants,
  defineSlotRecipe,
  dense,
  field,
  FIELD_EDGE,
  fieldStatusVariants,
  onSlot,
  onSlots,
  paletteVariants,
  sizeVariants,
  statusEmitted,
  type SystemStyleObject,
  touchTarget,
} from "@stealthscale/theme/authoring";

/**
 * Palettes the palette axis offers: the ones that are not statuses.
 */
const HUES = ["primary", "secondary", "accent", "neutral"] as const;

/**
 * Custom property the track sets to the distance the thumb travels, and the thumb reads.
 *
 * @remarks
 *   The distance is the track's width less its height. `translate` has no logical form, so a
 *   checked thumb in a right-to-left row translates by the negated distance.
 */
const TRAVEL = "--switch-travel";

/**
 * Returns a thumb look that fills a checked thumb with a palette role, and with `CanvasText` under
 * forced colors.
 *
 * @remarks
 *   Forced colors replace every fill, so a checked thumb opts out of the adjustment and takes the
 *   text color. A filled thumb reads as on and an empty one as off, apart from their position.
 */
function checkedThumb(background: string): SystemStyleObject {
  return {
    _checked: {
      _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
      background,
    },
  };
}

/**
 * Defines the switch recipe: a solid track at size `md` in the primary palette by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: {
      ...field(),
      ...touchTarget(),
      alignItems: "center",
      display: "inline-flex",
      flexShrink: 0,
      focusVisibleRing: "outside",
      padding: dense("{spacing.gap.xs}"),
    },
    label: { _disabled: { layerStyle: "disabled" }, color: "fg", userSelect: "none" },
    root: {
      _disabled: { layerStyle: "disabled" },
      cursor: "button",
      display: "inline-flex",
      userSelect: "none",
    },
    thumb: {
      _checked: { _rtl: { translate: `calc(var(${TRAVEL}) * -1)` }, translate: `var(${TRAVEL})` },
      _highContrast: {
        borderColor: "ButtonText",
        borderStyle: "solid",
        borderWidth: "control",
      },
      _motionReduce: { transitionDuration: "0s" },
      aspectRatio: "square",
      background: `var(${FIELD_EDGE})`,
      blockSize: "full",
      borderRadius: "inherit",
      boxShadow: "sm",
      transitionDuration: "press",
      transitionProperty: "translate, background, box-shadow",
      transitionTimingFunction: "press",
    },
  },
  className: "switch",
  defaultVariants: {
    align: "center",
    palette: "primary",
    radius: "full",
    size: "md",
    variant: "solid",
  },
  jsx: [/^Switch(\.\w+)?$/u],
  slots: ["root", "control", "thumb", "label"],
  staticCss: [statusEmitted(), { palette: [...HUES] }],
  variants: {
    /**
     * Position of the track against a label that runs to more than one line.
     *
     * @remarks
     *   `start` puts the track on the first line, `center` halfway down the text.
     */
    align: {
      start: { root: { alignItems: "flex-start" } },

      center: { root: { alignItems: "center" } },
    },

    /**
     * Palette the track fills with while checked: primary, secondary, accent or neutral. A status
     * color comes from the status axis.
     */
    palette: onSlot("control", paletteVariants(HUES)),

    /**
     * Corner radius of the track. The thumb inherits it.
     */
    radius: onSlot("control", cornerVariants(["l1", "l2", "full"])),

    /**
     * Track size, text size and gap. The track reads the control scale for its width and the tag
     * scale for its height. It writes the difference to `--switch-travel`, the distance a checked
     * thumb translates.
     */
    size: onSlots({
      control: sizeVariants(
        (size) => ({
          blockSize: dense(`{sizes.tag.${size}}`),
          inlineSize: dense(`{sizes.control.${size}}`),
          [TRAVEL]: `calc({sizes.control.${size}} - {sizes.tag.${size}})`,
        }),
        ["sm", "md", "lg"],
      ),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), ["sm", "md", "lg"]),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), ["sm", "md", "lg"]),
    }),

    /**
     * Whether the row takes the width it is given and puts the track at the far end.
     */
    spread: { true: { root: { inlineSize: "full", justifyContent: "space-between" } } },

    /**
     * Status the switch reports. Each value sets the edge, the off thumb and the palette, over the
     * palette axis.
     */
    status: onSlot("control", fieldStatusVariants()),

    /**
     * Surface of the track at rest and while checked, and the thumb's fill on it.
     *
     * @remarks
     *   No value writes a border color, so a status sets the edge in every look. A solid track
     *   rests on the panel, a subtle one on `bg.subtle` and an outline one on the surface around
     *   it. The off thumb reads the field's edge color in every look. A checked solid track takes
     *   the palette's solid fill and a thumb in its contrast ink. A checked subtle or outline track
     *   is near the page's lightness, so its thumb takes the palette's solid fill.
     */
    variant: onSlots({
      control: {
        solid: { _checked: { layerStyle: "fill.solid" } },

        subtle: { _checked: { layerStyle: "fill.subtle" }, background: "bg.subtle" },

        outline: { _checked: { layerStyle: "outline.solid" }, background: "transparent" },
      },
      thumb: {
        solid: checkedThumb("colorPalette.contrast"),

        subtle: checkedThumb("colorPalette.solid"),

        outline: checkedThumb("colorPalette.solid"),
      },
    }),
  },
});
