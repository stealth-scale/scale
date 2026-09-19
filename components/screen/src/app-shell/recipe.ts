/**
 * Defines the styles an application shell is drawn with.
 *
 * @remarks
 *   Eleven parts. The root is a column of bars with a body between them, and the body lays a panel
 *   down either side of the page. A part left out takes no room, so a shell with one bar and no
 *   aside is the same component with fewer children.
 *   Every part is a bare container. The shell states where things go, what scrolls and how they
 *   move, and draws the hairlines between its regions. What the parts look like is the
 *   application's, through a theme. The backdrop is filled, because a backdrop is nothing else,
 *   and a pinned bar is filled, because the page scrolls under it.
 *   A panel in the body is a track whose width moves between the width it opens to and the width it
 *   closes to. What it holds keeps the open width, so the contents do not reflow while the track
 *   moves and the track clips them instead. A panel too wide for the window leaves the body, is
 *   fixed to the window and draws a backdrop behind it.
 */

import { defineSlotRecipe, surface } from "@stealthscale/theme/authoring";

/**
 * The class this recipe is compiled under, which a selector reaching across parts reads.
 *
 * @remarks
 *   The binding writes one class per part, `app-shell__main`, and stamps no attribute naming the
 *   part. A rule that selects another part therefore selects the class, and builds it from this
 *   constant so the two cannot drift.
 */
const CLASS = "app-shell";

/**
 * The property a panel states the width it opens to in.
 */
export const PANEL_SIZE = "--app-shell-panel-size";

/**
 * The property a panel states the width it closes to in.
 */
export const PANEL_RAIL = "--app-shell-panel-rail";

/**
 * The property each pinned bar reads the height of the bars above it from.
 */
export const STICKY_OFFSET = "--app-shell-sticky-offset";

/**
 * The property the root states the height of every pinned bar in.
 */
export const STICKY_TOP = "--app-shell-sticky-top";

/**
 * Writes how a part of the shell moves, and states no motion for a reader who asked for none.
 */
const MOVING = {
  _motionReduce: { transitionDuration: "0s" },
  transitionDuration: "moderate",
  transitionTimingFunction: "in-smooth",
};

/**
 * Writes what a panel laid over the page is placed by.
 *
 * @remarks
 *   Fixed to the window rather than placed in the body, so one rule answers both ways a shell
 *   scrolls. It stops short of the far edge, so the page behind it stays in sight, and it clears
 *   the notch and the home bar where the application draws under them.
 *   It keeps its width while it is closed and slides out instead, because a sheet that narrows to
 *   nothing reads as the page pushing it away rather than as the sheet leaving.
 */
const OVERLAID = {
  blockSize: "100dvh",
  inlineSize: `min(var(${PANEL_SIZE}), calc(100dvw - {sizes.16}))`,
  insetBlock: "0",
  paddingBlockEnd: "safe.bottom",
  paddingBlockStart: "safe.top",
  position: "fixed",
  transitionProperty: "translate, visibility",
  zIndex: "modal",
};

/**
 * Writes what both panels share.
 *
 * @remarks
 *   A panel closed to nothing is taken out of sight once it has stopped moving, so whatever border
 *   the application gave it leaves no line behind. Visibility is what the shell can own; the border
 *   is the application's.
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
  "&[data-collapse=icons]": { [PANEL_RAIL]: "sizes.16" },
  "&[data-stacked]": { flexBasis: "100%", inlineSize: "100%", order: "1", position: "static" },
  "&[data-state=closed]": { inlineSize: `var(${PANEL_RAIL})` },
};

/**
 * Writes what a bar pinned to the window is placed by.
 *
 * @remarks
 *   The fill is not optional. A pinned bar has the page scrolling under it, and a bar with no fill
 *   shows the page through itself.
 */
const PINNED = { background: "bg", position: "sticky", zIndex: "sticky" };

/**
 * Writes what a panel is placed by while the window is what scrolls: stuck under the bars pinned
 * above it, and as tall as the room they leave.
 */
const STUCK = {
  blockSize: `calc(100dvh - var(${STICKY_TOP}, 0px))`,
  insetBlockStart: `var(${STICKY_TOP}, 0px)`,
  position: "sticky",
};

/**
 * Draws a plain shell that scrolls its page.
 */
export const recipe = defineSlotRecipe({
  base: {
    aside: {
      ...PANEL,
      [PANEL_SIZE]: "sizes.80",

      "&[data-overlaid]": {
        ...OVERLAID,
        "&[data-state=closed]": { _rtl: { translate: "-100% 0" }, translate: "100% 0" },
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
      [PANEL_SIZE]: "sizes.64",

      "&[data-overlaid]": {
        ...OVERLAID,
        "&[data-state=closed]": { _rtl: { translate: "100% 0" }, translate: "-100% 0" },
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
     * Whether a hairline parts each bar and each panel from the page.
     *
     * @remarks
     *   The lines are the shell's, because the edge between two of its regions is a thing only the
     *   shell knows about. A sidebar inside a panel draws its ground and no line of its own.
     */
    divided: {
      true: {
        aside: { borderColor: "border", borderInlineStartWidth: "sm" },
        footer: { borderBlockStartWidth: "sm", borderColor: "border" },
        header: { borderBlockEndWidth: "sm", borderColor: "border" },
        navbar: { borderColor: "border", borderInlineEndWidth: "sm" },
      },
    },

    /**
     * What scrolls under the bars: the page inside a shell the height of the window, or the window
     * itself with the bars told to stick pinning to it.
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
     * How the page and the panels are set against the ground behind them.
     */
    variant: {
      floating: {
        aside: { padding: "gap.xs" },
        content: { ...surface(), inlineSize: `calc(var(${PANEL_SIZE}) - {spacing.gap.md})` },
        navbar: { padding: "gap.xs" },
        root: { background: "bg.subtle" },
      },
      inset: {
        main: { ...surface(), margin: "gap.xs" },
        root: { background: "bg.subtle" },
      },
      plain: { root: { background: "bg" } },
    },
  },
});
