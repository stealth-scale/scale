/**
 * Declares the navigation list's slot recipe: rows of links, branches that expand a nested list,
 * and the count, control and indicator at the end of a row.
 *
 * @remarks
 *   A row reads the theme's `row` fragment and no second recipe, so one rule sets its height. A
 *   nested list reuses `Item` and `Link`, and `Content` sets the muted ink the nested rows inherit.
 *   `Content` animates between the heights the collapsible machine measures, and the indicator
 *   rotates a quarter turn as the branch opens. `iconic` renders every row as a square containing
 *   its icon, with the text kept for screen readers, and removes the end padding, so a row with a
 *   control is as wide as a row without one. The count, the control and the indicator share one
 *   column at the end of a row.
 */

import {
  below,
  cornerVariants,
  defineSlotRecipe,
  dense,
  HIGHLIGHTS,
  highlightVariants,
  interactive,
  onSlot,
  onSlots,
  paletteVariants,
  row,
  sizeVariants,
  truncate,
} from "@stealthscale/theme/authoring";

import { centred, reserved, rowed, trailing, tucked } from "#nav-list/metrics.ts";

/**
 * The recipe's class name, used to build the selectors that reach from one part to another.
 *
 * @remarks
 *   The binding writes one class per part, such as `nav-list__action`, and no part attribute, so a
 *   selector across parts targets the class, built from this constant. The keyboard module reads
 *   the same constant to find the rows.
 */
export const CLASS = "nav-list";

/**
 * Selects the control at the end of a row, from a rule on the row.
 */
const ACTION = `.${CLASS}__action`;

/**
 * Selects the count at the end of a row, from a rule on the row.
 */
const BADGE = `.${CLASS}__badge`;

/**
 * Selects either the count or the control at the end of a row.
 */
const TRAILED = `:is(${ACTION}, ${BADGE})`;

/**
 * Styles a row of the iconic list: a square containing the icon, with the text hidden visually.
 *
 * @remarks
 *   The text stays in the accessibility tree through `srOnly`, because a link without a name is
 *   announced as `link` alone. `srOnly` also takes the text out of the flow, where clipping by
 *   overflow would leave it inside the square and squeeze the icon. Only an `svg` child stays
 *   visible. The square drops the row's inline padding: with it, a 24px square kept 12px on each
 *   side and pushed the link's icon 6px off centre.
 */
const SQUARED = {
  "& > :not(svg)": { srOnly: true },
  aspectRatio: "square",
  inlineSize: "auto",
  justifyContent: "center",
  paddingInline: "0",
};

/**
 * Styles every row a person presses: the theme's row fragment at the full width of the list, with
 * a minimum width of zero so the text can truncate.
 */
const PRESSABLE = {
  ...row(),
  ...interactive(),
  _hover: { background: "colorPalette.subtle" },
  cursor: "button",
  inlineSize: "full",
  justifyContent: "flex-start",
  minInlineSize: "0",
};

/**
 * Positions a part at the end of a row: absolutely, over the row, centred on the block axis.
 *
 * @remarks
 *   The part is out of the flow so the highlight fill spans the whole row. In the flow, the fill
 *   would stop where the control begins and leave a notch at the end of the row.
 */
const BESIDE = {
  insetInlineEnd: "0",
  position: "absolute",
  top: "50%",
  translate: "0 -50%",
};

/**
 * Styles the control at the end of a row as an unfilled square button that fills on hover.
 *
 * @remarks
 *   The end column sizes the action, so it fits inside the row at every size. The hover fill is
 *   `emphasized`, two steps darker than the row's `subtle` hover and one step darker than the tint
 *   highlight, so a hovered control shows an edge on its hovered row.
 */
const ACTING = {
  ...BESIDE,
  ...interactive(),
  _hover: { background: "colorPalette.emphasized", color: "fg" },
  appearance: "none",
  background: "transparent",
  borderRadius: "l1",
  borderStyle: "none",
  color: "fg.muted",
  padding: "0",
};

/**
 * Selects the row a person presses, a link or a trigger, from a rule on the item.
 */
const PRESSED = `:is(.${CLASS}__link, .${CLASS}__trigger)`;

/**
 * Selects the row for the current page by its `aria-current` attribute.
 */
const CURRENT = '[aria-current="page"]';

/**
 * Selects a branch's nested list whose trigger leads with an icon, from a rule on the branch.
 */
const UNDER_ICON = `&:has(> .${CLASS}__trigger > svg:first-child) > .${CLASS}__content`;

/**
 * The glow the `effect` axis puts around the current row.
 */
const GLOWING = { _currentPage: { layerStyle: "glow.sm" } };

