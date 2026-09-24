/**
 * Declares the switcher's slot recipe, which styles the control that shows the current workspace,
 * project or environment and opens the menu of the others.
 *
 * @remarks
 *   The recipe has six slots. The root slot is the trigger, and the mark, the label, the name, the
 *   detail and the indicator are inside it. `Switcher.Root` is the disclosure package's menu and
 *   renders no element, so the menu's recipe styles the panel and its rows. The mark is a tinted
 *   square for an initial, an icon or an avatar. The name and the detail truncate to keep the
 *   control at one height. A pair of chevrons marks a control that switches and not a direction,
 *   so the indicator does not rotate while the menu is open. The control's ink is `fg.muted` in
 *   the neutral palette. The recipe has no `palette` and no `effect` axis: the control is neutral,
 *   and `Switcher.Root` passes the menu's own `palette` to `Menu.Root`.
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
 * Styles the fills of a look that rests on its container's ground: under a pointer, under a press
 * and while the menu is open.
 */
const ON_GROUND = {
  _active: { background: "bg.emphasized" },
  _hover: { background: "bg.muted" },
  _open: { background: "bg.muted" },
};

/**
 * Styles the same three fills for a look that rests on a fill.
 *
 * @remarks
 *   `subtle` rests on `bg.muted`, so its hover, press and open fills are `bg.emphasized`, one step
 *   darker than its resting fill.
 */
const ON_FILL = {
  _active: { background: "bg.emphasized" },
  _hover: { background: "bg.emphasized" },
  _open: { background: "bg.emphasized" },
};

/**
 * Styles a plain switcher at the middle size in a sidebar.
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
     * Where the control is placed, which sets its width.
     *
     * @remarks
     *   At the head of a sidebar the control fills the column. In a toolbar it is as wide as its
     *   words (`inlineSize: fit`, because a flex container fills its line otherwise) and hides the
     *   detail, because a toolbar row is one line tall. The `marked` compound sizes the mark to
     *   `icon.lg` in a toolbar, because the size axis sizes it for a sidebar and a compound
     *   applies over an axis.
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
     * The control's look against its container.
     *
     * @remarks
     *   `plain`, the default, has no fill at rest, so a switcher at the head of a sidebar shows the
     *   sidebar's own look. Each look states its hover, press and open fills, because the compiler
     *   layers the variants over the base, so a look's resting fill applies over any state the base
     *   writes.
     */
    variant: onSlot("root", {
      subtle: { ...ON_FILL, background: "bg.muted" },

      outline: { ...ON_GROUND, borderColor: "border.emphasized", borderWidth: "control" },

      plain: { ...ON_GROUND, background: "transparent" },
    }),
  },
});
