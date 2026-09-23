/**
 * Styles the command palette as a raised panel with a query bar above a scrolling list.
 *
 * @remarks
 *   The rows are deliberately absent. A palette is a combobox owning a listbox, so the rows, their
 *   roles and the active-option highlight all belong to the listbox component and nothing here
 *   restyles them. The query field carries no border of its own, because the panel already draws
 *   one and a second border around a field spanning the full width reads as a box inside a box. The
 *   focus ring is applied to the bar rather than to the field, using `:has(:focus-visible)`, so the
 *   ring surrounds the field and its glyph together. The control that empties the query sits at the
 *   end of the same bar and is drawn as a mark rather than as a button: the bar is one field to a
 *   reader, and a second raised control inside it would read as a thing to press rather than as a
 *   way out of what they had typed.
 *   The bar draws the one rule under it. The field brings a band of its own, which draws a rule as
 *   well, and that band starts after the glyph and stops before the panel's edge: the two rules
 *   sat on the same line and the stretch they shared came out a shade darker than the rest. That
 *   band is also what takes the width the glyph and the control at the end leave. It is as wide as
 *   the field inside it otherwise, which is a text field's own twenty characters, so on a bar
 *   wider than that the control that empties the query sat against the typing rather than at the
 *   bar's end. The band inside the bar is the one element there that is a `div`, so the bar states
 *   both without naming another recipe's class.
 *   The list keeps no room at either end. The rows are already inset from the panel's edge by the
 *   room the list leaves round them, so a palette that stated a second inset of its own put every
 *   row three steps in from the panel and drew far larger than a palette should.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  divider,
  interactive,
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
    clear: {
      ...interactive(),
      _hover: { color: "fg" },
      alignItems: "center",
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      color: "fg.muted",
      cursor: "button",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      padding: "0",
    },
    control: {
      ...divider("horizontal"),
      "--focus-ring-color": `var(--focus-ring-color-prop, var(--global-color-focus-ring, #005FCC))`,
      "&:has(:focus-visible)": {
        outlineColor: "var(--focus-ring-color)",
        outlineOffset: "0",
        outlineStyle: "var(--focus-ring-style, solid)",
        outlineWidth: "ring",
      },
      "& > div": { borderBlockEndWidth: "0", flex: "1", minInlineSize: "0" },
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
  slots: ["root", "control", "indicator", "input", "clear", "list", "empty", "shortcut"],
  variants: {
    size: onSlots({
      clear: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.icon.${size}}`) }),
        ["sm", "md", "lg"],
      ),
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
        (size) => ({ paddingBlock: dense(`{spacing.gap.${below(size)}}`), paddingInline: "0" }),
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
