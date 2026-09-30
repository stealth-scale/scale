/**
 * Recipe for the date input: a label, and a field of segments a person types a date into, with a
 * clear trigger at its end.
 *
 * @remarks
 *   Six slots. The segment group is the field box: it reads the theme's field fragment, its three
 *   looks, its status axis and the control scale, so a date input, a select and an input of one
 *   size match, and it rings while a segment inside it has focus. The segments are side by side
 *   with no gap, the literal separators among them. Each editable segment is at least 24px square,
 *   the pointer target WCAG 2.5.8 sets, because a one-digit day is 12px wide. The group's insets
 *   are an input's less the segments' own padding, so a two-digit segment's text starts within 2px
 *   of the line an input's text starts on. A focused segment
 *   fills with the palette's solid and its contrast ink, and `Highlight` under forced colors.
 *   Placeholders and separators take the muted ink. The two groups of a range are one gap apart,
 *   with the caller's glyph between them at the size of the field's glyphs. The clear trigger is
 *   the input group's square, placed where the combobox places its trigger, and the last group
 *   keeps room for it while it shows. The recipe has no `palette` axis, because a field's color
 *   reports a state, and no `effect` axis, because a glow would compete with the focus ring and the
 *   status edge.
 */

import {
  below,
  controlSizes,
  defineSlotRecipe,
  dense,
  field,
  FIELD_EDGE,
  fieldStatusVariants,
  fieldVariants,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
} from "@stealthscale/theme/authoring";

import { indicated, triggerEnd } from "#combobox/metrics.ts";
import {
  control,
  flushed,
  glyph,
  inset,
  label,
  labelSizes,
  root,
  rootSizes,
  SIZES,
} from "#dropdown.ts";
import { trigger, triggerSizes } from "#input-group/trigger.ts";

/**
 * Selects the last segment group of a control whose clear trigger shows, the group the trigger
 * covers.
 */
const CLEARED =
  ".date-input__control:has(> .date-input__clearTrigger:not([hidden])) > &:last-of-type";

/**
 * Defines the date input recipe, which defaults to an outline field at size `md`.
 */
export const recipe = defineSlotRecipe({
  base: {
    clearTrigger: {
      ...trigger(),
      insetBlockStart: "50%",
      position: "absolute",
      translate: "0 -50%",
    },
    control: {
      ...control(),
      "& > svg": { color: "fg.muted", flexShrink: "0" },
      alignItems: "center",
    },
    label: label(),
    root: root(),
    segment: {
      _focus: {
        _highContrast: {
          background: "Highlight",
          color: "HighlightText",
          forcedColorAdjust: "none",
        },
        background: "colorPalette.solid",
        color: "colorPalette.contrast",
      },
      "&[data-placeholder-shown]:not(:focus)": { color: "fg.muted" },
      "&[data-type=literal]": { color: "fg.muted", minInlineSize: "0", paddingInline: "0" },
      alignItems: "center",
      borderRadius: "l1",
      display: "inline-flex",
      justifyContent: "center",
      minBlockSize: "6",
      minInlineSize: "6",
      outline: "0",
      paddingInline: "0.5",
      whiteSpace: "pre",
    },
    segmentGroup: {
      ...field(),
      _focusWithin: {
        [FIELD_EDGE]: "var(--focus-ring-color)",
        outlineColor: "var(--focus-ring-color)",
        outlineOffset: "calc({borderWidths.ring} * -1)",
        outlineStyle: "var(--focus-ring-style, solid)",
        outlineWidth: "var(--focus-ring-width, 1px)",
      },
      alignItems: "center",
      borderRadius: "l2",
      cursor: "field",
      display: "flex",
      fontVariantNumeric: "tabular-nums",
      inlineSize: "full",
      minInlineSize: "0",
      whiteSpace: "nowrap",
    },
  },
  className: "date-input",
  defaultVariants: { size: "md", variant: "outline" },
  jsx: [/^DateInput(\.\w+)?$/u],
  slots: ["root", "label", "control", "segmentGroup", "segment", "clearTrigger"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Height, insets and text of the field, the place of the clear trigger and the room the field
     * keeps for it.
     */
    size: onSlots({
      clearTrigger: sizeVariants(
        (size) => ({
          ...triggerSizes()[size],
          "& svg": { boxSize: glyph(size) },
          insetInlineEnd: triggerEnd(size),
        }),
        SIZES,
      ),
      control: sizeVariants(
        (size) => ({
          "& > svg": { boxSize: glyph(size) },
          columnGap: dense(`{spacing.gap.${below(size)}}`),
        }),
        SIZES,
      ),
      label: labelSizes(),
      root: rootSizes(),
      segmentGroup: sizeVariants(
        (size) => ({
          ...controlSizes()[size],
          [CLEARED]: { paddingInlineEnd: indicated(size) },
          fontWeight: "normal",
          gap: "0",
          paddingInlineEnd: `calc(${inset(size)} - {spacing.0.5})`,
          paddingInlineStart: `calc(${inset(size)} - {spacing.0.5})`,
        }),
        SIZES,
      ),
    }),

    /**
     * Status the date input reports. Each value sets the field's edge and focus ring from that
     * status's palette.
     */
    status: onSlot("segmentGroup", fieldStatusVariants()),

    /**
     * Field look of the segment group, one of the three a text field offers.
     *
     * @remarks
     *   `flushed` sets the smallest inset of the scale at every size, the same as the input's.
     */
    variant: {
      ...onSlot("segmentGroup", fieldVariants()),
      flushed: { root: flushed(), segmentGroup: { layerStyle: "field.flushed" } },
    },
  },
});
