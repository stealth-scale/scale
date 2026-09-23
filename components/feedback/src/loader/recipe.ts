/**
 * Declares the loader's slot recipe: a spinner beside its words, a spinner over content it hides,
 * and the overlay that covers a positioned container while it loads.
 *
 * @remarks
 *   With words, the root is an inline flex row, so the spinner and the words render on one line in
 *   any container. Over content, the root is an inline grid, and the hidden content and the
 *   spinner share its single cell. The spinner is centred on the content and the box has the
 *   content's size. The hidden content leaves the accessibility tree, so a visually hidden label
 *   replaces it. The loader has no box of its own and offers no `effect` axis. A caller who needs
 *   one passes a spinner with its own `effect`.
 */

import { axis, defineSlotRecipe, onSlot, PALETTES } from "@stealthscale/theme/authoring";

/**
 * The recipe's class name, used to build the selector from the root to the content.
 */
const CLASS = "loader";

/**
 * Writes the `palette` axis of the indicator: the palette's `solid` as the spinner's ink.
 *
 * @remarks
 *   The spinner inside is at `current`, so it draws in the indicator's ink. Without a palette the
 *   indicator inherits the surrounding ink, which keeps the spinner readable on a solid button.
 */
const tinted = axis(PALETTES, (palette) => ({
  color: "colorPalette.solid",
  colorPalette: palette,
}));

/**
 * Styles the loader and its overlay, with a veiled overlay by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: { gridArea: "1 / 1", visibility: "hidden" },
    indicator: { alignItems: "center", display: "inline-flex", gridArea: "1 / 1" },
    label: { srOnly: true },
    overlay: {
      alignItems: "center",
      borderRadius: "inherit",
      display: "flex",
      gap: "gap.sm",
      inset: "0",
      justifyContent: "center",
      position: "absolute",
    },
    root: {
      [`&:has(> .${CLASS}__content)`]: { display: "inline-grid", placeItems: "center" },
      alignItems: "center",
      display: "inline-flex",
      gap: "0.5em",
      verticalAlign: "middle",
    },
  },
  className: CLASS,
  defaultVariants: { scrim: "veil" },
  jsx: [/^Loader(Overlay)?$/u],
  slots: ["root", "indicator", "content", "label", "overlay"],
  variants: {
    /**
     * The spinner's ink, as a palette's `solid` role.
     */
    palette: onSlot("indicator", tinted()),

    /**
     * The fill of the overlay over the content it covers.
     *
     * @remarks
     *   `veil` fills the overlay with the panel color at 80% opacity. The covered content shows
     *   through it faintly, and the spinner and its words have contrast against it. `glass` blurs
     *   the content behind a 70% panel fill. `none` sets no fill.
     */
    scrim: onSlot("overlay", {
      glass: { layerStyle: "glass" },
      none: { background: "transparent" },
      veil: { background: "bg.panel/80" },
    }),
  },
});
