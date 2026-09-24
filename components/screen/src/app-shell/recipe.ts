/**
 * Declares the app shell's slot recipe, which lays out a column of bars with a body between them
 * and a panel on either side of the page in the body.
 *
 * @remarks
 *   The recipe has ten slots. A part that is left out takes no room. Every part is a bare
 *   container: the recipe sets the layout, the scrolling, the motion and the hairlines between
 *   regions, and the application styles the rest through a theme. The backdrop and a pinned bar are
 *   filled, because the page is visible under both. A panel in the body is a track whose width
 *   moves between its open and closed widths, and its content keeps the open width, so the track
 *   clips the content instead of reflowing it. A panel over the page is fixed to the window with a
 *   backdrop behind it. The open and closed widths are the theme's `sizes.sidebar`, `sizes.aside`
 *   and `sizes.rail`. The recipe has no `palette` and no `effect` axis, because the parts are
 *   containers and the components inside them offer their own.
 */

import { defineSlotRecipe, dense, surface } from "@stealthscale/theme/authoring";

/**
 * The recipe's class name, used to build the selectors that reach from one part to another.
 *
 * @remarks
 *   The binding writes one class per part, such as `app-shell__main`, and no part attribute, so a
 *   selector across parts targets the class built from this constant.
 */
const CLASS = "app-shell";

/**
 * Custom property with the width a panel opens to.
 */
export const PANEL_SIZE = "--app-shell-panel-size";

/**
 * Custom property with the width a panel closes to.
 */
export const PANEL_RAIL = "--app-shell-panel-rail";

/**
 * Custom property with the height of the pinned bars above a pinned bar.
 */
export const STICKY_OFFSET = "--app-shell-sticky-offset";

/**
 * Custom property on the root with the height of every pinned bar.
 */
export const STICKY_TOP = "--app-shell-sticky-top";

/**
 * Attribute the root writes after its first paint.
 *
 * @remarks
 *   A panel measures the shell after its first render and may open, close or leave the body. No
 *   part transitions before the root has this attribute, so a panel takes its measured state
 *   without a slide on load.
 */
export const SETTLED = "data-settled";

/**
 * Styles the transition of a moving part, with no motion under reduced motion or before the root
 * has settled.
 */
const MOVING = {
  _motionReduce: { transitionDuration: "0s" },
  transitionDuration: "move",
  transitionTimingFunction: "move",

  [`.${CLASS}__root:not([${SETTLED}]) &`]: { transitionDuration: "0s" },
};

/**
 * Styles a panel over the page: fixed to the window, a rail's width short of the far edge, and
 * inside the safe area.
 *
 * @remarks
 *   The panel is fixed to the window, so one rule applies to both scroll modes. A closed sheet
 *   keeps its width and slides out. Its visibility changes with no duration: a closing sheet
 *   becomes hidden after a delay as long as the slide, and an opening sheet becomes visible at
 *   once. The shell moves focus into a sheet in the commit that opens it, and a browser does not
 *   focus a hidden element.
 */
const OVERLAID = {
  _motionReduce: { transitionDelay: "0s" },
  blockSize: "100dvh",
  inlineSize: `min(var(${PANEL_SIZE}), calc(100dvw - {sizes.rail}))`,
  insetBlock: "0",
  paddingBlockEnd: "safe.bottom",
  paddingBlockStart: "safe.top",
  position: "fixed",
  transitionDelay: "0s",
  transitionDuration: "{durations.move}, 0s",
  transitionProperty: "translate, visibility",
  zIndex: "modal",
};

/**
 * Styles a closed sheet on either side: the visibility changes after the slide has ended.
 */
const SLID_OUT = { transitionDelay: "0s, {durations.moderate}" };

/**
 * Styles both panels: a track between the open and closed widths.
 *
 * @remarks
 *   A panel closed to nothing becomes hidden after its transition, so a border the application
 *   gives it is not visible. The shell sets the visibility, and the application sets the border.
 */
const PANEL = {
  ...MOVING,
  display: "flex",
  flexShrink: "0",
  inlineSize: `var(${PANEL_SIZE})`,
  overflow: "hidden",
  [PANEL_RAIL]: "0px",
  position: "relative",
  transitionProperty: "inline-size, visibility",

  "&[data-collapse=hide][data-state=closed]": { visibility: "hidden" },
  "&[data-collapse=icons]": { [PANEL_RAIL]: "sizes.rail" },
  "&[data-stacked]": { flexBasis: "100%", inlineSize: "100%", order: "1", position: "static" },
  "&[data-state=closed]": { inlineSize: `var(${PANEL_RAIL})` },
};

/**
 * Styles a bar pinned to the window, filled with `bg.panel`.
 *
 * @remarks
 *   The page scrolls under a pinned bar, so the bar has a fill. The fill is `bg.panel`, so the bar
 *   reads as a layer over the page.
 */
