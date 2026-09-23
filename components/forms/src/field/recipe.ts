/**
 * Defines the styles a field is drawn with.
 *
 * @remarks
 *   Seven parts. The root lays them out, the label names the control, the required indicator marks
 *   a field that has to be filled in, the control is what a person fills, and the helper text, the
 *   counter and the message sit under it.
 *   The root is a grid rather than a column, so the count takes a gutter at the field's end without
 *   a row of its own. The grid packs densely: the count is written after the control and belongs
 *   above it, and a sparse flow never fills a cell it has already passed.
 *   The count stands on the label's row and the message takes the whole width under the control.
 *   The two shared a row before, with the count against the end of it, and the message was held to
 *   the width the count left on every line it ran to. A message of two lines came out held to 357
 *   of 419 pixels, with the count stranded at the end of the first line and the second running past
 *   underneath it. Nothing a reader is told about what went wrong is worth shortening for a number
 *   saying how much room is left.
 *   Beside the control there is no row the label has to itself, so the count takes a gutter of its
 *   own at the field's end and the control stops where the message under it stops. The gutter is an
 *   `auto` track, so a field stating no count gives up nothing to it.
 *   Every part names the column it stands in rather than leaning on the order a caller writes the
 *   parts in. A caller composes them itself, and dense packing fills the first free cell: written
 *   after the message rather than before it, the count landed under the message instead of above.
 *   The message and the required indicator read the palette, and the status axis sets it on those
 *   two parts and on the control. It is not set on the root: the control reads the palette for its
 *   focus ring, so a field defaulting to the error palette drew a red ring round every untouched
 *   control on the page. Each part that reports a fault states the error palette itself, which
 *   leaves the default red where it was meant to be and the ring in the theme's own colour.
 *   The message replaces the helper text rather than standing under it. A field that is wrong
 *   carried two lines of text otherwise, and a reader had to work out which of them to act on. The
 *   orientation axis puts the label above the control or beside it. Beside it, the label takes a
 *   column of its own and every other part starts in the second.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  fieldStatusVariants,
  onSlots,
  type Scale,
  sizeVariants,
  statusEmitted,
  statusVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * The steps a field is read at.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * The class this recipe is compiled under, which the rule raising a floating label reads.
 */
const CLASS = "field";

/**
 * The property holding how far a floating label drops to reach the middle of the control: the gap
 * it would have left above it, and half the control's own height.
 */
const DROP = "--field-drop";

/**
 * The property holding the room the control leaves at its inline start, which a floating label
 * takes so its words begin where the typing does.
 */
const INSET = "--field-inset";

/**
 * Writes what the text under a control reads at one size: a step below the control's own words.
 *
 * @remarks
 *   The helper text, the message and the count share the room under the control, so they share a
 *   size. All three were set in the body text of the field's own step, which read as heavily as the
 *   control's contents and left a field with three lines of equal weight under it.
 *   The leading is the middle of the three the theme offers. A note under a control is a line or
 *   two rather than a passage, and the body's own leading set it at 1.5 against the label's 1.25
 *   above it, which left a one-line note floating in its own row and a two-line one reading as two
 *   separate notes.
 */
function described(size: Scale): SystemStyleObject {
  return { lineHeight: "snug", textStyle: `body.${below(size)}` };
}

/**
 * Writes what the message reads at one size: the text under a control, and the room between the
 * mark of its status and the words.
 *
 * @remarks
 *   The mark stood four pixels from the first letter at every step, which is the room between a
 *   label and the mark saying it is required: two marks side by side rather than a mark leading a
 *   sentence. It takes the step's own gap now, so it moves with the words it leads.
 */
function messaged(size: Scale): SystemStyleObject {
  return { ...described(size), gap: dense(`{spacing.gap.${size}}`) };
}

