/**
 * Declares the switcher's slot recipe, which styles the control that shows the current workspace,
 * project or environment and opens the menu of the others.
 *
 * @remarks
 *   The recipe has six slots. The root slot is the trigger, and the mark, the label, the name, the
 *   detail and the indicator are inside it. `Switcher.Root` is the disclosure package's menu, so
 *   the menu's recipe styles the panel and its rows. The trigger takes the button's looks and
 *   palettes from the same layer styles, so an outlined switcher has the button's light edge. The
 *   mark is a square in the palette's muted fill for an initial, an icon or an avatar. The name and
 *   the detail truncate to keep the control at one height. A pair of chevrons marks a control that
 *   switches and not a direction, so the indicator does not rotate while the menu is open. In a
 *   sidebar closed to icons the control is its mark alone, square, and in a narrow toolbar a
 *   switcher with a mark hides its name. The words remain in the accessible name in both.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  interactive,
  lookVariants,
  onSlot,
  onSlots,
  paletteVariants,
  sizeVariants,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Selects a part of a switcher drawn as its mark alone, in a sidebar closed to icons.
 */
const ICONIC = ".switcher__root[data-iconic] &";

/**
 * Selects a part of a switcher with a mark in a toolbar too narrow for the name. A switcher
 * without a mark keeps its name, because the name is the only content that identifies it.
 */
const NARROW = ".switcher__root[data-narrow]:has(.switcher__mark) &";

/**
 * Custom property the size axis sets to the height of a button at the switcher's size.
 */
const HEIGHT = "--switcher-height";

/**
 * Styles a control that is one line as wide as its words: in a toolbar and on its own.
 *
 * @remarks
 *   `inlineSize: fit` keeps the control as wide as its words, because a flex container fills its
 *   line otherwise. The detail is hidden, because the control is one line tall. The control is at
 *   least as tall as a button of its size, so it lines up with the buttons in a toolbar: 36px at
 *   `sm` and 40px at `md`.
 */
const INLINE = {
  detail: { display: "none" },
  root: { inlineSize: "fit", minBlockSize: `var(${HEIGHT})` },
};

/**
 * Styles the control in a sidebar: a row as wide as the column, and the mark alone on a rail.
 *
 * @remarks
 *   On a rail the control has no padding and no edge, so it is the mark's square, as tall as the
 *   rows under it: 32px at `md`.
 */
const ROW = {
  root: {
    "&[data-iconic]": {
      alignSelf: "center",
      aspectRatio: "square",
      borderWidth: "0",
      inlineSize: "auto",
      justifyContent: "center",
      padding: "0",
    },
    inlineSize: "full",
  },
};

/**
 * Styles a ghost switcher at the middle size, alone.
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
      [ICONIC]: { display: "none" },
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
      [ICONIC]: { srOnly: true },
      minInlineSize: "0",
      [NARROW]: { srOnly: true },
      textAlign: "start",
    },
    mark: {
      alignItems: "center",
      background: "colorPalette.muted",
      borderRadius: "l1",
      color: "colorPalette.fg",
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
      appearance: "none",
      borderColor: "transparent",
      borderWidth: "control",
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
      placement: ["alone", "toolbar"],
    },

    /**
     * Sets the detail and the indicator in the trigger's own ink on the solid look, where the
     * page's subtle ink is not read against the fill.
     */
    {
      css: { detail: { color: "inherit" }, indicator: { color: "inherit" } },
      name: "inked",
      variant: "solid",
    },
  ],
  defaultVariants: { placement: "alone", size: "md", variant: "ghost" },
  jsx: [/^Switcher(\.\w+)?$/u],
  slots: ["root", "mark", "label", "name", "detail", "indicator"],
  variants: {
    /**
     * The palette of the look and the mark.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Where the control is placed, which sets its width and its lines.
     *
     * @remarks
     *   `Switcher.Root` reads the placement from the sidebar or the toolbar around it unless a
     *   caller states one. The `marked` compound sizes the mark to `icon.lg` on one line, because
     *   the size axis sizes it for a sidebar and a compound applies over an axis.
     */
    placement: { alone: INLINE, sidebar: ROW, toolbar: INLINE },

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
          [HEIGHT]: dense(`{sizes.control.${size}}`),
          paddingBlock: dense(`{spacing.gap.${below(size)}}`),
          paddingInline: dense(`{spacing.gap.${size}}`),
          textStyle: `body.${below(size)}`,
        }),
        ["sm", "md", "lg"],
      ),
    }),

    /**
     * The button's six looks, each one of the theme's layer styles.
     *
     * @remarks
     *   `ghost`, the default, has no fill at rest, so a switcher at the head of a sidebar shows the
     *   sidebar's own ground and fills under a pointer.
     */
    variant: onSlot("root", lookVariants()),
  },
});
