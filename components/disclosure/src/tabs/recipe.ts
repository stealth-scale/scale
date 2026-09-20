/**
 * States what a set of tabs is: one strip of controls, and the panel each of them shows.
 *
 * @remarks
 *   Five parts. The root frames the whole, the list is the strip, a trigger is one tab, the content
 *   is a panel, and the indicator is the bar that slides under the tab in force.
 *   Which way the set runs is the machine's, not an axis of its own. It writes the orientation onto
 *   every part, and the compiler ships a condition that reads it, so the strip turns into a column
 *   and the indicator moves to its inline edge without a caller stating anything twice.
 *   The indicator is positioned from custom properties the machine measures, so the recipe states
 *   its thickness and its colour and never its place.
 */

import {
  controlSizes,
  defineSlotRecipe,
  dense,
  insetSizes,
  interactive,
  justifyVariants,
  onSlot,
  onSlots,
} from "@stealthscale/theme/authoring";

/**
 * Fixes the box an indicator that fills the tab in force takes: the width and the height the
 * machine measured the tab at.
 *
 * @remarks
 *   The machine writes the measurements as properties on the indicator and leaves it to the
 *   recipe to take them. A line indicator takes one of the two and its own stroke for the other.
 *   A filled indicator takes both, because it stands behind the whole tab rather than along one
 *   edge of it, and one that took neither collapsed to nothing and left the selected tab unmarked.
 */
const FILLED = { height: "var(--height)", width: "var(--width)" };

/**
 * Draws a line of tabs at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: { _focusVisible: { focusVisibleRing: "outside" }, outline: "none" },
    indicator: { borderRadius: "l1", zIndex: "1" },
    list: {
      _horizontal: { flexDirection: "row" },
      _vertical: { flexDirection: "column" },
      display: "flex",
      position: "relative",
    },
    root: {
      _horizontal: { flexDirection: "column" },
      _vertical: { flexDirection: "row" },
      display: "flex",
      width: "full",
    },
    trigger: {
      ...interactive(),
      _disabled: { cursor: "disabled" },
      alignItems: "center",
      display: "inline-flex",
      justifyContent: "center",
      position: "relative",
      whiteSpace: "nowrap",
    },
  },
  className: "tabs",
  defaultVariants: { size: "md", variant: "line" },
  jsx: [/^Tabs(\.\w+)?$/u],
  slots: ["root", "list", "trigger", "content", "indicator"],
  variants: {
    /**
     * Whether the controls share the strip's width between them.
     */
    fitted: { true: { trigger: { flex: "1" } } },

    /**
     * Where the controls sit when they do not fill the strip.
     */
    justify: onSlot("list", justifyVariants()),

    /**
     * How much room the strip and the panel take.
     */
    size: onSlots({ content: insetSizes(), trigger: controlSizes() }),

    /**
     * How the strip is drawn, and what marks the tab in force.
     */
    variant: {
      enclosed: {
        indicator: {
          ...FILLED,
          background: "bg.panel",
          borderColor: "border",
          borderWidth: "hairline",
        },
        list: { background: "bg.muted", borderRadius: "l2", padding: dense("{spacing.inset.xs}") },
        trigger: {
          _selected: { color: "fg" },
          borderRadius: "l1",
          color: "fg.muted",
        },
      },
      line: {
        indicator: {
          _horizontal: { bottom: "0", height: "{borderWidths.indicator}", width: "var(--width)" },
          _vertical: {
            height: "var(--height)",
            insetInlineStart: "0",
            width: "{borderWidths.indicator}",
          },
          background: "colorPalette.solid",
        },
        list: {
          _horizontal: { borderBlockEndColor: "border", borderBlockEndWidth: "hairline" },
          _vertical: { borderInlineEndColor: "border", borderInlineEndWidth: "hairline" },
        },
        trigger: {
          _hover: { color: "fg" },
          _selected: { color: "colorPalette.fg" },
          color: "fg.muted",
        },
      },
      plain: {
        indicator: { display: "none" },
        trigger: { _selected: { color: "fg" }, color: "fg.muted" },
      },
      subtle: {
        indicator: { ...FILLED, background: "colorPalette.subtle", borderRadius: "l1" },
        trigger: { _selected: { color: "colorPalette.fg" }, color: "fg.muted" },
      },
    },
  },
});
