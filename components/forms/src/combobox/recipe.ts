/**
 * Recipe for the combobox: a label, an input with a trigger and a clear trigger at its end, and a
 * panel of rows that opens under it.
 *
 * @remarks
 *   Nineteen slots. The input reads the theme's field fragment, its three looks, its status axis
 *   and the control scale, so a combobox, a select and an input of one size match. The trigger and
 *   the clear trigger are the input group's squares at the input's end, and the input keeps room
 *   for the trigger, widened by the clear trigger's square while that shows. The label, the panel,
 *   its scroll area's `viewport` and `rows` and the rows are the select's, from `dropdown.ts`. An
 *   open panel without rows and without an empty message is hidden. The recipe has no `palette`
 *   axis, because a field's color reports a state, and no `effect` axis, because a glow would
 *   compete with the focus ring and the status edge.
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
  highlightVariants,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
} from "@stealthscale/theme/authoring";

import { CLASS, cleared, CLEARED, clearEnd, indicated, triggerEnd } from "#combobox/metrics.ts";
import {
  aligned,
  content,
  control,
  flushed,
  glyph,
  inset,
  item,
  itemDescription,
  itemDescriptionSizes,
  itemGroup,
  itemGroupLabel,
  itemGroupLabelSizes,
  itemIndicator,
  itemIndicatorSizes,
  itemLines,
  itemSizes,
  itemText,
  label,
  labelSizes,
  root,
  rootSizes,
  rows,
  rowsSizes,
  SIZES,
  viewport,
  viewportSizes,
} from "#dropdown.ts";
import { trigger, triggerSizes } from "#input-group/trigger.ts";

/**
 * Defines the combobox recipe: an outline input at size `md` with the tint highlight by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    clearTrigger: {
      ...trigger(),
      insetBlockStart: "50%",
      position: "absolute",
      translate: "0 -50%",
    },
    content: {
      ...content(),
      "&[data-empty]:not(:has(.combobox__empty))": { visibility: "hidden" },
    },
    control: control(),
    empty: { color: "fg.muted", textAlign: "start" },
    hiddenSelect: { srOnly: true },
    input: {
      ...field(),
      _expanded: { [FIELD_EDGE]: "{colors.fg.subtle}" },
      appearance: "none",
      borderRadius: "l2",
      inlineSize: "full",
      minInlineSize: "0",
      textAlign: "start",
    },
    item: item(),
    itemDescription: itemDescription(),
    itemGroup: itemGroup(),
    itemGroupLabel: itemGroupLabel(),
    itemIndicator: itemIndicator(),
    itemLines: itemLines(),
    itemText: itemText(),
    label: label(),
    root: root(),
    rows: rows(),
    trigger: {
      ...trigger(),
      _invalid: { color: "fg.error" },
      insetBlockStart: "50%",
      position: "absolute",
      translate: "0 -50%",
    },
    viewport: viewport(),
  },
  className: CLASS,
  defaultVariants: { highlight: "tint", size: "md", variant: "outline" },
  jsx: [/^Combobox(\.\w+)?$/u],
  slots: [
    "root",
    "label",
    "control",
    "input",
    "trigger",
    "clearTrigger",
    "positioner",
    "content",
    "viewport",
    "rows",
    "empty",
    "itemGroup",
    "itemGroupLabel",
    "item",
    "itemLines",
    "itemText",
    "itemDescription",
    "itemIndicator",
    "hiddenSelect",
  ],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Look of the row the highlight is on, which a select, a menu and a listbox read too.
     */
    highlight: onSlot("item", highlightVariants()),

    /**
     * Height, insets and text of the input, the places of its trigger and clear trigger, the
     * padding around the rows, the rows and the empty message. A row's text reads the body role one
     * size smaller than the combobox, and a description two sizes smaller.
     */
    size: onSlots({
      clearTrigger: sizeVariants(
        (size) => ({
          ...triggerSizes()[size],
          insetInlineEnd: clearEnd(size),
          textStyle: `label.${size}`,
        }),
        SIZES,
      ),
      empty: sizeVariants(
        (size) => ({
          paddingBlock: dense(`{spacing.gap.${below(size)}}`),
          paddingInline: aligned(size),
          textStyle: `body.${below(size)}`,
        }),
        SIZES,
      ),
      input: sizeVariants(
        (size) => ({
          ...controlSizes()[size],
          [CLEARED]: { paddingInlineEnd: cleared(size) },
          fontWeight: "normal",
          paddingInlineEnd: indicated(size),
          paddingInlineStart: inset(size),
        }),
        SIZES,
      ),
      item: itemSizes(),
      itemDescription: itemDescriptionSizes(),
      itemGroupLabel: itemGroupLabelSizes(),
      itemIndicator: itemIndicatorSizes(),
      label: labelSizes(),
      root: rootSizes(),
      rows: rowsSizes(),
      trigger: sizeVariants(
        (size) => ({
          ...triggerSizes()[size],
          "& svg": { boxSize: glyph(size) },
          insetInlineEnd: triggerEnd(size),
        }),
        SIZES,
      ),
      viewport: viewportSizes(),
    }),

    /**
     * Status the combobox reports. Each value sets the input's edge and focus ring from that
     * status's palette.
     */
    status: onSlot("input", fieldStatusVariants()),

    /**
     * Edges and surface of the input.
     *
     * @remarks
     *   `flushed` keeps the smallest inset of the scale at every size, the same as the input's, so
     *   the text starts near the start of its edge and the trigger ends near its end.
     */
    variant: {
      ...onSlot("input", fieldVariants()),
      flushed: { content: flushed(), input: { layerStyle: "field.flushed" }, root: flushed() },
    },
  },
});
