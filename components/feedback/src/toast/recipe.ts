/**
 * Recipe for the toast: a card raised into a corner of the window, with a mark, a title, a
 * description, an action and a close button.
 *
 * @remarks
 *   The machine places each toast in its region and writes the toast's motion as custom
 *   properties: `--x`, `--y`, `--scale`, `--opacity`, `--height` and `--z-index`. The root reads
 *   them and moves between them on the theme's `move` pace, and on the `leave` pace once it is
 *   dismissed. The toast's type sets `colorPalette`, `neutral` for `loading`, and the indicator
 *   renders the caller's glyph in the palette's solid. The root is at most `sizes.sm` wide and
 *   never wider than the window less the region's offsets. The recipe has no axes, because a
 *   toast has one look. A theme restyles it by extending the recipe.
 */

import { defineSlotRecipe, dense, interactive, touchTarget } from "@stealthscale/theme/authoring";

/**
 * Maps each type the machine writes on a toast to the palette the toast reads.
 */
const TYPES = {
  error: "error",
  info: "info",
  loading: "neutral",
  success: "success",
  warning: "warning",
};

/**
 * Size of the close trigger's box: 1.5em, and never less than the 24px a target needs.
 */
const CLOSE = "max({sizes.6}, 1.5em)";

/**
 * Defines the toast recipe.
 */
export const recipe = defineSlotRecipe({
  base: {
    actionTrigger: {
      ...interactive(),
      _hover: { background: "bg.muted" },
      alignItems: "center",
      alignSelf: "center",
      background: "transparent",
      borderColor: "border",
      borderRadius: "l2",
      borderStyle: "solid",
      borderWidth: "hairline",
      color: "fg",
      display: "inline-flex",
      flexShrink: "0",
      fontWeight: "medium",
      height: dense("{sizes.control.xs}"),
      paddingInline: dense("{spacing.inset.sm}"),
      textStyle: "label.sm",
    },

    /**
     * The close trigger centres on the first line of the title, and a negative end margin puts
     * its glyph on the root's padding edge.
     */
    closeTrigger: {
      ...interactive(),
      ...touchTarget(),
      _hover: { background: "bg.muted", color: "fg" },
      "& > svg": { boxSize: "1em" },
      alignItems: "center",
      background: "transparent",
      borderRadius: "l1",
      borderStyle: "none",
      boxSize: CLOSE,
      color: "fg.muted",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      marginBlock: `calc((1lh - ${CLOSE}) / 2)`,
      marginInlineEnd: `calc((1em - ${CLOSE}) / 2)`,
      padding: "0",
    },
    content: {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      gap: dense("{spacing.gap.xs}"),
      minInlineSize: "0",
    },
    description: { color: "fg.muted" },
    indicator: {
      "& > svg": { boxSize: "{sizes.icon.sm}" },
      alignItems: "center",
      blockSize: "1lh",
      color: "colorPalette.solid",
      display: "inline-flex",
      flexShrink: "0",
    },
    region: {},
    root: {
      ...Object.fromEntries(
        Object.entries(TYPES).map(([type, palette]) => [
          `&[data-type=${type}]`,
          { colorPalette: palette },
        ]),
      ),
      _closed: { transitionDuration: "leave", transitionTimingFunction: "leave" },
      _motionReduce: { transitionDuration: "0s" },
      alignItems: "flex-start",
      background: "bg.panel",
      borderColor: "border",
      borderRadius: "l3",
      borderStyle: "solid",
      borderWidth: "hairline",
      boxShadow: "lg",
      color: "fg",
      display: "flex",
      gap: dense("{spacing.gap.md}"),
      height: "var(--height)",
      inlineSize:
        "min({sizes.sm}, calc(100vw - var(--viewport-offset-left) - var(--viewport-offset-right)))",
      opacity: "var(--opacity)",
      padding: dense("{spacing.inset.md}"),
      scale: "var(--scale)",
      textStyle: "body.sm",
      transitionDuration: "move",
      transitionProperty: "translate, scale, opacity, height, box-shadow",
      transitionTimingFunction: "move",
      translate: "var(--x) var(--y)",
      willChange: "translate, opacity, scale",
      zIndex: "var(--z-index)",
    },
    title: { fontWeight: "medium" },
  },
  className: "toast",
  jsx: [/^Toast(\.\w+)?$/u],
  slots: [
    "region",
    "root",
    "indicator",
    "content",
    "title",
    "description",
    "actionTrigger",
    "closeTrigger",
  ],
});
