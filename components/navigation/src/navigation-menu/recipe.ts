/**
 * Recipe for the navigation menu: a bar of triggers and links, the panel each trigger opens, the
 * links in a panel, the bar under the open trigger, and the viewport the panels share.
 *
 * @remarks
 *   A trigger and a link in the bar are controls of the size's height in the muted ink, and take
 *   `fg` under the pointer and while open. The bar wraps onto a second row when its items do not
 *   fit. A panel in place opens one gap under its trigger and is as wide as its content, at most
 *   `sizes.2xl` and 20px narrower than the window, because the machine keeps the viewport 10px
 *   inside it. The indicator is a bar along the open trigger's bottom edge, placed from the
 *   machine's `--trigger-x`, `--trigger-y`, `--trigger-width` and `--trigger-height`. Inside the
 *   viewport a panel drops its surface and every panel takes the viewport's one grid cell, so the
 *   panel that leaves fades over the panel that enters. The viewport is one floating surface that
 *   moves to `--viewport-x`, and its content box takes the open panel's `--viewport-width` and
 *   `--viewport-height`, so its hairline edge clips none of the panel. A panel link places a
 *   leading icon in a column of its own, beside every other child, and packs its rows at its top
 *   when a taller link beside it stretches it. The palette colors the indicator and a link to the
 *   current page.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  floating,
  interactive,
  motion,
  onSlot,
  onSlots,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

import {
  aligned,
  barred,
  BARRED,
  CLASS,
  HOVERED,
  LEADING,
  linked,
  placed,
  REPLACED,
  SIZES,
  triggered,
  UNANCHORED,
  UPRIGHT,
  VIEWED,
} from "#navigation-menu/metrics.ts";

/**
 * Forced colors of a state that fills a control: the system highlight, which the browser keeps.
 *
 * @remarks
 *   The compiler emits the hover rule after the forced-colors rule, so an open trigger under the
 *   pointer restates these inside its hover rule, where the open state's selector raises the
 *   specificity over the hover fill's.
 */
const FORCED = {
  _highContrast: { background: "Highlight", color: "HighlightText", forcedColorAdjust: "none" },
};

/**
 * Defines the navigation menu recipe, at size `md` in the primary palette by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: {
      ...floating(),
      display: "flex",
      flexDirection: "column",
      inlineSize: "max-content",
      insetInlineStart: "0",
      maxInlineSize: "min({sizes.2xl}, calc(100vw - {spacing.5}))",
      position: "absolute",
      [REPLACED]: { _closed: { animation: "none" } },
      [VIEWED]: {
        ...motion("fade.in", "fade.out"),
        alignSelf: "start",
        background: "transparent",
        borderWidth: "0",
        boxShadow: "none",
        gridArea: "1 / 1 / 2 / 2",
        position: "static",
      },
    },
    indicator: {
      ...motion("fade.in", "fade.out"),
      _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
      _motionReduce: { transitionDuration: "0s" },
      _vertical: {
        _rtl: { left: "auto", right: "0" },
        blockSize: "var(--trigger-height)",
        inlineSize: "{borderWidths.indicator}",
        translate: "0 var(--trigger-y)",
      },
      background: "colorPalette.solid",
      blockSize: "{borderWidths.indicator}",
      borderRadius: "full",
      inlineSize: "var(--trigger-width)",
      insetBlockStart: "0",
      left: "0",
      listStyle: "none",
      pointerEvents: "none",
      transitionDuration: "move",
      transitionProperty: "translate, width, height",
      transitionTimingFunction: "move",
      translate:
        "var(--trigger-x) calc(var(--trigger-y) + var(--trigger-height) - {borderWidths.indicator})",
    },
    item: {
      _vertical: { flexDirection: "column" },
      display: "flex",
      position: "relative",
      [UNANCHORED]: { position: "static" },
    },
    link: {
      ...interactive(),
      _currentPage: { color: "colorPalette.fg", fontWeight: "medium" },
      _hover: { background: "bg.subtle" },
      "& > :not(svg)": { gridColumn: "-2" },
      "& > svg": { color: "fg.muted" },
      alignContent: "start",
      alignItems: "center",
      [BARRED]: { ...barred(), _currentPage: { color: "colorPalette.fg" } },
      borderRadius: "l2",
      color: "fg",
      display: "grid",
      gridTemplateColumns: "1fr",
      [LEADING]: { gridTemplateColumns: "auto 1fr" },
      textDecoration: "none",
    },
    list: {
      _vertical: { alignItems: "stretch", flexDirection: "column", flexWrap: "nowrap" },
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      listStyle: "none",
      margin: "0",
      padding: "0",
      position: "relative",
    },
    root: { position: "relative" },
    trigger: {
      ...barred(),
      _hover: { ...HOVERED, _open: FORCED },
      _open: {
        ...FORCED,
        "& > svg": { rotate: "180deg" },
        background: "bg.muted",
        color: "fg",
      },
      "& > svg": {
        _motionReduce: { transitionDuration: "0s" },
        flexShrink: "0",
        transitionDuration: "press",
        transitionProperty: "rotate",
      },
      appearance: "none",
      background: "transparent",
      borderWidth: "0",
      [UPRIGHT]: { _open: { "& > svg": { rotate: "0deg" } }, justifyContent: "space-between" },
    },
    viewport: {
      ...floating(),
      ...aligned(),
      _motionReduce: { transitionDuration: "0s" },
      _vertical: { translate: "0 var(--viewport-y)" },
      blockSize: "var(--viewport-height)",
      boxSizing: "content-box",
      display: "grid",
      inlineSize: "var(--viewport-width)",
      overflow: "hidden",
      transitionDuration: "move",
      transitionProperty: "translate, width, height",
      transitionTimingFunction: "move",
      translate: "var(--viewport-x) 0",
    },
    viewportPositioner: {
      _vertical: { _rtl: { left: "auto", right: "100%" }, insetBlockStart: "0", left: "100%" },
      insetBlockStart: "100%",
      left: "0",
      position: "absolute",
      zIndex: "popover",
    },
  },
  className: CLASS,
  defaultVariants: { palette: "primary", size: "md" },
  jsx: [/^NavigationMenu(\.\w+)?$/u],
  slots: [
    "root",
    "list",
    "item",
    "trigger",
    "content",
    "link",
    "indicator",
    "viewportPositioner",
    "viewport",
  ],
  variants: {
    /**
     * Palette of the indicator and of a link to the current page.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Height, insets and text of the bar's triggers and links, the gaps between them, the gap
     * between the bar and a panel, and the padding, gaps and icons of a panel and its links.
     */
    size: onSlots({
      content: sizeVariants(
        (size) => ({
          ...placed(size),
          gap: dense(`{spacing.gap.${below(size)}}`),
          padding: dense(`{spacing.inset.${below(size)}}`),
        }),
        SIZES,
      ),
      link: sizeVariants(linked, SIZES),
      list: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
      trigger: sizeVariants(triggered, SIZES),
      viewportPositioner: sizeVariants(
        (size) => ({
          _vertical: { paddingBlockStart: "0", paddingInlineStart: dense(`{spacing.gap.${size}}`) },
          paddingBlockStart: dense(`{spacing.gap.${size}}`),
        }),
        SIZES,
      ),
    }),
  },
});
