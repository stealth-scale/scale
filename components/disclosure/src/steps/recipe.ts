/**
 * Recipe for the steps: a list of numbered discs with a title, the rules between them, the content
 * of the current step and the buttons that move between steps.
 *
 * @remarks
 *   The machine writes `data-orientation` on the root, the list, the items, the triggers and the
 *   rules, so a vertical flow is a column of steps beside the content and a horizontal flow is a
 *   row above it. The machine marks a disc and a rule with `data-complete`, `data-current` or
 *   `data-incomplete`, and the looks read those. The size writes the disc's side and the gap around
 *   it as custom properties on the root, which the rules read to meet the discs. A rule is a
 *   border, so forced colors paint it in `CanvasText`. The recipe has no `effect` axis, because
 *   the discs change on every step and an effect would move with them.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the recipe offers.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Side of a disc, which the root sets per size.
 */
const DISC = "var(--steps-disc)";

/**
 * Room between a disc and the rule beside it, which the root sets per size.
 */
const GUTTER = "var(--steps-gutter)";

/**
 * Thickness of a rule and of an outlined disc's edge.
 */
const THICKNESS = "{borderWidths.indicator}";

/**
 * Selects an item of a list that is too narrow for its steps with the titles beside the discs.
 */
const CROWDED_ITEM = "[data-crowded] > &";

/**
 * Selects a trigger or a rule inside such a list.
 */
const CROWDED_PART = "[data-crowded] &";

/**
 * Selects an item while the list measures its steps at their natural width.
 */
const MEASURED_ITEM = "[data-measuring] > &";

/**
 * Lays an item out as a centred column of its disc over its words, for titles below the discs.
 */
const BELOW_ITEM = { _last: { flex: "1 0 0" }, flexDirection: "column", textAlign: "center" };

/**
 * Runs a rule from the centre line of one disc to the next, one gutter clear of both, for titles
 * below the discs.
 */
const BELOW_SEPARATOR = {
  insetBlockStart: `calc(${DISC} / 2 - ${THICKNESS} / 2)`,
  insetInlineEnd: `calc(-50% + ${DISC} / 2 + ${GUTTER})`,
  insetInlineStart: `calc(50% + ${DISC} / 2 + ${GUTTER})`,
  marginInlineEnd: "0",
  position: "absolute",
};

/**
 * Stacks a trigger's disc over its words, for titles below the discs.
 */
const BELOW_TRIGGER = { flexDirection: "column", textAlign: "center" };

/**
 * Fills a completed disc with `Highlight` under forced colors, so it is distinct from the outlined
 * discs around it.
 */
const FORCED_COMPLETE = {
  _highContrast: {
    background: "Highlight",
    borderColor: "Highlight",
    color: "HighlightText",
    forcedColorAdjust: "none",
  },
};

/**
 * Rings the current disc with `Highlight` on `Canvas` under forced colors, so it is distinct from
 * the outlined discs of the later steps.
 */
const FORCED_CURRENT = {
  _highContrast: {
    background: "Canvas",
    borderColor: "Highlight",
    borderStyle: "solid",
    borderWidth: THICKNESS,
    color: "CanvasText",
    forcedColorAdjust: "none",
  },
};

