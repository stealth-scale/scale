/**
 * Defines the styles a switch is drawn with.
 *
 * @remarks
 *   Four parts. The root is the label the whole control sits in, the control is the track, the
 *   thumb is the knob that slides along it, and the label is the words beside it.
 *   The track reads the theme's field fragment, so its edge, its hover and its invalid state are
 *   the ones every field in the same form is drawn with. Three of the fragment's rules are
 *   restated. The ring is drawn outside, because a ring inside a track this short covers the thumb.
 *   The surface is the muted one rather than the panel, because the thumb is drawn on the panel and
 *   a thumb on a panel track is invisible. The coarse-pointer height is dropped and `touchTarget`
 *   widens the target instead, which leaves the drawn track alone.
 *   The geometry comes from three scales and one rule. The track is `control` wide and `tag` tall,
 *   which hold the same ratio at every step because both read the control shares. The thumb fills
 *   the track's content box as a square, so the inset is the track's padding and nothing states the
 *   thumb's size. The travel is the track's width less its height, which is what the thumb has left
 *   to cross whatever the padding is. The size axis writes it into a property and the thumb reads
 *   it, so one rule moves the thumb and the scales decide how far.
 */

import {
  cornerVariants,
  defineSlotRecipe,
  dense,
  field,
  fieldStatusVariants,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
  touchTarget,
} from "@stealthscale/theme/authoring";

/**
 * The property the track states the distance the thumb crosses in, which the thumb reads.
 *
 * @remarks
 *   The distance is positive and the thumb crosses it the way the page runs. `translate` is a
 *   physical property with no logical form, so the direction is reversed where the page runs
 *   right to left: a checked thumb travelling the same way there left the track's far edge by
 *   nine pixels.
 */
const TRAVEL = "--switch-travel";

/**
 * Draws a filled switch at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: {
      ...field(),
      ...touchTarget(),
      alignItems: "center",
      background: "bg.muted",
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
      background: "bg.panel",
      blockSize: "full",
      borderRadius: "inherit",
      boxShadow: "sm",
      transitionDuration: "press",
      transitionProperty: "translate, background, box-shadow",
      transitionTimingFunction: "press",
    },
  },
  className: "switch",
  defaultVariants: { align: "center", radius: "full", size: "md", variant: "solid" },
  jsx: [/^Switch(\.\w+)?$/u],
  slots: ["root", "control", "thumb", "label"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Where the track sits against a label that runs to more than one line.
     */
    align: {
      start: { root: { alignItems: "flex-start" } },

      center: { root: { alignItems: "center" } },
    },

    radius: onSlot("control", cornerVariants(["l1", "l2", "full"])),

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
     * Whether the track sits at the far end of the row rather than beside its words.
     *
     * @remarks
     *   A row that pushes the track to the far end takes the width it is given, which a row packed
     *   at the start does not, so the value states the width with the distribution.
     */
    spread: { true: { root: { inlineSize: "full", justifyContent: "space-between" } } },

    status: onSlot("control", fieldStatusVariants()),

    /**
     * How the track is drawn resting and once the switch is on.
     *
     * @remarks
     *   No value writes a border color, so a status always reaches the edge. The three differ in
     *   the layer style the palette fills the track with once it is on.
     */
    variant: onSlot("control", {
      solid: { _checked: { layerStyle: "fill.solid" } },

      subtle: { _checked: { layerStyle: "fill.subtle" } },

      outline: { _checked: { layerStyle: "outline.solid" }, background: "transparent" },
    }),
  },
});
