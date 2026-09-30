/**
 * Names the custom properties and attributes the app shell reads, and defines the style objects
 * its recipe is written from.
 *
 * @remarks
 *   The module keeps the recipe under the 300-line limit. It imports no React, because the theme
 *   plugin evaluates the recipe in Node.
 */

import { dense, interactive } from "@stealthscale/theme/authoring";

/**
 * The recipe's class name, used to build the selectors from one part to another.
 *
 * @remarks
 *   The binding writes one class per part, such as `app-shell__main`, and no part attribute, so a
 *   selector across parts targets the class built from this constant.
 */
export const CLASS = "app-shell";

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
 * Custom property an ancestor sets to the height of the shell's window.
 *
 * @remarks
 *   A box that stages a shell at a fixed height sets it, and also contains the shell's fixed
 *   parts with `contain: layout`. Unset, the window is the viewport.
 */
export const WINDOW_HEIGHT = "--app-shell-window-height";

/**
 * Height of the shell's window: the ancestor's `WINDOW_HEIGHT`, or the dynamic viewport height.
 */
export const WINDOW = `var(${WINDOW_HEIGHT}, 100dvh)`;

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
export const MOVING = {
  _motionReduce: { transitionDuration: "0s" },
  transitionDuration: "move",
  transitionTimingFunction: "move",

  [`.${CLASS}__root:not([${SETTLED}]) &`]: { transitionDuration: "0s" },
};

/**
 * Width of a panel over the page: its open width, and never closer than a rail's width to the far
 * edge of the window.
 *
 * @remarks
 *   The percentage resolves against the sheet's containing block, which is the viewport, or a box
 *   with `contain: layout` that stages the shell.
 */
export const SHEET = `min(var(${PANEL_SIZE}), calc(100% - {sizes.rail}))`;

/**
 * Styles a panel over the page: fixed to the window, a rail's width short of the far edge, and
 * inside the safe area.
 *
 * @remarks
 *   The panel is fixed to the window, so one rule applies to both scroll modes. A closed sheet
 *   keeps its width and slides out. Its visibility changes with no duration: a closing sheet
 *   becomes hidden after a delay as long as the slide, and an opening sheet becomes visible at
 *   once. The shell moves focus into a sheet in the commit that opens it, and a browser does not
 *   focus a hidden element. A sheet is a raised surface over the backdrop: the panel ground and the
 *   `lg` shadow. A sidebar inside it paints its own ground over the panel's.
 */
export const OVERLAID = {
  _motionReduce: { transitionDelay: "0s" },
  background: "bg.panel",
  blockSize: WINDOW,
  boxShadow: "lg",
  inlineSize: SHEET,
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
 * Styles a closed sheet on either side: it keeps its open width, and the visibility changes after
 * the slide has ended.
 *
 * @remarks
 *   The width is written again here, because the panel's closed width is an equally specific rule
 *   that the compiler emits after the sheet's own.
 */
export const SLID_OUT = { inlineSize: SHEET, transitionDelay: "0s, {durations.moderate}" };

/**
 * Styles both panels: a track between the open and closed widths.
 *
 * @remarks
 *   A panel closed to nothing becomes hidden after its transition, so a border the application
 *   gives it is not visible. The shell sets the visibility, and the application sets the border.
 */
export const PANEL = {
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
export const PINNED = { background: "bg.panel", position: "sticky", zIndex: "sticky" };

/**
 * Selects a panel that is in the body: neither over the page nor under it.
 */
export const BESIDE = "&:not([data-overlaid], [data-stacked])";

/**
 * Styles a panel in the body while the window scrolls: stuck under the pinned bars and as tall as
 * the height they leave.
 *
 * @remarks
 *   The rule selects a panel beside the page only, because the window-scroll look is a variant and
 *   applies over the base, where a sheet is fixed and a panel under the page is static.
 */
export const STUCK = {
  [BESIDE]: {
    blockSize: `calc(${WINDOW} - var(${STICKY_TOP}, 0px))`,
    insetBlockStart: `var(${STICKY_TOP}, 0px)`,
    position: "sticky",
  },
};

/**
 * Styles a band of a panel or of the main region: a padded column, growing to the room left with
 * `data-grows`.
 *
 * @remarks
 *   A band that scrolls is inside a scroll area whose root is the `scroller`, so the band pads what
 *   scrolls and the bar is at the scroller's edge.
 */
export const SECTION = {
  display: "flex",
  flexDirection: "column",
  flexShrink: "0",
  gap: dense("{spacing.gap.md}"),
  minBlockSize: "0",
  minInlineSize: "0",
  padding: dense("{spacing.gap.lg}"),

  "&[data-grows]": { flex: "1" },
};

/**
 * Styles the root of a band that scrolls: it keeps its height, or grows to the room left with
 * `data-grows`, and shrinks below its content, so its viewport scrolls.
 */
export const SCROLLER = {
  flexShrink: "0",
  minBlockSize: "0",
  minInlineSize: "0",

  "&[data-grows]": { flex: "1" },
};

/**
 * Styles the content of a region's scroll area: a column at least as tall as the viewport.
 *
 * @remarks
 *   A page grows to the column's height, so a short page still fills the main region. A sidebar
 *   in a panel takes the column's height exactly and scrolls its own list, so the header and the
 *   footer of the sidebar remain in place.
 */
export const COLUMN = {
  display: "flex",
  flexDirection: "column",
  minBlockSize: "100%",

  "& > .sidebar__root": { flex: "1 1 0", minBlockSize: "0" },
};

/**
 * Styles the rail: a 24px strip centred on the edge between a panel and the page, with a line down
 * its middle under the pointer and on keyboard focus.
 *
 * @remarks
 *   The negative margins take the strip's width back from the row, so the strip overlaps the panel
 *   and the page by 12px each and moves neither. The strip is hidden under a coarse pointer, where
 *   a finger presses the menu button instead.
 */
export const RAIL = {
  ...interactive(),
  _after: {
    background: "transparent",
    content: '""',
    inlineSize: "{borderWidths.indicator}",
    insetBlock: "0",
    insetInlineStart: "calc(50% - {borderWidths.indicator} / 2)",
    position: "absolute",
  },
  _focusVisible: { _after: { background: "colorPalette.focusRing" } },
  _hover: { _after: { background: "border.emphasized" } },
  _touch: { display: "none" },
  alignSelf: "stretch",
  appearance: "none",
  background: "transparent",
  borderWidth: "0",
  colorPalette: "neutral",
  flexShrink: "0",
  inlineSize: "6",
  marginInline: "calc({sizes.6} / -2)",
  padding: "0",
  position: "relative",
  zIndex: "docked",
};