const PINNED = { background: "bg.panel", position: "sticky", zIndex: "sticky" };

/**
 * Styles a panel while the window scrolls: stuck under the pinned bars and as tall as the height
 * they leave.
 */
const STUCK = {
  blockSize: `calc(100dvh - var(${STICKY_TOP}, 0px))`,
  insetBlockStart: `var(${STICKY_TOP}, 0px)`,
  position: "sticky",
};

/**
 * Styles a plain, divided shell that scrolls its page.
 */
export const recipe = defineSlotRecipe({
  base: {
    aside: {
      ...PANEL,
      [PANEL_SIZE]: "sizes.aside",

      "&[data-overlaid]": {
        ...OVERLAID,
        "&[data-state=closed]": {
          ...SLID_OUT,
          _rtl: { translate: "-100% 0" },
          translate: "100% 0",
        },
        insetInlineEnd: "0",
      },
    },
    backdrop: {
      ...MOVING,
      background: "bg.inverted/40",
      inset: "0",
      opacity: "0",
      pointerEvents: "none",
      position: "fixed",
      transitionProperty: "opacity",
      zIndex: "overlay",

      "&[data-state=open]": { opacity: "1", pointerEvents: "auto" },
    },
    body: {
      display: "flex",
      flex: "1",
      minBlockSize: "0",
      position: "relative",

      "&:has(> [data-stacked])": { flexWrap: "wrap" },
      [`&:has(> [data-stacked]) > .${CLASS}__main`]: { flexBasis: "100%" },
    },
    content: {
      display: "flex",
      flexDirection: "column",
      flexShrink: "0",
      inlineSize: `var(${PANEL_SIZE})`,
      minBlockSize: "0",
      overflowY: "auto",

      "[data-collapse=icons] > &, [data-overlaid] > &, [data-stacked] > &": { inlineSize: "100%" },
    },
    footer: {
      flexShrink: "0",

      "&[data-sticky]": { ...PINNED, insetBlockEnd: "0", paddingBlockEnd: "safe.bottom" },
    },
    header: {
      flexShrink: "0",

      "&[data-sticky]": { ...PINNED, insetBlockStart: `var(${STICKY_OFFSET}, 0px)` },
    },
    main: { flex: "1", minInlineSize: "0" },
    navbar: {
      ...PANEL,
      [PANEL_SIZE]: "sizes.sidebar",

      "&[data-overlaid]": {
        ...OVERLAID,
        "&[data-state=closed]": {
          ...SLID_OUT,
          _rtl: { translate: "100% 0" },
          translate: "-100% 0",
        },
        insetInlineStart: "0",
      },
    },
    root: { display: "flex", flexDirection: "column", inlineSize: "100%" },
    trigger: { flexShrink: "0" },
  },
  className: CLASS,
  defaultVariants: { divided: true, scroll: "page", variant: "plain" },
  jsx: [/^AppShell(\.\w+)?$/u],
  slots: [
    "root",
    "header",
    "body",
    "navbar",
    "main",
    "aside",
    "footer",
    "content",
    "trigger",
    "backdrop",
  ],
  variants: {
    /**
     * Whether a hairline separates each bar and each panel from the page.
     *
     * @remarks
     *   The shell renders the lines, because only the shell knows where two of its regions meet. A
     *   sidebar inside a panel sets its ground and no line.
     */
    divided: {
      true: {
        aside: { borderColor: "border", borderInlineStartWidth: "hairline" },
        footer: { borderBlockStartWidth: "hairline", borderColor: "border" },
        header: { borderBlockEndWidth: "hairline", borderColor: "border" },
        navbar: { borderColor: "border", borderInlineEndWidth: "hairline" },
      },
    },

    /**
     * What scrolls under the bars: the main region inside a shell the height of the window, or the
     * window itself, with sticky bars pinned to it.
     */
    scroll: {
      page: { main: { overflowY: "auto" }, root: { blockSize: "100dvh" } },
      window: {
        aside: STUCK,
        body: { alignItems: "flex-start" },
        navbar: STUCK,
        root: { minBlockSize: "100dvh" },
      },
    },

    /**
     * How the page and the panels are set against the root's ground.
     *
     * @remarks
     *   `plain` puts everything on `bg`. `inset` gives the main region `surface()`, the panel
     *   ground with a hairline and a shadow, over a `bg.subtle` root. `floating` gives each
     *   panel's content `surface()` instead.
     */
    variant: {
      floating: {
        aside: { padding: dense("{spacing.gap.xs}") },
        content: { ...surface(), inlineSize: `calc(var(${PANEL_SIZE}) - {spacing.gap.md})` },
        navbar: { padding: dense("{spacing.gap.xs}") },
        root: { background: "bg.subtle" },
      },
      inset: {
        main: { ...surface(), margin: dense("{spacing.gap.xs}") },
        root: { background: "bg.subtle" },
      },
      plain: { root: { background: "bg" } },
    },
  },
});
