/**
 * Recipe for the tags input: a field box that contains the tags a person has entered and the input
 * that adds the next one.
 *
 * @remarks
 *   Eight slots. The root is the `fieldset` that groups the parts, with the element's edge, margin,
 *   padding and minimum width reset, and it stacks the label above the control. The control is the
 *   theme's wrapped field, so its looks, its status and its states match the input group's and are
 *   read from the input inside it. Tags and the input wrap onto lines. The control pads every side
 *   by the same amount, so one line of tags is the control's height and a tag has as much room
 *   before it as above it. The input is as tall as a tag and starts its text at the inset of an
 *   input of the same size. It moves to a line of its own only when less than 4rem is left beside
 *   the tags. A highlighted tag takes a ring in the field's ring color outside its
 *   box, and `Highlight` under forced colors. The item input that edits a tag has the tag's height,
 *   padding and text. The clear trigger is the input group's square button, centred at the
 *   control's end out of the flow of tags, and the control widens its end padding by the square and
 *   a gap while the trigger shows. The recipe has no `palette` axis, because a field's color
 *   reports a state, and no `effect` axis, because an effect would compete with the focus ring and
 *   the status edge.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  fieldStatusVariants,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
  wrappedField,
  wrappedFieldVariants,
} from "@stealthscale/theme/authoring";

import { trigger, triggerSide, triggerSizes } from "#input-group/trigger.ts";

/**
 * Class name of the recipe, from which the binding writes each part's class.
 */
const CLASS = "tags-input";

/**
 * Sizes the recipe offers, the sizes a field and a fieldset pass down.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Size of a tags input.
 */
type Size = (typeof SIZES)[number];

/**
 * Maps each size to the gap token between tags: 4, 4 and 6px at the foundation's metrics.
 */
const GAPS: Readonly<Record<Size, string>> = { lg: "sm", md: "xs", sm: "xs" };

/**
 * Maps each size to the gap token a tag pads its sides by, which the item input copies: 6, 8 and
 * 8px.
 */
const PADS: Readonly<Record<Size, string>> = { lg: "md", md: "md", sm: "sm" };

/**
 * Custom property that carries the control's inline padding at its end. The size axis and the
 * flushed look set it, and the clear trigger's inset reads it.
 */
const END = "--tags-input-end";

/**
 * Selects a control whose clear trigger shows.
 */
const CLEARED = `&:has(> .${CLASS}__clearTrigger:not([hidden]))`;

/**
 * Wrapped field looks lifted onto the control.
 */
const LOOKS = onSlot("control", wrappedFieldVariants());

/**
 * Returns the control's padding at one size: the room the control height leaves around one tag
 * inside both edges, halved. It measures 6.2, 7 and 7.8px.
 */
function padding(size: Size): string {
  return `calc((${dense(`{sizes.control.${size}}`)} - {borderWidths.control} * 2 - ${dense(`{sizes.tag.${size}}`)}) / 2)`;
}

/**
 * Returns the gap between tags at one size.
 */
function spaced(size: Size): string {
  return dense(`{spacing.gap.${GAPS[size]}}`);
}

/**
 * Defines the tags input recipe, which defaults to an outline box at size `md`.
 */
export const recipe = defineSlotRecipe({
  base: {
    clearTrigger: {
      ...trigger(),
      insetBlockStart: "50%",
      insetInlineEnd: `var(${END})`,
      position: "absolute",
      translate: "0 -50%",
    },
    control: {
      ...wrappedField(),
      alignItems: "center",
      borderRadius: "l2",
      cursor: "field",
      display: "flex",
      flexWrap: "wrap",
      inlineSize: "full",
      minInlineSize: "0",
      position: "relative",
    },
    input: {
      _placeholder: { color: "fg.muted" },
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      color: "fg",
      flex: "1",
      font: "inherit",
      letterSpacing: "inherit",
      minInlineSize: "16",
      outline: "none",
      paddingBlock: "0",
    },
    item: { display: "inline-flex", maxInlineSize: "full", minInlineSize: "0" },
    itemInput: {
      appearance: "none",
      background: "bg.panel",
      borderColor: "var(--focus-ring-color)",
      borderRadius: "l2",
      borderStyle: "solid",
      borderWidth: "control",
      color: "fg",
      outline: "none",
    },
    itemPreview: {
      _highlighted: {
        _highContrast: { outlineColor: "Highlight" },
        outlineColor: "var(--focus-ring-color)",
        outlineOffset: "{borderWidths.control}",
        outlineStyle: "solid",
        outlineWidth: "ring",
      },
    },
    label: { _disabled: { layerStyle: "disabled" }, color: "fg", fontWeight: "medium" },
    root: {
      borderStyle: "none",
      display: "grid",
      inlineSize: "full",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
  },
  className: CLASS,
  defaultVariants: { size: "md", variant: "outline" },
  jsx: [/^TagsInput(\.\w+)?$/u],
  slots: ["root", "label", "control", "input", "item", "itemPreview", "itemInput", "clearTrigger"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Height, padding and text at each size. The control's height reads the control scale, a tag
     * the tag scale at the same size, and the input's text starts at the inset scale one size
     * smaller, the inset of an input of the same size. The text reads the label role at the normal
     * weight.
     */
    size: onSlots({
      clearTrigger: sizeVariants(
        (size) => ({ ...triggerSizes()[size], textStyle: `label.${size}` }),
        SIZES,
      ),
      control: sizeVariants(
        (size) => ({
          [CLEARED]: {
            paddingInlineEnd: `calc(var(${END}) + ${triggerSide(size)} + ${spaced(size)})`,
          },
          [END]: padding(size),
          fontWeight: "normal",
          gap: spaced(size),
          padding: padding(size),
          textStyle: `label.${size}`,
        }),
        SIZES,
      ),
      input: sizeVariants(
        (size) => ({
          blockSize: dense(`{sizes.tag.${size}}`),
          paddingInline: `calc(${dense(`{spacing.inset.${below(size)}}`)} - ${padding(size)})`,
        }),
        SIZES,
      ),
      itemInput: sizeVariants(
        (size) => ({
          blockSize: dense(`{sizes.tag.${size}}`),
          paddingInline: dense(`{spacing.gap.${PADS[size]}}`),
          textStyle: `label.${below(size)}`,
        }),
        SIZES,
      ),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      root: sizeVariants((size) => ({ rowGap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
    }),

    /**
     * Status the field reports. Each value sets the edge and the focus ring from that status's
     * palette.
     */
    status: onSlot("control", fieldStatusVariants()),

    /**
     * Edges and surface of the control. The flushed control has no inline padding, so its tags
     * and its clear trigger reach its edges, and its input starts its text at the flushed input's
     * inset.
     */
    variant: {
      flushed: {
        control: { ...LOOKS.flushed.control, [END]: "0px", paddingInline: "0" },
        input: { paddingInline: dense("{spacing.inset.xs}") },
      },
      outline: { control: LOOKS.outline.control },
      subtle: { control: LOOKS.subtle.control },
    },
  },
});
