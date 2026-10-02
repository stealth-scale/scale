/**
 * Recipe for the accordion: a column of items, each a heading whose trigger shows and hides the
 * content under it.
 *
 * @remarks
 *   The trigger fills its heading, sets its title in the label style and puts the indicator at its
 *   end, so an icon or an avatar before the title leaves the indicators in one column. The trigger
 *   is at least a control's height and grows with a title that wraps. A heading with a second child
 *   after the trigger, such as an action button, places that child at the end of the row, outside
 *   the button. The content animates to the height the collapsible machine measures, and the body
 *   inside it has the padding, so the animation runs down to zero height. The subtle, surface
 *   and outline looks inset the trigger and the body from the box's edges. The flushed and plain
 *   looks align both with the text around the accordion. The recipe has no `effect` axis, because
 *   the box contains content as well as the triggers, and a glow marks a control.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  iconSizes,
  interactive,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
  surface,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the recipe offers.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Selects a heading that contains a second child after its trigger.
 */
const FOLLOWED = "&:has(> :nth-child(2))";

/**
 * Places the focus ring one ring width inside the trigger's edge, for the looks whose root clips
 * what falls outside it.
 */
const INSIDE = { _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" } };

/**
 * Removes the inline inset of the trigger and the body, for the looks that align their text with
 * the text around the accordion.
 */
const FLUSH = { paddingInline: "0" };

/**
 * Removes the end inset a heading gives the child after its trigger, for the same looks.
 */
const FLUSH_END = { [FOLLOWED]: { paddingInlineEnd: "0" } };

/**
 * Rules a hairline under every item but the last.
 */
const DIVIDED = {
  _last: { borderBlockEndWidth: "0" },
  borderBlockEndWidth: "hairline",
};

/**
 * Defines the accordion recipe: flushed items at size `md` in the neutral palette, sliding open,
 * by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    item: { overflowAnchor: "none" },
    itemContent: { overflow: "hidden" },
    itemHeading: { alignItems: "center", display: "flex" },
    itemIndicator: {
      _motionReduce: { transitionDuration: "none" },
      _open: { rotate: "180deg" },
      alignItems: "center",
      color: "fg.muted",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      marginInlineStart: "auto",
      transitionDuration: "press",
      transitionProperty: "rotate, color",
      transitionTimingFunction: "press",
    },
    itemTrigger: {
      ...interactive(),
      _hover: { "& .accordion__itemIndicator": { color: "fg" } },
      "& > svg": { flexShrink: "0" },
      alignItems: "center",
      display: "flex",
      flex: "1",
      minInlineSize: "0",
      textAlign: "start",
    },
    root: { inlineSize: "full" },
  },
  className: "accordion",
  defaultVariants: { motion: "slide", palette: "neutral", size: "md", variant: "flushed" },
  jsx: [/^Accordion(\.\w+)?$/u],
  slots: ["root", "item", "itemHeading", "itemTrigger", "itemIndicator", "itemContent", "itemBody"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Animation of the content as it opens and closes.
     */
    motion: {
      fade: {
        itemContent: {
          _closed: { animationStyle: "fade.out" },
          _open: { animationStyle: "fade.in" },
        },
      },
      none: { itemContent: { animation: "none" } },
      slide: {
        itemContent: {
          _closed: { animationStyle: "collapse.out" },
          _open: { animationStyle: "collapse.in" },
        },
      },
    },

    /**
     * Palette the looks read, set on the root.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Size of the trigger on the control scale, the indicator on the icon scale, and the body's
     * padding and text.
     *
     * @remarks
     *   A trigger is at least a control's height. Its block padding is the gap one step below, so a
     *   one-line title centres in that height and a title that wraps adds its lines. A leading icon
     *   is on the icon scale one step below the indicator. The body starts one gap below the
     *   trigger and ends one inset above the next item.
     */
    size: onSlots({
      itemBody: sizeVariants(
        (size) => ({
          paddingBlockEnd: dense(`{spacing.inset.${size}}`),
          paddingBlockStart: dense(`{spacing.gap.${below(size)}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
          textStyle: `body.${size}`,
        }),
        SIZES,
      ),
      itemHeading: sizeVariants(
        (size) => ({
          [FOLLOWED]: { paddingInlineEnd: dense(`{spacing.inset.${below(size)}}`) },
          gap: dense(`{spacing.gap.${size}}`),
        }),
        SIZES,
      ),
      itemIndicator: iconSizes(SIZES),
      itemTrigger: sizeVariants(
        (size) => ({
          "&:not(:last-child)": { paddingInlineEnd: "0" },
          "& > svg": { boxSize: dense(`{sizes.icon.${below(size)}}`) },
          gap: dense(`{spacing.gap.${size}}`),
          minBlockSize: dense(`{sizes.control.${size}}`),
          paddingBlock: dense(`{spacing.gap.${below(size)}}`),
          paddingInline: dense(`{spacing.inset.${size}}`),
          textStyle: `label.${size}`,
        }),
        SIZES,
      ),
    }),

    /**
     * Look of the items and the box around them.
     *
     * @remarks
     *   `subtle` fills the open item from the palette and fills a trigger under the pointer.
     *   `surface` is the theme's panel, with its shadow, and `outline` a hairline box, both with a
     *   hairline between items. `flushed` rules a hairline under every item and renders no box.
     *   `plain` renders no line. The boxed looks clip their content to the box's corners and place
     *   the focus ring inside the trigger. The rules and the outline read the palette's muted role,
     *   and the surface's rules read the panel's edge color.
     */
    variant: {
      subtle: {
        item: { _open: { background: "colorPalette.subtle" }, borderRadius: "l2" },
        itemTrigger: {
          ...INSIDE,
          _hover: { background: "colorPalette.subtle" },
          _open: {
            _hover: { background: "colorPalette.muted" },
            borderEndEndRadius: "0",
            borderEndStartRadius: "0",
          },
          borderRadius: "l2",
        },
      },

      surface: {
        item: { ...DIVIDED, borderBlockEndColor: "border" },
        itemTrigger: { ...INSIDE, _hover: { background: "colorPalette.subtle" } },
        root: { ...surface(), overflow: "clip" },
      },

      outline: {
        item: { ...DIVIDED, borderBlockEndColor: "colorPalette.muted" },
        itemTrigger: { ...INSIDE, _hover: { background: "colorPalette.subtle" } },
        root: {
          borderColor: "colorPalette.muted",
          borderRadius: "l2",
          borderWidth: "hairline",
          overflow: "clip",
        },
      },

      flushed: {
        item: { borderBlockEndColor: "colorPalette.muted", borderBlockEndWidth: "hairline" },
        itemBody: FLUSH,
        itemHeading: FLUSH_END,
        itemTrigger: FLUSH,
      },

      plain: { itemBody: FLUSH, itemHeading: FLUSH_END, itemTrigger: FLUSH },
    },
  },
});
