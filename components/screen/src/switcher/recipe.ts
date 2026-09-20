/**
 * Defines the styles a switcher is drawn with.
 *
 * @remarks
 *   A switcher names the thing a screen is showing and opens the list of what else it could show: a
 *   workspace, a project, an environment. The control carries a mark, the current thing's name over
 *   a detail, and the sign that there is a list behind it. Six parts. The root is the control, and
 *   the mark, label, name, detail and indicator are what it holds. The control is the root because
 *   it is the only element the switcher draws itself. `Switcher.Root` wraps the menu, draws nothing
 *   and carries the variants, because the panel is placed outside the control in the document. The
 *   panel and its rows are the menu's, drawn as the menu draws them, with the menu's own mark,
 *   lines and description, and nothing of them is stated here. The mark is a tinted square, because
 *   it holds an initial, an icon or an avatar and each of those needs a box round it. The name and
 *   the detail are cut short rather than wrapped, so the control keeps one height whatever the
 *   current thing is called. The mark that opens the list holds still as the list opens: it is a
 *   pair of chevrons saying the control switches, not an arrow saying which way the panel went. The
 *   control is set in the muted ink, a step quieter than the page's, so it reads as a control among
 *   the controls of a bar rather than as a heading in it.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  interactive,
  onSlot,
  onSlots,
  sizeVariants,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Draws a plain switcher at the middle size.
 */
export const recipe = defineSlotRecipe({
  base: {
    detail: { ...truncate(), color: "fg.subtle", textStyle: "caption" },
    indicator: {
      _open: { rotate: "0deg" },
      alignItems: "center",
      color: "fg.subtle",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      marginInlineStart: "auto",
      transitionDuration: "press",
      transitionProperty: "common",
      transitionTimingFunction: "press",
    },
    label: {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      minInlineSize: "0",
      textAlign: "start",
    },
    mark: {
      alignItems: "center",
      background: "bg.muted",
      borderRadius: "l1",
      color: "fg.muted",
      display: "inline-flex",
      flexShrink: "0",
      fontWeight: "semibold",
      justifyContent: "center",
      lineHeight: "tight",
      overflow: "clip",
    },
    name: { ...truncate(), fontWeight: "medium" },
    root: {
      ...interactive(),
      alignItems: "center",
      color: "fg.muted",
      colorPalette: "neutral",
      display: "flex",
      minInlineSize: "0",
    },
  },
  className: "switcher",
  compoundVariants: [
    {
      css: { mark: { boxSize: dense("{sizes.icon.lg}"), fontSize: "xs" } },
      name: "marked",
      placement: "toolbar",
    },
  ],
  defaultVariants: { placement: "sidebar", size: "md", variant: "plain" },
  jsx: [/^Switcher(\.\w+)?$/u],
  slots: ["root", "mark", "label", "name", "detail", "indicator"],
  variants: {
    /**
     * Where the control is placed, which decides how wide it is.
     *
     * @remarks
     *   At the head of a sidebar the control is a row the width of the column, so the name and the
     *   detail have the column to read in. In a toolbar it is one control among others and takes
     *   the width of its words, fitted rather than left to the element, because a control drawn
     *   as a flex box fills the block around it, and the detail goes, because a row of controls is
     *   one line tall. The mark shrinks to an icon's box there, through the `marked` compound,
     *   because the size axis draws it a control's box for the sidebar and a compound is applied
     *   after an axis.
     */
    placement: {
      sidebar: { root: { inlineSize: "full" } },
      toolbar: { detail: { display: "none" }, root: { inlineSize: "fit" } },
    },

    size: onSlots({
      indicator: sizeVariants(
        (size) => ({ boxSize: dense(`{sizes.icon.${below(size)}}`) }),
        ["sm", "md", "lg"],
      ),
      mark: sizeVariants(
        (size) => ({
          boxSize: dense(`{sizes.control.${below(below(size))}}`),
          fontSize: below(size),
        }),
        ["sm", "md", "lg"],
      ),
      name: sizeVariants((size) => ({ textStyle: `body.${below(size)}` }), ["sm", "md", "lg"]),
      root: sizeVariants(
        (size) => ({
          borderRadius: "l2",
          gap: dense(`{spacing.gap.${size}}`),
          paddingBlock: dense(`{spacing.gap.${below(size)}}`),
          paddingInline: dense(`{spacing.gap.${size}}`),
          textStyle: `body.${below(size)}`,
        }),
        ["sm", "md", "lg"],
      ),
    }),

    /**
     * How the control is set against what holds it.
     *
     * @remarks
     *   A switcher is usually at the head of a sidebar, where the sidebar is already a surface and
     *   a second one round the control reads as a box inside a box. `plain` is that case and the
     *   default.
     */
    variant: onSlot("root", {
      subtle: { background: "bg.muted" },

      outline: { borderColor: "border.emphasized", borderWidth: "control" },

      plain: { background: "transparent" },
    }),
  },
});
