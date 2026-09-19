/**
 * Defines the styles a switcher is drawn with.
 *
 * @remarks
 *   A switcher names the thing a screen is showing and opens the list of what else it could show: a
 *   workspace, a project, an environment. The control carries a mark, the current thing's name over
 *   a detail, and the sign that there is a list behind it. Ten parts. The root is the control, and
 *   the mark, label, name, detail and indicator are what it holds. The content is the menu's panel,
 *   and an option is a row of things to switch between, holding its own text and the tick saying it
 *   is the current one. The control is the root because it is the only element the switcher draws
 *   itself. `Switcher.Root` wraps the menu, draws nothing and carries the variants, because the
 *   panel is placed outside the control in the document and a control holding the variants would
 *   leave every row with nothing to read. The rows are the menu's, drawn under slots of this
 *   recipe's own, because a row of things to switch between carries a mark and two lines of text
 *   where a menu's row carries neither. The name and the detail are cut short rather than wrapped,
 *   so the control keeps one height whatever the current thing is called.
 */

import {
  defineSlotRecipe,
  interactive,
  onSlot,
  onSlots,
  row,
  sizeVariants,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Draws a plain switcher at the middle size.
 */
export const recipe = defineSlotRecipe({
  base: {
    action: { ...row(), color: "fg.muted" },
    check: { alignItems: "center", display: "inline-flex", flexShrink: "0" },
    content: { display: "flex", flexDirection: "column", minInlineSize: "0" },
    detail: { ...truncate(), color: "fg.muted", textStyle: "caption" },
    indicator: {
      color: "fg.muted",
      flexShrink: "0",
      marginInlineStart: "auto",
      transitionDuration: "fast",
      transitionProperty: "common",
      transitionTimingFunction: "out",
    },
    label: { display: "flex", flexDirection: "column", minInlineSize: "0", textAlign: "start" },
    mark: { alignItems: "center", display: "inline-flex", flexShrink: "0" },
    name: truncate(),
    option: { ...row(), minInlineSize: "0" },
    root: {
      ...interactive(),
      alignItems: "center",
      display: "flex",
      minInlineSize: "0",
    },
  },
  className: "switcher",
  defaultVariants: { placement: "sidebar", size: "md", variant: "plain" },
  jsx: [/^Switcher(\.\w+)?$/u],
  slots: [
    "root",
    "mark",
    "label",
    "name",
    "detail",
    "indicator",
    "content",
    "option",
    "check",
    "action",
  ],
  variants: {
    /**
     * Where the control sits, which decides how wide it is.
     *
     * @remarks
     *   At the head of a sidebar the control is a row the width of the column, so the name and the
     *   detail have the column to read in. In a toolbar it is one control among others and takes
     *   the width of its words, and the detail goes, because a row of controls is one line tall.
     */
    placement: {
      sidebar: { root: { inlineSize: "full" } },
      toolbar: { detail: { display: "none" }, root: { inlineSize: "auto" } },
    },

    size: onSlots({
      action: sizeVariants(
        (size) => ({
          blockSize: `tag.${size}`,
          gap: `gap.${size}`,
          paddingInline: `inset.${size}`,
          textStyle: `label.${size}`,
        }),
        ["sm", "md", "lg"],
      ),
      check: sizeVariants((size) => ({ boxSize: `icon.${size}` }), ["sm", "md", "lg"]),
      content: sizeVariants(
        (size) => ({ gap: `gap.${size}`, padding: `gap.${size}` }),
        ["sm", "md", "lg"],
      ),
      indicator: sizeVariants((size) => ({ boxSize: `icon.${size}` }), ["sm", "md", "lg"]),
      mark: sizeVariants((size) => ({ boxSize: `control.${size}` }), ["sm", "md", "lg"]),
      name: sizeVariants((size) => ({ textStyle: `label.${size}` }), ["sm", "md", "lg"]),
      option: sizeVariants(
        (size) => ({ gap: `gap.${size}`, minBlockSize: `control.${size}`, padding: `gap.${size}` }),
        ["sm", "md", "lg"],
      ),
      root: sizeVariants(
        (size) => ({ borderRadius: "l2", gap: `gap.${size}`, padding: `gap.${size}` }),
        ["sm", "md", "lg"],
      ),
    }),

    /**
     * How the control is set against what holds it.
     *
     * @remarks
     *   A switcher usually sits at the head of a sidebar, where the sidebar is already a surface
     *   and a second one round the control reads as a box inside a box. `plain` is that case and
     *   the default.
     */
    variant: onSlot("root", {
      outline: { borderColor: "border", borderWidth: "sm" },
      plain: { background: "transparent" },
      subtle: { background: "bg.muted" },
    }),
  },
});
