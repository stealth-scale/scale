/**
 * Styles a container: a maximum inline size, centred in its parent, with a gutter on each side.
 *
 * @remarks
 *   Every value reads a width token or a semantic inset, so a theme that changes the width scale
 *   changes every container. The gutter is in the base, because a page sets it once, and `flush`
 *   removes it. `prose` is `60ch`, so it follows the theme's body face. The recipe has no
 *   `palette` or `effect` axis, because a container renders no box of its own.
 */

import { defineRecipe, dense, widthSizes } from "@stealthscale/theme/authoring";

/**
 * Defaults to the `3xl` width, 768px, with the `lg` inset, 20px, as the gutter.
 */
export const recipe = defineRecipe({
  base: { inlineSize: "full", marginInline: "auto", paddingInline: dense("{spacing.inset.lg}") },
  className: "container",
  defaultVariants: { size: "3xl" },
  jsx: [/^Container$/u],
  variants: {
    /**
     * Removes the gutter, so the content reaches both inline edges.
     */
    flush: { true: { paddingInline: "0" } },

    /**
     * Maximum inline size: a width token from `xs` to `8xl`, `full` or `prose`.
     */
    size: { ...widthSizes(), full: { maxInlineSize: "full" }, prose: { maxInlineSize: "prose" } },
  },
});