/**
 * Draws a field laid out in a grid at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: { minInlineSize: "0" },
    counter: {
      color: "fg.muted",
      fontVariantNumeric: "tabular-nums",
      justifySelf: "end",
      whiteSpace: "nowrap",
    },
    errorText: {
      "& > svg": {
        blockSize: "1em",
        flexShrink: "0",
        inlineSize: "1em",
        marginBlockStart: "calc((1lh - 1em) / 2)",
      },
      alignItems: "start",
      color: "colorPalette.fg",
      colorPalette: "error",
      display: "flex",
    },
    helperText: { color: "fg.muted" },
    label: {
      _disabled: { layerStyle: "disabled" },
      alignItems: "center",
      display: "inline-flex",
      fontWeight: "medium",
      gap: dense("{spacing.gap.xs}"),
    },
    requiredIndicator: { color: "colorPalette.fg", colorPalette: "error", lineHeight: "1" },
    root: { display: "grid", gridAutoFlow: "dense", inlineSize: "full" },
  },
  className: CLASS,
  defaultVariants: { orientation: "vertical", size: "md" },
  jsx: [/^Field(\.\w+)?$/u],
  slots: ["root", "label", "requiredIndicator", "control", "helperText", "counter", "errorText"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Where the label sits against the control.
     *
     * @remarks
     *   Each value places every part itself rather than departing from a shared placement, because
     *   the three lay the same seven parts out over a different number of columns and a part that
     *   read its column from the base would have had to be moved by all of them anyway.
     *   Beside the control, the label is centred against the control it names. Top-aligned it read
     *   as a caption over the field, and the padding that had been used to nudge it down was a
     *   guess that missed at every step other than the one it was measured at.
     *   Floating, the label keeps its row and is moved down over the control with a translate, so
     *   the row it leaves behind holds its height and nothing under the field jumps as the label
     *   rises. Drawn out of the flow instead, the row collapsed and the whole field moved the
     *   moment a reader typed the first character.
     */
    orientation: {
      floating: {
        control: { gridColumn: "1 / -1" },
        counter: { gridColumn: "2 / 3" },
        errorText: { gridColumn: "1 / -1" },
        helperText: { gridColumn: "1 / -1" },
        label: {
          _motionReduce: { transitionDuration: "0s" },
          color: "fg.muted",
          gridColumn: "1 / 2",
          justifySelf: "start",
          paddingInline: `var(${INSET})`,
          pointerEvents: "none",
          transitionDuration: "press",
          transitionProperty: "common",
          transitionTimingFunction: "press",
          translate: `0 calc(50% + var(${DROP}))`,
        },
        root: {
          [`&:has(.${CLASS}__control:focus) .${CLASS}__label,
            &:has(.${CLASS}__control:not(:placeholder-shown)) .${CLASS}__label`]: {
            color: "fg",
            paddingInline: "0",
            translate: "0 0",
          },
          gridTemplateColumns: "minmax(0, 1fr) auto",
        },
      },
      horizontal: {
        control: { gridColumn: "2 / 3" },
        counter: { gridColumn: "3 / 4" },
        errorText: { gridColumn: "2 / 3" },
        helperText: { gridColumn: "2 / 3" },
        label: { alignSelf: "center", gridColumn: "1 / 2" },
        root: { gridTemplateColumns: "auto minmax(0, 1fr) auto" },
      },
      vertical: {
        control: { gridColumn: "1 / -1" },
        counter: { gridColumn: "2 / 3" },
        errorText: { gridColumn: "1 / -1" },
        helperText: { gridColumn: "1 / -1" },
        label: { gridColumn: "1 / 2" },
        root: { gridTemplateColumns: "minmax(0, 1fr) auto" },
      },
    },

    size: onSlots({
      counter: sizeVariants(described, SIZES),
      errorText: sizeVariants(messaged, SIZES),
      helperText: sizeVariants(described, SIZES),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      root: sizeVariants(
        (size) => ({
          columnGap: dense(`{spacing.gap.${size}}`),
          [DROP]: `calc(${dense(`{spacing.gap.${below(size)}}`)} + ${dense(`{sizes.control.${size}}`)} / 2)`,
          [INSET]: dense(`{spacing.inset.${size}}`),
          rowGap: dense(`{spacing.gap.${below(size)}}`),
        }),
        SIZES,
      ),
    }),

    /**
     * The palette the message, the required mark and the control's edge are drawn in.
     *
     * @remarks
     *   The control takes the field fragment's own status rule, which states the edge outright
     *   rather than reading the palette, because the palette's border role sits two steps darker
     *   than the line family the contrast gate measured against a panel. Without it a field
     *   reporting a warning drew the warning in its message and left the control looking untouched.
     */
    status: onSlots({
      control: fieldStatusVariants(),
      errorText: statusVariants(),
      requiredIndicator: statusVariants(),
    }),
  },
});