/**
 * Styles a column of rows at the md size, tinting the current row.
 *
 * @remarks
 *   The count sets its own ink. The count is a sibling of the link, so it does not inherit the ink
 *   of the link's highlight, and the compound for the fill highlight sets the fill's contrast ink
 *   on it.
 */
export const recipe = defineSlotRecipe({
  base: {
    action: ACTING,
    badge: { ...BESIDE, color: "fg.muted", pointerEvents: "none" },
    branch: { listStyle: "none", minInlineSize: "0" },
    content: {
      _closed: { animationStyle: "collapse.out" },
      _open: { animationStyle: "collapse.in" },
      "&[hidden]": { display: "none" },
      borderColor: "border",
      borderInlineStartWidth: "hairline",
      color: "fg.muted",
      display: "flex",
      flexDirection: "column",
      listStyle: "none",
      margin: "0",
      minInlineSize: "0",
      overflow: "hidden",
      padding: "0",
    },
    indicator: {
      _motionReduce: { transitionDuration: "0s" },
      _open: { rotate: "90deg" },
      _rtl: { _open: { rotate: "90deg" }, rotate: "180deg" },
      color: "fg.muted",
      display: "flex",
      flexShrink: "0",
      marginInlineStart: "auto",
      transitionDuration: "press",
      transitionProperty: "rotate",
      transitionTimingFunction: "press",
    },
    item: {
      /**
       * The row keeps its hover fill while the pointer is on its control. The control is a sibling
       * of the link, so moving onto it ended the link's hover and left the control beside an
       * unfilled row.
       */
      [`&:has(> ${ACTION}:hover) > ${PRESSED}`]: { background: "colorPalette.subtle" },
      listStyle: "none",
      minInlineSize: "0",
      position: "relative",
    },
    link: PRESSABLE,
    root: {
      display: "flex",
      flexDirection: "column",
      listStyle: "none",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
    skeleton: { alignItems: "center", display: "flex" },
    trigger: {
      ...PRESSABLE,
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      color: "colorPalette.fg",
    },
  },
  className: CLASS,
  compoundVariants: [
    {
      css: {
        action: { display: "none" },
        badge: { srOnly: true },
        content: { display: "none" },
        indicator: { display: "none" },
        item: { [`&:has(> ${TRAILED}) > ${PRESSED}`]: { paddingInlineEnd: "0" } },
        link: { ...SQUARED },
        trigger: { ...SQUARED },
      },
      iconic: true,
      name: "squared",
      variant: "list",
    },

    /**
     * The count and the control next to the current row take the fill's contrast ink when the
     * highlight is a fill.
     *
     * @remarks
     *   The count is positioned over the filled row, where the muted ink is 3.1:1 against the
     *   fill, under the 4.5:1 WCAG 1.4.3 requires for text. The control's icon is under the same
     *   fill. The tint and bar highlights leave the row on the page surface, where the muted ink
     *   meets the ratio. Both parts follow the link in the DOM, so the rule selects them as
     *   following siblings of the current row. The control hovers to the fill's own hover role,
     *   because `emphasized` is lighter than the solid fill.
     */
    {
      css: {
        action: {
          [`${PRESSED}${CURRENT} ~ &`]: {
            _hover: { background: "colorPalette.solid.hover", color: "colorPalette.contrast" },
            color: "colorPalette.contrast",
          },
        },
        badge: {
          [`${PRESSED}${CURRENT} ~ &`]: { color: "colorPalette.contrast" },
        },
      },
      highlight: "fill",
      name: "inked",
      variant: "list",
    },
  ],
  defaultVariants: {
    guide: "solid",
    highlight: "tint",
    radius: "l2",
    reveal: "always",
    size: "md",
    variant: "list",
  },
  jsx: [/^NavList(\.\w+)?$/u],
  slots: [
    "root",
    "item",
    "link",
    "action",
    "badge",
    "branch",
    "trigger",
    "indicator",
    "content",
    "skeleton",
  ],
  variants: {
    /**
     * The halo around the current row, in the palette's solid at half opacity.
     */
    effect: onSlots({ link: { glow: GLOWING }, trigger: { glow: GLOWING } }),

    /**
     * The style of the line down the start of a nested list.
     *
     * @remarks
     *   `none` removes the line and keeps the indent.
     */
    guide: onSlot("content", {
      dashed: { borderInlineStartStyle: "dashed" },
      dotted: { borderInlineStartStyle: "dotted" },
      none: { borderInlineStartStyle: "none" },
      solid: { borderInlineStartStyle: "solid" },
    }),

    /**
     * How the current row is marked.
     */
    highlight: onSlots({
      link: highlightVariants(HIGHLIGHTS, "_currentPage"),
      trigger: highlightVariants(HIGHLIGHTS, "_currentPage"),
    }),

    /**
     * Whether the rows render as squares containing their icons, with the text kept for screen
     * readers.
     *
     * @remarks
     *   A sidebar that collapses to a rail sets it. The list measures nothing itself.
     */
    iconic: { true: { root: { alignItems: "center" } } },

    /**
     * The palette the highlight, the hover fill and the branch rows read.
     *
     * @remarks
     *   The palette is set on the root, and every part inherits the palette's custom properties.
     */
    palette: onSlot("root", paletteVariants()),

    radius: onSlots({
      link: cornerVariants(["l1", "l2", "l3", "full"]),
      trigger: cornerVariants(["l1", "l2", "l3", "full"]),
    }),

    /**
     * When the control at the end of a row is visible.
     *
     * @remarks
     *   With `hover`, the control is hidden until its row is hovered. It is visible on the current
     *   row and under a coarse pointer, which cannot hover. It is also visible while any element in
     *   its row has focus, so a keyboard user can operate it.
     */
    reveal: {
      always: { action: { opacity: "1" } },
      hover: {
        action: {
          _touch: { opacity: "1" },
          opacity: "0",
          transitionDuration: "press",
          transitionProperty: "common",
          transitionTimingFunction: "press",
        },
        item: {
          [`&:focus-within ${ACTION}, &:hover ${ACTION}, &:has(> ${PRESSED}${CURRENT}) ${ACTION}`]:
            {
              opacity: "1",
            },
        },
      },
    },

    size: onSlots({
      action: sizeVariants((size) => ({ ...trailing(size), ...tucked(size) }), ["sm", "md", "lg"]),

      /**
       * The count's text style is one size smaller than the row's.
       */
      badge: sizeVariants(
        (size) => ({
          ...trailing(size),
          ...tucked(size),
          textStyle: `label.${below(below(size))}`,
        }),
        ["sm", "md", "lg"],
      ),
      branch: sizeVariants(
        (size) => ({ [UNDER_ICON]: { marginInlineStart: centred(size) } }),
        ["sm", "md", "lg"],
      ),
      content: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${below(size)}}`),
          marginInlineStart: dense(`{spacing.inset.${below(size)}}`),
          paddingBlock: "0.5",
          paddingInlineStart: dense(`{spacing.inset.${below(size)}}`),
        }),
        ["sm", "md", "lg"],
      ),

      indicator: sizeVariants(trailing, ["sm", "md", "lg"]),
      /**
       * The end padding a row keeps for the count or the control positioned over it.
       *
       * @remarks
       *   The rule is on this axis, not in the item's base, because the compiler puts variants in a
       *   layer over the base, and the row's own `paddingInline` comes from this axis. A layer
       *   beats specificity, so the same rule in the base, three classes deep, lost to a variant
       *   one class deep.
       */
      item: sizeVariants(
        (size) => ({
          [`&:has(> ${TRAILED}) > ${PRESSED}`]: { paddingInlineEnd: reserved(size) },
        }),
        ["sm", "md", "lg"],
      ),
      link: sizeVariants(rowed, ["sm", "md", "lg"]),
      root: sizeVariants(
        (size) => ({ gap: dense(`{spacing.gap.${below(below(size))}}`) }),
        ["sm", "md", "lg"],
      ),
      skeleton: sizeVariants(
        (size) => ({
          blockSize: dense(`{sizes.tag.${size}}`),
          gap: dense(`{spacing.gap.${below(below(size))}}`),
          paddingInline: dense(`{spacing.inset.${below(below(size))}}`),
        }),
        ["sm", "md", "lg"],
      ),
      trigger: sizeVariants(rowed, ["sm", "md", "lg"]),
    }),

    /**
     * Whether the rows run down the side of a page or across the foot of a screen.
     *
     * @remarks
     *   `dock` lays a few links out in equal columns, each an `icon.lg` icon over a `label.xs`
     *   caption, and pads the root by the safe area a device reserves at the foot of the screen. It
     *   is named `dock` because the `highlight` axis already offers `bar`, and two values with one
     *   name on a slot compile to one class.
     */
    variant: {
      dock: {
        item: { flex: "1", minInlineSize: "0" },
        link: {
          "& > svg": { boxSize: dense("{sizes.icon.lg}") },
          blockSize: "auto",
          flexDirection: "column",
          gap: dense("{spacing.gap.xs}"),
          justifyContent: "center",
          paddingBlock: dense("{spacing.gap.sm}"),
          paddingInline: dense("{spacing.gap.xs}"),
          textStyle: "label.xs",
        },
        root: {
          alignItems: "stretch",
          flexDirection: "row",
          gap: dense("{spacing.gap.xs}"),
          paddingBlockEnd: "safe.bottom",
        },
      },
      list: { link: truncate(), trigger: truncate() },
    },
  },
});
