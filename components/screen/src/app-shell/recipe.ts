/**
 * Declares the app shell's slot recipe, which lays out a column of bars with a body between them
 * and a panel on either side of the page in the body.
 *
 * @remarks
 *   The recipe has eighteen slots. The body, the main region, a panel's content and a band that
 *   scrolls are the primitives package's scroll areas, so every bar in the shell is the theme's:
 *   `bodyViewport` and `row` are the body's viewport and content, `mainViewport` is the `main`
 *   element, `column` is the content of the main region and of a panel, and `scroller` is the root
 *   of a band that scrolls. A part that is left out takes no room. Every part is a container: the
 *   recipe sets the layout, the scrolling, the motion, the hairlines between regions and the
 *   grounds, and the application styles the rest through a theme. The plain look fills no region,
 *   so the shell shows the ground it is placed on. The backdrop, a sheet and a pinned bar are
 *   filled, because the page is visible under each. A sheet is raised by a shadow. A panel in the
 *   body is a track whose width moves between its open and closed widths, and its content keeps the
 *   open width, so the track clips the content instead of reflowing it. A panel over the page is
 *   fixed to the window with a backdrop behind it. The open and closed widths are the theme's
 *   `sizes.sidebar`, `sizes.aside` and `sizes.rail` unless a panel states its own. The window's
 *   height is `100dvh` unless an ancestor sets `WINDOW_HEIGHT`, so a shell staged in a box of a
 *   fixed height fills the box. The header and the footer pad their content by the middle gap, the
 *   status bar pads its row of entries by the smallest gap above and below and the middle gap at
 *   the sides, and a section pads by the large gap. The recipe has no `palette` and no `effect`
 *   axis, because the parts are containers and the components inside them offer their own.
 */

import { defineSlotRecipe, dense, surface } from "@stealthscale/theme/authoring";

import {
  CLASS,
  COLUMN,
  MOVING,
  OVERLAID,
  PANEL,
  PANEL_SIZE,
  PINNED,
  RAIL,
  SCROLLER,
  SECTION,
  SLID_OUT,
  STICKY_OFFSET,
  STUCK,
  WINDOW,
} from "#app-shell/metrics.ts";

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
    body: { flex: "1", minBlockSize: "0", position: "relative" },
    column: COLUMN,
    content: {
      flexShrink: "0",
      inlineSize: `var(${PANEL_SIZE})`,
      minBlockSize: "0",

      "[data-collapse=icons] > &, [data-overlaid] > &, [data-stacked] > &": { inlineSize: "100%" },
    },
    footer: {
      flexShrink: "0",
      padding: dense("{spacing.gap.md}"),

      "&[data-sticky]": {
        ...PINNED,
        insetBlockEnd: "0",
        paddingBlockEnd: `calc(${dense("{spacing.gap.md}")} + {spacing.safe.bottom})`,
      },
    },
    header: {
      flexShrink: "0",
      padding: dense("{spacing.gap.md}"),

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
    rail: RAIL,
    root: { display: "flex", flexDirection: "column", inlineSize: "100%" },
    row: {
      display: "flex",

      "&:has(> [data-stacked])": { flexWrap: "wrap" },
      [`&:has(> [data-stacked]) > .${CLASS}__main`]: { flexBasis: "100%" },
    },
    scroller: SCROLLER,
    section: SECTION,
    status: {
      alignItems: "center",
      columnGap: dense("{spacing.gap.md}"),
      display: "flex",
      flexShrink: "0",
      flexWrap: "wrap",
      paddingBlock: dense("{spacing.gap.xs}"),
      paddingInline: dense("{spacing.gap.md}"),
      rowGap: dense("{spacing.gap.xs}"),
    },
    trigger: { flexShrink: "0" },
  },
  className: CLASS,
  defaultVariants: { divided: true, scroll: "page", variant: "plain" },
  jsx: [/^AppShell(\.\w+)?$/u],
  slots: [
    "root",
    "header",
    "body",
    "bodyViewport",
    "row",
    "navbar",
    "main",
    "mainViewport",
    "aside",
    "footer",
    "status",
    "content",
    "column",
    "section",
    "scroller",
    "trigger",
    "rail",
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
        status: { borderBlockStartWidth: "hairline", borderColor: "border" },
      },
    },

    /**
     * What scrolls under the bars: the main region inside a shell the height of the window, or the
     * window itself, with sticky bars pinned to it.
     *
     * @remarks
     *   The main region and the body are scroll areas, and this axis turns each viewport's
     *   scrolling on or off. While a panel has dropped under the page, the body scrolls the main
     *   region and the panel together, so a person scrolls down to the panel under the page. While
     *   the window scrolls, neither viewport scrolls, and the browser's own bar scrolls the page.
     */
    scroll: {
      page: {
        bodyViewport: {
          [`&:has(> .${CLASS}__row > [data-stacked])`]: { overflow: "auto" },
          overflow: "visible",
        },
        mainViewport: {
          [`.${CLASS}__row:has(> [data-stacked]) > .${CLASS}__main > &`]: { overflow: "visible" },
        },
        root: { blockSize: WINDOW },
        row: { "&:has(> [data-stacked])": { blockSize: "auto" }, blockSize: "100%" },
      },
      window: {
        aside: STUCK,
        bodyViewport: { overflow: "visible" },
        mainViewport: { overflow: "visible" },
        navbar: STUCK,
        root: { minBlockSize: WINDOW },
        row: { alignItems: "flex-start" },
      },
    },

    /**
     * How the page and the panels are set against the root's ground.
     *
     * @remarks
     *   `plain` fills nothing, so every region shows the ground the shell is placed on: the page's
     *   `bg` in an application, or a staging box's own fill. A sidebar in a panel paints its own
     *   ground. `inset` gives the main region `surface()`, the panel ground with a hairline and a
     *   shadow, over a `bg.subtle` root. `floating` gives each panel's content `surface()` instead.
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
      plain: { root: { background: "transparent" } },
    },
  },
});
