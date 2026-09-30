/**
 * Styles a scroll area: a viewport that scrolls without the browser's scrollbars, a bar for each
 * axis that overflows, and the corner where the two bars meet.
 *
 * @remarks
 *   The machine places each bar against the root's end or bottom edge and moves the thumb inline.
 *   A bar shows only while its own axis overflows. The thumb is `border.emphasized`, which measures
 *   3:1 against every surface, and darkens to `fg.subtle` under the pointer. A bar pads its thumb
 *   by `spacing.0.5` on every side, so the bar takes a press on its padding, and the machine
 *   subtracts the padding from the thumb's travel. The root's outline is the focus ring, outside
 *   its edge while the viewport has keyboard focus, so the ring surrounds the bars, clears content
 *   at the edge, and is not masked by a fading edge. A component that places the area inside a box
 *   that clips it sets {@link RING_OFFSET} to a negative length, which moves the ring inside. A
 *   widget whose highlighted row shows where the keys go sets {@link RING_STYLE} to `none`.
 */

import {
  axis,
  defineSlotRecipe,
  dense,
  onSlot,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Custom property the root sets to a thumb's thickness.
 */
export const BAR = "--scroll-area-bar";

/**
 * Custom property the root sets to the padding between a bar's edge and its thumb.
 */
export const INSET = "--scroll-area-inset";

/**
 * Custom property the content sets to its padding.
 */
export const PAD = "--scroll-area-pad";

/**
 * Custom property a bar sets to its thumb's fill.
 */
export const THUMB = "--scroll-area-thumb";

/**
 * Custom property the viewport sets to the length a fading edge takes.
 */
export const FADE = "--scroll-area-fade";

/**
 * Custom property a composing recipe sets on the root to move the focus ring, `spacing.ring`
 * outside the root's edge when unset.
 */
export const RING_OFFSET = "--scroll-area-ring-offset";

/**
 * Custom property a composing recipe sets on the root to `none` to hide the focus ring, `solid`
 * when unset.
 */
export const RING_STYLE = "--scroll-area-ring-style";

/**
 * Selects a part that runs top to bottom.
 */
const VERTICAL = "&[data-orientation=vertical]";

/**
 * Selects a part that runs start to end.
 */
const HORIZONTAL = "&[data-orientation=horizontal]";

/**
 * Selects a bar while the pointer is over it or presses it.
 */
const ENGAGED = "&:is(:hover, :active)";

/**
 * Thickness of a bar at each size, from the grid.
 */
const THICKNESS = { lg: "{sizes.3}", md: "{sizes.2}", sm: "{sizes.1.5}", xs: "{sizes.1}" };

/**
 * Distance from an element's edge to the outer edge of its focus ring: the theme's ring offset
 * plus its width.
 *
 * @remarks
 *   The viewport scrolls a child that takes focus this far past the edge, so the child's ring
 *   shows whole.
 */
const RING = "calc(var(--focus-ring-offset, 0px) + var(--focus-ring-width, 0px))";

/**
 * Padding at the content's edge under a bar that always shows: the content's own padding, or the
 * bar's thickness where that is larger.
 */
const GUTTER = `max(var(${PAD}, 0px), calc(var(${BAR}) + var(${INSET}) * 2))`;

/**
 * Styles of the bars for each value of `variant`, in reading order.
 */
const SHOWN = onSlot(
  "scrollbar",
  axis(["hover", "always"], (shown): SystemStyleObject =>
    shown === "hover"
      ? {
          "&:is([data-hover], [data-scrolling], :focus-within > *)": {
            opacity: "1",
            transitionDelay: "none",
            transitionDuration: "faster",
          },
          opacity: "0",
          transitionDelay: "slow",
        }
      : { opacity: "1" },
  )(),
);

/**
 * Returns a mask gradient that fades one axis's edges by the distance the viewport can still
 * scroll towards each edge, up to the fade's length.
 *
 * @param direction - Direction of the gradient from the axis's start edge.
 * @param overflow - The axis whose overflow properties the machine writes on the viewport.
 * @returns The `linear-gradient` value.
 */
function faded(direction: string, overflow: "x" | "y"): string {
  const start = `min(var(${FADE}), var(--scroll-area-overflow-${overflow}-start, 0px))`;
  const end = `min(var(${FADE}), var(--scroll-area-overflow-${overflow}-end, 0px))`;

  return `linear-gradient(${direction}, transparent, #000 ${start}, #000 calc(100% - ${end}), transparent)`;
}

/**
 * Defines the scroll area recipe, with medium bars shown under the pointer by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    root: {
      "&:has(> .scroll-area__viewport:focus-visible)": {
        outlineColor: "border.focus",
        outlineOffset: `var(${RING_OFFSET}, {spacing.ring})`,
        outlineStyle: `var(${RING_STYLE}, solid)`,
        outlineWidth: "ring",
      },
      display: "flex",
      flexDirection: "column",
      [INSET]: "{spacing.0.5}",
      minBlockSize: "0",
      minInlineSize: "0",
    },
    scrollbar: {
      _highContrast: { [ENGAGED]: { [THUMB]: "Highlight" }, [THUMB]: "CanvasText" },
      [`${HORIZONTAL}:not([data-overflow-x])`]: { display: "none" },
      [`${VERTICAL}:not([data-overflow-y])`]: { display: "none" },
      borderRadius: "full",
      display: "flex",
      [ENGAGED]: { [THUMB]: "{colors.fg.subtle}" },
      [HORIZONTAL]: { blockSize: `calc(var(${BAR}) + var(${INSET}) * 2)`, flexDirection: "row" },
      padding: `var(${INSET})`,
      [THUMB]: "{colors.border.emphasized}",
      transitionDuration: "fast",
      transitionProperty: "opacity",
      [VERTICAL]: { flexDirection: "column", inlineSize: `calc(var(${BAR}) + var(${INSET}) * 2)` },
    },
    thumb: {
      _highContrast: { forcedColorAdjust: "none" },
      background: `var(${THUMB})`,
      borderRadius: "inherit",
      [HORIZONTAL]: { blockSize: "full" },
      transitionDuration: "fast",
      transitionProperty: "background-color",
      [VERTICAL]: { inlineSize: "full" },
    },
    viewport: {
      _focusVisible: { outline: "none" },
      "&::-webkit-scrollbar": { display: "none" },
      flexGrow: "1",
      minBlockSize: "0",
      overflow: "auto",
      scrollbarWidth: "none",
      scrollPadding: RING,
    },
  },
  className: "scroll-area",
  defaultVariants: { scrolls: "vertical", size: "md", variant: "hover" },
  jsx: [/^ScrollArea(\.\w+)?$/u],
  slots: ["root", "viewport", "content", "scrollbar", "thumb", "corner"],
  variants: {
    /**
     * Fades the viewport's edges towards the content that is scrolled out of view.
     *
     * @remarks
     *   The machine writes on the viewport how far it can still scroll towards each edge. An edge
     *   fades over that distance up to `sizes.8`, so an edge the content ends at does not fade.
     *   Under `dir="rtl"` the horizontal fade starts at the right edge.
     */
    fade: {
      true: {
        viewport: {
          "&:dir(rtl)": { maskImage: `${faded("to bottom", "y")}, ${faded("to left", "x")}` },
          [FADE]: "{sizes.8}",
          maskComposite: "intersect",
          maskImage: `${faded("to bottom", "y")}, ${faded("to right", "x")}`,
        },
      },
    },

    /**
     * Padding inside the content on every side, from 8px at `xs` to 20px at `lg` on the inset
     * scale.
     *
     * @remarks
     *   The viewport clips its content, so a child's focus ring at the content's edge needs the
     *   `xs` inset to show whole.
     */
    inset: onSlot(
      "content",
      sizeVariants(
        (size) => ({ [PAD]: dense(`{spacing.inset.${size}}`), padding: `var(${PAD})` }),
        ["xs", "sm", "md", "lg"],
      ),
    ),

    /**
     * Named size the viewport's height stops at, from `xs` at 20rem to `lg` at 32rem.
     *
     * @remarks
     *   Without it the area is as tall as its content, or as the room a parent with a definite
     *   height gives it.
     */
    maxHeight: onSlot(
      "viewport",
      sizeVariants((size) => ({ maxBlockSize: size }), ["xs", "sm", "md", "lg"]),
    ),

    /**
     * Axes the content grows along: `vertical` keeps it as wide as the viewport, and `horizontal`
     * and `both` let it grow to its widest child.
     *
     * @remarks
     *   A vertical area lays its content out at the viewport's width, as a region that scrolls on
     *   its own does, and a child wider than that scrolls sideways. An area that scrolls sideways
     *   grows its content, so the content's padding follows the last item of a row.
     */
    scrolls: onSlot(
      "content",
      axis(["vertical", "horizontal", "both"], (scrolls) => ({
        minInlineSize: scrolls === "vertical" ? "0" : "fit-content",
      }))(),
    ),

    /**
     * Thickness of the thumbs, from 4px at `xs` to 12px at `lg`. A bar is the thumb plus its
     * padding on each side.
     */
    size: onSlot(
      "root",
      sizeVariants((size) => ({ [BAR]: THICKNESS[size] }), ["xs", "sm", "md", "lg"]),
    ),

    /**
     * When the bars show: `hover` under the pointer, while the area scrolls and while focus is
     * inside it, over the content's edge, or `always`, beside the content.
     *
     * @remarks
     *   Under `always` the content's padding at an edge a bar runs along is at least the bar's
     *   thickness while that axis overflows, so the bar never covers the content.
     */
    variant: {
      ...SHOWN,
      always: {
        ...SHOWN.always,
        content: {
          "&[data-overflow-x]": { paddingBlockEnd: GUTTER },
          "&[data-overflow-y]": { paddingInlineEnd: GUTTER },
        },
      },
    },
  },
});
