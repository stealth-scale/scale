/**
 * Recipe for a splitter: panels in a row or a column, with a resize trigger between two panels.
 *
 * @remarks
 *   The root is a flex row or column that fills its container: it grows in a flex container and is
 *   as tall and as wide as any other container. The machine sizes each panel inline, and a panel is
 *   a column its content can shrink in, so a scroll area inside it scrolls. The trigger is a strip
 *   `sizes.2` across, pulled over both panels by half its width, so the panels share the root as if
 *   it took no room. It stacks at `docked`, above a scroll area or other positioned content in the
 *   panel after it, which would take the pointer off half the strip. Under a coarse pointer a
 *   transparent pseudo-element widens the strip to `sizes.6`, the WCAG 2.5.8 target. The separator
 *   is a hairline along the strip's middle, and the indicator a pill `sizes.6` long on its centre.
 *   The line and the pill take the palette's solid while the pointer is over the strip, while it
 *   has focus and while it drags. The focus ring is on the pill, because the strip's own box is
 *   narrower than a ring, and on the strip of a trigger rendered without the pill. A disabled
 *   trigger keeps the line and hides the pill. Under forced colours the line is `CanvasText`, an
 *   active pill `Highlight` and the pill's ring `CanvasText`.
 */

import { defineSlotRecipe, onSlot, paletteVariants } from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, which a selector across its parts writes.
 */
export const CLASS = "splitter";

/**
 * Width of the trigger's strip across its line.
 */
const STRIP = "{sizes.2}";

/**
 * Width of the strip under a coarse pointer, the WCAG 2.5.8 target.
 */
const TOUCH = "{sizes.6}";

/**
 * Length of the indicator's pill along the line.
 */
const PILL = "{sizes.6}";

/**
 * Selects a part of a splitter whose panels sit in a row, where a trigger's line is vertical.
 */
const ACROSS = "&[data-orientation=horizontal]";

/**
 * Selects a part of a splitter whose panels sit in a column, where a trigger's line is horizontal.
 */
const DOWN = "&[data-orientation=vertical]";

/**
 * Selects a line or a pill while its trigger is under the pointer, has focus or drags.
 *
 * @remarks
 *   `data-focus-visible` is the attribute a still scene stages focus with.
 */
const ACTIVE = `.${CLASS}__resizeTrigger:is(:hover, [data-focus], [data-focus-visible], [data-dragging]):not([data-disabled]) > &`;

/**
 * Selects the pill while its trigger has keyboard focus.
 */
const RINGED = `.${CLASS}__resizeTrigger:is(:focus-visible, [data-focus-visible]) > &`;

/**
 * Selects a trigger that renders the pill, which then takes the trigger's focus ring.
 */
const PILLED = `&:has(> .${CLASS}__resizeTriggerIndicator)`;

/**
 * Defines the splitter recipe, in the primary palette by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    panel: { display: "flex", flexDirection: "column", minBlockSize: "0", minInlineSize: "0" },
    resizeTrigger: {
      _touch: {
        _before: { content: '""', position: "absolute" },
        [ACROSS]: {
          _before: { insetBlock: "0", insetInline: `calc((${TOUCH} - ${STRIP}) * -0.5)` },
        },
        [DOWN]: { _before: { insetBlock: `calc((${TOUCH} - ${STRIP}) * -0.5)`, insetInline: "0" } },
      },
      [ACROSS]: { inlineSize: STRIP, marginInline: `calc(${STRIP} * -0.5)` },
      alignItems: "center",
      display: "grid",
      [DOWN]: { blockSize: STRIP, marginBlock: `calc(${STRIP} * -0.5)` },
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
      justifyItems: "center",
      [PILLED]: { _focusVisible: { outlineStyle: "none" } },
      position: "relative",
      zIndex: "docked",
    },
    resizeTriggerIndicator: {
      _highContrast: { background: "Canvas", borderColor: "CanvasText", forcedColorAdjust: "none" },
      "&[data-disabled]": { visibility: "hidden" },
      [ACROSS]: { blockSize: PILL, inlineSize: STRIP },
      [ACTIVE]: {
        _highContrast: { background: "Highlight", borderColor: "Highlight" },
        background: "colorPalette.solid",
        borderColor: "colorPalette.solid",
      },
      background: "bg.panel",
      borderColor: "border.emphasized",
      borderRadius: "full",
      borderStyle: "solid",
      borderWidth: "hairline",
      boxShadow: "xs",
      [DOWN]: { blockSize: STRIP, inlineSize: PILL },
      gridArea: "1 / 1 / 2 / 2",
      position: "relative",
      [RINGED]: {
        _highContrast: { outlineColor: "CanvasText" },
        outlineColor: "colorPalette.focusRing",
        outlineOffset: "{spacing.ring}",
        outlineStyle: "solid",
        outlineWidth: "ring",
      },
      transitionDuration: "fast",
      transitionProperty: "common",
    },
    resizeTriggerSeparator: {
      _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
      [ACROSS]: { blockSize: "full", inlineSize: "{borderWidths.hairline}" },
      [ACTIVE]: { _highContrast: { background: "Highlight" }, background: "colorPalette.solid" },
      background: "border",
      [DOWN]: { blockSize: "{borderWidths.hairline}", inlineSize: "full" },
      gridArea: "1 / 1 / 2 / 2",
      transitionDuration: "fast",
      transitionProperty: "common",
    },
    root: {
      [ACROSS]: { flexDirection: "row" },
      blockSize: "full",
      colorPalette: "primary",
      display: "flex",
      [DOWN]: { flexDirection: "column" },
      flex: "1",
      inlineSize: "full",
      minBlockSize: "0",
      minInlineSize: "0",
      overflow: "hidden",
    },
  },
  className: CLASS,
  jsx: [/^Splitter(\.\w+)?$/u],
  slots: ["root", "panel", "resizeTrigger", "resizeTriggerSeparator", "resizeTriggerIndicator"],
  variants: {
    /**
     * Semantic palette of the line and the pill while the pointer is over a trigger, while it has
     * focus and while it drags, and of the focus ring. Without a value the root reads `primary`.
     */
    palette: onSlot("root", paletteVariants()),
  },
});
