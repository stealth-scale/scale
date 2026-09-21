/**
 * Styles the command palette as a raised panel with a query bar above a scrolling list.
 *
 * @remarks
 *   The rows are deliberately absent. A palette is a combobox owning a listbox, so the rows, their
 *   roles and the active-option highlight all belong to the listbox component and nothing here
 *   restyles them. The query field carries no border of its own, because the panel already draws
 *   one and a second border around a field spanning the full width reads as a box inside a box.
 *   The focus ring is applied to the bar rather than to the field, using `:has(:focus-visible)`, so
 *   the ring surrounds the field and its glyph together.
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
 * The `command` slot recipe over its seven slots, medium by default.
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
