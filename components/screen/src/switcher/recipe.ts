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
 *   so the control keeps one height whatever the current thing is called. The tick sits at the end
 *   of the row rather than in the menu's leading gutter, because the row's mark is drawn there, and
 *   the row keeps room at its end for it so the words never run under it. Where it sits is written
 *   on the size axis beside its box, because the menu's own gutter is written there too and the
 *   compiler lets the later of two axis values win where a base value would lose. The mark that
 *   opens the list holds still as the list opens: it is a pair of chevrons saying the control
 *   switches, not an arrow saying which way the panel went. The control is set in the neutral
 *   palette's ink, which is a step quieter than the page's, so it reads as a control among the
 *   controls of a bar rather than as a heading in it.
 */

import {
  defineSlotRecipe,
  dense,
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
    check: {
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
    },
    content: { display: "flex", flexDirection: "column", minInlineSize: "0" },
    detail: { ...truncate(), color: "fg.muted", textStyle: "caption" },
    indicator: {
      _open: { rotate: "0deg" },
      alignItems: "center",
      color: "fg.muted",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      marginInlineStart: "auto",
      transitionDuration: "press",
      transitionProperty: "common",
      transitionTimingFunction: "press",
    },
    label: { display: "flex", flexDirection: "column", minInlineSize: "0", textAlign: "start" },
    mark: { alignItems: "center", display: "inline-flex", flexShrink: "0" },
    name: truncate(),
    option: { ...row(), minInlineSize: "0" },
    root: {
      ...interactive(),
      alignItems: "center",
      color: "colorPalette.fg",
      colorPalette: "neutral",
      display: "flex",
      minInlineSize: "0",
    },
  },
  className: "switcher",
  compoundVariants: [
    {
      css: {
        mark: {
          background: "bg.muted",
          borderRadius: "l1",
          boxSize: dense("{sizes.icon.md}"),
          fontSize: "xs",
          fontWeight: "semibold",
          justifyContent: "center",
          lineHeight: "tight",
        },
        root: { gap: dense("{spacing.gap.lg}") },
      },
      name: "marked",
      placement: "toolbar",
    },
  ],
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
     *   The mark shrinks to an icon's box there, through the `marked` compound, because the size
     *   axis draws it a control's box for the sidebar and a compound is what outranks an axis.
     */
    placement: {
      sidebar: { root: { inlineSize: "full" } },
      toolbar: { detail: { display: "none" }, root: { inlineSize: "auto" } },
    },

    size: onSlots({
      action: sizeVariants(
        (size) => ({
          blockSize: dense(`{sizes.tag.${size}}`),
          gap: dense(`{spacing.gap.${size}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
          textStyle: `label.${size}`,
        }),
        ["sm", "md", "lg"],
      ),
      check: sizeVariants(
        (size) => ({
          boxSize: dense(`{sizes.icon.${size}}`),
          insetInlineEnd: dense(`{spacing.gap.${size}}`),
          insetInlineStart: "auto",
        }),
        ["sm", "md", "lg"],
      ),
      content: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          padding: dense(`{spacing.gap.${size}}`),
        }),
        ["sm", "md", "lg"],
      ),
      indicator: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.icon.${size}}`) }),
        ["sm", "md", "lg"],
      ),
      mark: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.control.${size}}`) }),
        ["sm", "md", "lg"],
      ),
      name: sizeVariants(
        (size) => ({ fontSize: size, fontWeight: "semibold", lineHeight: "tight" }),
        ["sm", "md", "lg"],
      ),
      option: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          minBlockSize: dense(`{sizes.control.${size}}`),
          padding: dense(`{spacing.gap.${size}}`),
          paddingInlineEnd: `calc({sizes.icon.${size}} + 2 * {spacing.gap.${size}})`,
        }),
        ["sm", "md", "lg"],
      ),
      root: sizeVariants(
        (size) => ({
          borderRadius: "l2",
          gap: dense(`{spacing.gap.${size}}`),
          minBlockSize: dense(`{sizes.control.${size}}`),
          paddingInline: dense(`{spacing.gap.${size}}`),
        }),
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
      outline: { borderColor: "border.emphasized", borderWidth: "control" },
      plain: { background: "transparent" },
      subtle: { background: "bg.muted" },
    }),
  },
});
