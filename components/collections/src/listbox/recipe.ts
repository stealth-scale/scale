/**
 * Defines the styles a listbox is drawn with.
 *
 * @remarks
 *   Ten parts. The root frames the set, the label names it, the input narrows it, and the content
 *   is the list itself. An item holds its words and the mark saying it is chosen, and a group
 *   gathers items under a heading.
 *   A row is drawn from the theme's `row` fragment. Focus stays on the list and a highlight moves
 *   over the rows, which is why a row carries no ring and no press of its own, and why the
 *   `highlight` axis reads the same three marks a menu reads.
 *   The content scrolls rather than the root, so a label and a field above it stay put while the
 *   rows move under them.
 */

import {
  controlSizes,
  cornerVariants,
  defineSlotRecipe,
  dense,
  field,
  highlightVariants,
  iconSizes,
  onSlot,
  onSlots,
  row,
  sizeVariants,
  surface,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Draws a plain listbox at the middle size, tinting the row the highlight is on.
 *
 * @remarks
 *   The input is drawn as a field of its own, from the theme's `field` fragment at the control
 *   scale, because it is one: a person types in it to narrow the rows. The label and the group
 *   labels keep the inset the rows keep, so their words line up with the rows' words, and a
 *   list raised on a surface keeps a small gap between its frame and its rows, the way a menu's
 *   panel does.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: { display: "flex", flexDirection: "column", minBlockSize: "0", overflowY: "auto" },
    input: { ...field(), appearance: "none", borderRadius: "l2", inlineSize: "full" },
    item: { ...row(), _selected: { fontWeight: "medium" } },
    itemGroup: { display: "flex", flexDirection: "column", minInlineSize: "0" },
    itemGroupLabel: { color: "fg.muted", fontWeight: "medium" },
    itemIndicator: {
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      marginInlineStart: "auto",
    },
    itemText: { ...truncate(), flex: "1", minInlineSize: "0", textAlign: "start" },
    label: { color: "fg.muted", fontWeight: "medium" },
    root: { display: "flex", flexDirection: "column", minBlockSize: "0", minInlineSize: "0" },
    valueText: truncate(),
  },
  className: "listbox",
  defaultVariants: { highlight: "tint", radius: "l1", size: "md", variant: "plain" },
  jsx: [/^Listbox(\.\w+)?$/u],
  slots: [
    "root",
    "label",
    "input",
    "content",
    "item",
    "itemText",
    "itemIndicator",
    "itemGroup",
    "itemGroupLabel",
    "valueText",
  ],
  variants: {
    /**
     * How the row the list has moved its highlight onto is marked.
     */
    highlight: onSlot("item", highlightVariants()),

    radius: onSlot("item", cornerVariants(["l1", "l2", "l3"])),

    size: onSlots({
      content: sizeVariants(
        (size) => ({ gap: dense(`{spacing.gap.${size}}`) }),
        ["sm", "md", "lg"],
      ),
      input: controlSizes(["sm", "md", "lg"]),
      item: sizeVariants(
        (size) => ({
          blockSize: dense(`{sizes.tag.${size}}`),
          gap: dense(`{spacing.gap.${size}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
          textStyle: `label.${size}`,
        }),
        ["sm", "md", "lg"],
      ),
      itemGroup: sizeVariants(
        (size) => ({ gap: dense(`{spacing.gap.${size}}`) }),
        ["sm", "md", "lg"],
      ),
      itemGroupLabel: sizeVariants(
        (size) => ({ paddingInline: dense(`{spacing.inset.${size}}`), textStyle: `label.${size}` }),
        ["sm", "md", "lg"],
      ),
      itemIndicator: iconSizes(["sm", "md", "lg"]),
      label: sizeVariants(
        (size) => ({ paddingInline: dense(`{spacing.inset.${size}}`), textStyle: `label.${size}` }),
        ["sm", "md", "lg"],
      ),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), ["sm", "md", "lg"]),
    }),

    /**
     * Whether the list is raised on a surface of its own or drawn against what holds it.
     */
    variant: {
      plain: { root: { background: "transparent" } },
      surface: { root: { ...surface(), overflow: "clip", padding: "gap.sm" } },
    },
  },
});
