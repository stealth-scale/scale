/**
 * Styles an icon's size, text ink, motion and mirroring.
 *
 * @remarks
 *   Every value reads an icon size token, a foreground token or an animation style. The component
 *   ships no artwork: a caller passes paths as children or an icon component through `as`, such as
 *   `as={StarIcon}` from `lucide-react`. The `inherit` size is `1em`, so an icon beside text is the
 *   height of the text. The recipe has no `palette` axis, because an icon takes a text ink, and no
 *   `effect` axis, because an icon renders no box.
 */

import {
  defineRecipe,
  iconSizes,
  motionVariants,
  toneVariants,
} from "@stealthscale/theme/authoring";

/**
 * Defaults to the `inherit` size in the current colour, with no motion.
 *
 * @remarks
 *   An `svg` without a `fill` attribute fills with the current colour, because the browser fills a
 *   path with no fill in black. An `svg` that sets `fill`, such as a lucide icon with
 *   `fill="none"`, keeps its own value.
 */
export const recipe = defineRecipe({
  base: {
    "&:not([fill])": { fill: "currentcolor" },
    color: "currentcolor",
    display: "inline-block",
    flexShrink: "0",
    verticalAlign: "middle",
  },
  className: "icon",
  defaultVariants: { size: "inherit" },
  jsx: [/Icon$/u],
  variants: {
    /**
     * Mirrors the icon in a right-to-left page, for an icon that points, such as an arrow.
     *
     * @remarks
     *   The value sets `scale` and not `transform`, because the `spin` motion animates `transform`
     *   and would override it.
     */
    mirrored: {
      true: { _rtl: { scale: "-1 1" } },
    },

    /**
     * Motion. Each value reads the theme's animation style of the same name.
     */
    motion: motionVariants(["float", "spin", "twinkle"]),

    /**
     * Box size from the icon scale, or `1em` at `inherit`.
     */
    size: { ...iconSizes(), inherit: { boxSize: "1em" } },

    /**
     * Foreground token of the icon.
     *
     * @remarks
     *   The values are the text inks, and `current` is the current colour, which is the default.
     */
    tone: {
      ...toneVariants(),

      current: { color: "currentcolor" },
    },
  },
});
