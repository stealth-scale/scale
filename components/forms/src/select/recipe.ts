/**
 * Recipe for the select: a label, a field-like trigger with an indicator and a clear trigger at its
 * end, and a panel of rows that opens under it.
 *
 * @remarks
 *   Eighteen slots. The trigger reads the theme's field fragment, its three looks, its status axis
 *   and the control scale, so a select, a native select and an input of one size match. The trigger
 *   keeps room at its end for the indicator, and widens it by the clear trigger's square while that
 *   shows. The indicator lies over the trigger's end and takes no pointer, so a press on it opens
 *   the select. The label, the panel, its scroll area's `viewport` and `rows` and the rows are the
 *   combobox's, from `dropdown.ts`. The recipe has no `palette` axis, because a field's color
 *   reports a state, and no `effect` axis, because a glow would compete with the focus ring and the
 *   status edge.
 */

import {
  controlSizes,
  defineSlotRecipe,
  field,
  FIELD_EDGE,
  fieldStatusVariants,
  fieldVariants,
  highlightVariants,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
  truncate,
} from "@stealthscale/theme/authoring";

import {
  content,
  control,
  flushed,
  glyph,
  indicatorEnd,
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
import { CLASS, cleared, CLEARED, clearEnd, indicated, PLACEHOLDER } from "#select/metrics.ts";

/**
 * Defines the select recipe: an outline trigger at size `md` with the tint highlight by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    clearTrigger: {
      ...trigger(),
      insetBlockStart: "50%",
      position: "absolute",
      translate: "0 -50%",
    },
    content: content(),
    control: control(),
    indicator: {
      _disabled: { opacity: "disabled" },
      _invalid: { color: "fg.error" },
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      insetBlock: "0",
      pointerEvents: "none",
      position: "absolute",
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
      ...field(),
      _expanded: { [FIELD_EDGE]: "{colors.fg.subtle}" },
      alignItems: "center",
      appearance: "none",
      borderRadius: "l2",
      cursor: "button",
      display: "flex",
      inlineSize: "full",
      minInlineSize: "0",
      textAlign: "start",
      userSelect: "none",
    },
    valueText: {
      ...truncate(),
      flex: "1",
      minInlineSize: "0",
      [PLACEHOLDER]: { color: "fg.muted" },
      textAlign: "start",
    },
    viewport: viewport(),
  },
  className: CLASS,
  defaultVariants: { highlight: "tint", size: "md", variant: "outline" },
  jsx: [/^Select(\.\w+)?$/u],
  slots: [
    "root",
    "label",
    "control",
    "trigger",
    "valueText",
    "indicator",
    "clearTrigger",
    "positioner",
    "content",
    "viewport",
    "rows",
    "itemGroup",
    "itemGroupLabel",
    "item",
    "itemLines",
    "itemText",
    "itemDescription",
    "itemIndicator",
  ],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Look of the row the highlight is on, which a menu and a listbox read too.
     */
    highlight: onSlot("item", highlightVariants()),

    /**
     * Height, insets and text of the trigger, the places of its indicator and clear trigger, the
     * padding around the rows and the rows. A row's text reads the body role one size smaller than
     * the select, and a description two sizes smaller.
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
      indicator: sizeVariants(
        (size) => ({ "& > svg": { boxSize: glyph(size) }, insetInlineEnd: indicatorEnd(size) }),
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
          ...controlSizes()[size],
          [CLEARED]: { paddingInlineEnd: cleared(size) },
          fontWeight: "normal",
          paddingInlineEnd: indicated(size),
          paddingInlineStart: inset(size),
        }),
        SIZES,
      ),
      viewport: viewportSizes(),
    }),

    /**
     * Status the select reports. Each value sets the trigger's edge and focus ring from that
     * status's palette.
     */
    status: onSlot("trigger", fieldStatusVariants()),

    /**
     * Edges and surface of the trigger.
     *
     * @remarks
     *   `flushed` keeps the smallest inset of the scale at every size, the same as the input's, so
     *   the value starts near the start of its edge and the indicator ends near its end.
     */
    variant: {
      ...onSlot("trigger", fieldVariants()),
      flushed: { content: flushed(), root: flushed(), trigger: { layerStyle: "field.flushed" } },
    },
  },
});
