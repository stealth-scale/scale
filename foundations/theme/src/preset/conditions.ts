/**
 * Adds the conditions a recipe switches on beyond the compiler's own: the color mode, the pointer,
 * the density, the folded screen, a toggle's states and the reader's preferences.
 *
 * @remarks
 *   The color mode is an attribute, like the theme, so a subtree can be switched on its own. Where
 *   no attribute is written the operating system's preference decides, so a page that writes
 *   nothing follows the reader's setting and a page that writes the attribute overrides it.
 *   Each mode is two blocks. The attribute block is written against an ancestor, which the
 *   compiler expands over a theme's own selector in all three positions, so the mode and the theme
 *   may be written on one element, on an ancestor or on a descendant. The preference block is
 *   anchored to the document root, because the compiler replaces the nesting selector with the
 *   theme's own and the default theme has none: a block written against the nesting selector alone
 *   compiles to a bare negation that matches every element, which declares the default theme's
 *   values over every switched subtree. Anchored, the preference declares them where the
 *   unconditioned values are declared, and a switched element declares over them.
 *   A color reads neither block. The stylesheet plugin renders every color stated in both modes
 *   as one `light-dark()` value, which the browser evaluates where the color is used against the
 *   `color-scheme` the global styles set from the attribute and the preference, so a subtree
 *   switched to either mode inside the other reads every color from its own mode. The two blocks
 *   here switch the styles a recipe states under `_dark` and `_light`.
 */

import { COLOR_MODE_ATTRIBUTE } from "#attributes.ts";
import { type ExtendableConditions } from "#pandacss.ts";

/**
 * Selects an element inside a subtree switched to dark mode.
 */
const DARK = `[${COLOR_MODE_ATTRIBUTE}=dark]`;

/**
 * Selects an element inside a subtree switched to light mode.
 */
const LIGHT = `[${COLOR_MODE_ATTRIBUTE}=light]`;

/**
 * Anchors a block to the document root, or to the host of a shadow tree.
 */
const ROOT = ":where(:root, :host)";

/**
 * Lists the states a control does not react in.
 */
const DISABLED = ":disabled, [data-disabled], [aria-disabled=true]";

/**
 * Describes a condition written as blocks rather than as one selector.
 */
type Block = Exclude<NonNullable<ExtendableConditions["extend"]>[string], string>;

/**
 * Writes a mode as its two blocks: the attribute above, on or below the element, or the preference
 * at the document root outside a subtree that states the other mode.
 */
function mode(own: string, other: string, scheme: "dark" | "light"): Block {
  return {
    [`@media (prefers-color-scheme: ${scheme})`]: {
      [`${ROOT}:not(${other}, ${other} *) &`]: "@slot",
    },
    [`${own} &`]: "@slot",
  };
}

/**
 * Lists the conditions the foundation adds to the compiler's.
 */
export const conditions: ExtendableConditions = {
  extend: {
    active: `&:is(:active, [data-active]):not(${DISABLED}, [data-state=open])`,

    comfortable: "[data-density=comfortable] &",

    compact: "[data-density=compact] &",

    dark: mode(DARK, LIGHT, "dark"),

    hover: {
      "@media (hover: hover)": {
        [`&:is(:hover, [data-hover]):not(${DISABLED})`]: "@slot",
      },
    },

    invalid: "&:is(:user-invalid, [data-invalid], [aria-invalid=true])",

    light: mode(LIGHT, DARK, "light"),

    mouse: "@media (pointer: fine)",

    narrow: "[data-narrow] &",

    off: "&[data-state=off]",

    on: "&[data-state=on]",

    pinned: "&[data-pinned]",

    reducedTransparency: "@media (prefers-reduced-transparency: reduce)",

    touch: "@media (pointer: coarse)",
  },
};
