/**
 * Defines the styles a command palette is drawn with.
 *
 * @remarks
 *   Seven parts. The root is the panel, the control is the band holding the field and the mark
 *   beside it, the list is what scrolls, the empty line stands where nothing matches, and a
 *   shortcut is the keystroke drawn at the end of a row.
 *   The rows themselves are the listbox's. A palette is a field owning a list, so the list, its
 *   rows and the highlight moving over them all come from that component and this one restyles
 *   none of them.
 *   The field carries no edge of its own. The panel is the edge, and a second one drawn round a
 *   field that fills the panel's width reads as a box inside a box.
 */

import {
  defineSlotRecipe,
  dense,
  divider,
  onSlots,
  sizeVariants,
  surface,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Draws a raised palette at the middle size.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: {
      ...divider("horizontal"),
      "--focus-ring-color": `var(--focus-ring-color-prop, var(--global-color-focus-ring, #005FCC))`,
      "&:has(:focus-visible)": {
        outlineColor: "var(--focus-ring-color)",
        outlineOffset: "0",
        outlineStyle: "var(--focus-ring-style, solid)",
        outlineWidth: "ring",
      },
      alignItems: "center",
      display: "flex",
      flexShrink: "0",
      focusRingColor: "colorPalette.focusRing",
    },
    empty: { color: "fg.muted", textAlign: "center" },
    indicator: { alignItems: "center", color: "fg.muted", display: "inline-flex", flexShrink: "0" },
    input: {
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      color: "fg",
      flex: "1",
      minInlineSize: "0",
      outline: "none",
    },
    list: { minBlockSize: "0", overflowY: "auto" },
    root: { ...surface("lg"), display: "flex", flexDirection: "column", overflow: "clip" },
    shortcut: {
      ...truncate(),
      borderColor: "border",
      borderWidth: "hairline",
      color: "fg.muted",
      flexShrink: "0",
      marginInlineStart: "auto",
    },
  },
  className: "command",
  defaultVariants: { size: "md" },
  jsx: [/^Command(\.\w+)?$/u],
  slots: ["root", "control", "indicator", "input", "list", "empty", "shortcut"],
  variants: {
    size: onSlots({
      control: sizeVariants(
        (size) => ({
          blockSize: dense(`{sizes.control.${size}}`),
          gap: dense(`{spacing.gap.${size}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
        }),
        ["sm", "md", "lg"],
      ),
      empty: sizeVariants(
        (size) => ({ padding: dense(`{spacing.inset.${size}}`), textStyle: `body.${size}` }),
        ["sm", "md", "lg"],
      ),
      indicator: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.icon.${size}}`) }),
        ["sm", "md", "lg"],
      ),
      input: sizeVariants((size) => ({ textStyle: `body.${size}` }), ["sm", "md", "lg"]),
      list: sizeVariants(
        (size) => ({ padding: dense(`{spacing.inset.${size}}`) }),
        ["sm", "md", "lg"],
      ),
      shortcut: sizeVariants(
        (size) => ({
          borderRadius: "l1",
          paddingInline: dense(`{spacing.gap.${size}}`),
          textStyle: `label.${size}`,
        }),
        ["sm", "md", "lg"],
      ),
    }),
  },
});
