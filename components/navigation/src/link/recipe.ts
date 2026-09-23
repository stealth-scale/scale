/**
 * Declares the link recipe, which renders an inline anchor in the theme's link ink with an
 * underline at rest or on hover.
 *
 * @remarks
 *   The ink, the visited ink, the cursor and the focus ring come from `link()`, so a theme that
 *   restates `fg.link` restyles every link. The root is `inline-flex` with centred items, so an
 *   icon next to the text centres on the text instead of standing on the baseline. The recipe has
 *   no `effect` axis, because a link has no box for a glow or a pulse to surround. `staticCss`
 *   lists every palette, because `LinkPropsProvider` can set the value at run time.
 */

import { axis, defineRecipe, dense, link, PALETTES } from "@stealthscale/theme/authoring";

/**
 * Link recipe, underlined at rest by default.
 */
export const recipe = defineRecipe({
  base: {
    ...link(),
    alignItems: "center",
    borderRadius: "l1",
    display: "inline-flex",
    gap: dense("{spacing.gap.xs}"),
  },
  className: "link",
  defaultVariants: { variant: "underline" },
  jsx: [/^Link$/u],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Whether the link inherits the text color in place of the link ink.
     *
     * @remarks
     *   Use it for a card title or a brand name, where the context already marks the text as a
     *   link. The hover underline and the focus ring still apply. A `palette` set on the same link
     *   takes precedence, because the compiler emits the palette axis after this one.
     */
    inherit: { true: { _visited: { color: "inherit" }, color: "inherit" } },

    /**
     * The semantic palette the ink and the focus ring read from.
     *
     * @remarks
     *   Each value sets `colorPalette` and writes the ink from the palette's `fg` role, visited
     *   state included. Without a palette the link keeps `fg.link`, which a theme can restate
     *   apart from `accent.fg`.
     */
    palette: axis(PALETTES, (palette) => ({
      _visited: { color: "colorPalette.fg" },
      color: "colorPalette.fg",
      colorPalette: palette,
    }))(),

    /**
     * Whether the underline shows at rest or only on hover.
     *
     * @remarks
     *   `underline` is the default. Without an underline a link in running text differs from the
     *   text only by ink, and the link ink measured 1.64:1 against body text on the ink theme,
     *   under the 3:1 that WCAG technique G183 asks for. `plain` is for a link whose context marks
     *   it: a card title, a navigation row, a brand name. `plain` restates the hover underline,
     *   because its `none` is in the variants layer and overrides the base `_hover` rule.
     */
    variant: {
      plain: { _hover: { textDecoration: "underline" }, textDecoration: "none" },
      underline: { textDecoration: "underline" },
    },
  },
});
