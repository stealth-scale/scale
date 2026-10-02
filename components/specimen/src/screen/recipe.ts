/**
 * Styles the screen box, the window an application or a page renders in.
 *
 * @remarks
 *   The box has a hairline edge and the theme's `l2` corners, and fills with the panel surface, so
 *   a page in it reads white and its sticky bands show their own fill. It clips its content to the
 *   corners.
 *   `contain: layout` makes the box the containing block of a `position: fixed` descendant, so a
 *   narrow shell's sheet opens inside the box. The size sets the height to a named size, from 20rem
 *   at `xs` to 36rem at `xl`, for a shell that fills its window. It sets
 *   `--app-shell-window-height` to the height inside the two hairlines, so a shell and its sheet
 *   end at the box's lower edge. Without a size the box is as tall as its content, for a page.
 *   `scrolls` fills the box with the scroll area the box renders, whose viewport is the scroll
 *   container of a shell that scrolls the window.
 */

import { defineRecipe, type Scale, sizeVariants } from "@stealthscale/theme/authoring";

/**
 * Custom property an application's shell reads as the height of its window.
 */
export const WINDOW_HEIGHT = "--app-shell-window-height";

/**
 * Selects the root of the scroll area a box that scrolls renders.
 */
export const SCROLLER = "& > .scroll-area__root";

/**
 * Selects the viewport of the scroll area a box that scrolls renders.
 */
export const VIEWPORT = "& > .scroll-area__root > .scroll-area__viewport";

/**
 * Heights the box offers, from the theme's named sizes.
 */
const HEIGHTS: readonly Scale[] = ["xs", "sm", "md", "lg", "xl"];

/**
 * Defines the screen recipe, an edged box as tall as its content by default.
 */
export const recipe = defineRecipe({
  base: {
    background: "bg.panel",
    borderColor: "border",
    borderRadius: "l2",
    borderWidth: "hairline",
    color: "fg",
    contain: "layout",
    display: "block",
    inlineSize: "full",
    overflow: "clip",
  },
  className: "screen",
  jsx: [/^Screen$/u],
  variants: {
    /**
     * Whether the box scrolls its content, for a shell that scrolls the window.
     */
    scrolls: {
      true: { [SCROLLER]: { blockSize: "full" }, [VIEWPORT]: { overscrollBehavior: "contain" } },
    },

    /**
     * Height of the box, which the shell inside it reads as its window's height.
     */
    size: sizeVariants(
      (size) => ({
        blockSize: size,
        [WINDOW_HEIGHT]: `calc({sizes.${size}} - {borderWidths.hairline} * 2)`,
      }),
      HEIGHTS,
    ),
  },
});