/**
 * Defines the steps recipe: solid discs at size `md` in the neutral palette with the titles beside
 * them, by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: { _vertical: { flex: "1" }, minInlineSize: "0" },
    description: { color: "fg.muted" },
    indicator: {
      _highContrast: { borderColor: "CanvasText", borderStyle: "solid", borderWidth: "hairline" },
      alignItems: "center",
      blockSize: DISC,
      borderRadius: "full",
      display: "inline-flex",
      flexShrink: "0",
      fontVariantNumeric: "tabular-nums",
      fontWeight: "medium",
      inlineSize: DISC,
      justifyContent: "center",
      transitionDuration: "press",
      transitionProperty: "common",
      transitionTimingFunction: "press",
    },
    item: {
      _horizontal: {
        _last: { flex: "0 0 auto" },
        alignItems: "center",
        flex: "1 0 0",
        [MEASURED_ITEM]: { flex: "0 0 auto" },
      },
      _vertical: { alignItems: "flex-start" },
      display: "flex",
      gap: GUTTER,
      minInlineSize: "0",
      position: "relative",
    },
    list: {
      _horizontal: { alignItems: "center", flexDirection: "row" },
      _vertical: { flexDirection: "column" },
      display: "flex",
      listStyle: "none",
      margin: "0",
      padding: "0",
    },
    root: {
      _horizontal: { flexDirection: "column" },
      _vertical: { flexDirection: "row" },
      display: "flex",
      inlineSize: "full",
    },
    separator: {
      _horizontal: {
        borderBlockStartWidth: THICKNESS,
        flex: "1",
        marginInlineEnd: GUTTER,
        minInlineSize: GUTTER,
      },
      _vertical: {
        borderInlineStartWidth: THICKNESS,
        insetBlockEnd: GUTTER,
        insetBlockStart: `calc(${DISC} + ${GUTTER})`,
        insetInlineStart: `calc(${DISC} / 2 - ${THICKNESS} / 2)`,
        position: "absolute",
      },
      borderColor: "border",
      borderRadius: "full",
    },
    status: { srOnly: true },
    title: { "&[data-incomplete]": { color: "fg.muted" }, color: "fg", fontWeight: "medium" },
    trigger: {
      _disabled: { cursor: "disabled" },
      alignItems: "center",
      borderRadius: "l2",
      cursor: "button",
      display: "flex",
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
      gap: GUTTER,
      minInlineSize: "0",
      textAlign: "start",
      userSelect: "none",
    },
  },
  className: "steps",
  defaultVariants: {
    labelPlacement: "beside",
    palette: "neutral",
    size: "md",
    variant: "solid",
  },
  jsx: [/^Steps(\.\w+)?$/u],
  slots: [
    "root",
    "list",
    "item",
    "trigger",
    "indicator",
    "title",
    "status",
    "description",
    "separator",
    "content",
    "nextTrigger",
    "prevTrigger",
  ],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Place of the titles in a horizontal flow: beside each disc, or centred below it.
     *
     * @remarks
     *   Below, every item takes an equal share of the row and stacks its disc over its words in a
     *   centred column, with a trigger or without one, and each rule runs from one disc to the next
     *   across the gap between the items, one gutter clear of both. Beside falls back to below
     *   while the list is too narrow for its steps at their natural width, which the list measures
     *   and marks with `data-crowded`. A vertical flow keeps the titles beside the discs either
     *   way.
     */
    labelPlacement: {
      below: {
        item: { _horizontal: BELOW_ITEM },
        separator: { _horizontal: BELOW_SEPARATOR },
        trigger: { _horizontal: BELOW_TRIGGER },
      },
      beside: {
        item: { _horizontal: { [CROWDED_ITEM]: BELOW_ITEM } },
        separator: { _horizontal: { [CROWDED_PART]: BELOW_SEPARATOR } },
        trigger: { _horizontal: { [CROWDED_PART]: BELOW_TRIGGER } },
      },
    },

    /**
     * Palette the discs and the completed rules read, set on the root.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Size of the discs on the control scale, the titles, the descriptions and the room around
     * them.
     *
     * @remarks
     *   The discs measure 36, 40 and 44px. An icon in a disc is on the icon scale one step below
     *   the size. In a vertical flow every item but the last leaves two insets below its trigger,
     *   so the rule under a disc with a title and a description is 21px long at `md`.
     */
    size: onSlots({
      description: sizeVariants((size) => ({ textStyle: `body.${below(size)}` }), SIZES),
      indicator: sizeVariants(
        (size) => ({
          "& > svg": { boxSize: dense(`{sizes.icon.${below(size)}}`) },
          textStyle: `label.${size}`,
        }),
        SIZES,
      ),
      item: sizeVariants(
        (size) => ({
          _vertical: {
            _last: { paddingBlockEnd: "0" },
            paddingBlockEnd: dense(`calc({spacing.inset.${size}} * 2)`),
          },
        }),
        SIZES,
      ),
      root: sizeVariants(
        (size) => ({
          "--steps-disc": dense(`{sizes.control.${size}}`),
          "--steps-gutter": dense(`{spacing.gap.${size}}`),
          gap: dense(`{spacing.inset.${size}}`),
        }),
        SIZES,
      ),
      title: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
    }),

    /**
     * Look of the discs and of the rules between completed steps.
     *
     * @remarks
     *   `solid` outlines a later step's disc, rings the current disc and fills a completed one with
     *   the palette's solid color. `subtle` fills every disc from the palette: its subtle role for
     *   a later step, its muted role for a completed one and its emphasized role for the current
     *   one. The three roles step away from the page in both color modes, so the current disc is
     *   the strongest by day and after dark.
     */
    variant: {
      solid: {
        indicator: {
          "&[data-complete]": {
            ...FORCED_COMPLETE,
            background: "colorPalette.solid",
            borderColor: "colorPalette.solid",
            borderStyle: "solid",
            borderWidth: THICKNESS,
            color: "colorPalette.contrast",
          },
          "&[data-current]": {
            ...FORCED_CURRENT,
            background: "colorPalette.subtle",
            borderColor: "colorPalette.solid",
            borderStyle: "solid",
            borderWidth: THICKNESS,
            color: "colorPalette.fg",
          },
          "&[data-incomplete]": {
            borderColor: "border",
            borderStyle: "solid",
            borderWidth: THICKNESS,
            color: "fg.muted",
          },
        },
        separator: {
          "&[data-complete]": {
            _highContrast: { borderColor: "Highlight", forcedColorAdjust: "none" },
            borderColor: "colorPalette.solid",
          },
        },
      },

      subtle: {
        indicator: {
          "&[data-complete]": {
            ...FORCED_COMPLETE,
            background: "colorPalette.muted",
            color: "colorPalette.fg",
          },
          "&[data-current]": {
            ...FORCED_CURRENT,
            background: "colorPalette.emphasized",
            color: "colorPalette.fg",
          },
          "&[data-incomplete]": { background: "colorPalette.subtle", color: "fg.muted" },
        },
        separator: {
          "&[data-complete]": {
            _highContrast: { borderColor: "Highlight", forcedColorAdjust: "none" },
            borderColor: "colorPalette.emphasized",
          },
        },
      },
    },
  },
});
