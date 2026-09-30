/**
 * Declares the composer's slot recipe: the box a reader writes a message in, with a strip for the
 * message it replies to, the attachments, the text and a row of controls.
 *
 * @remarks
 *   The root is the theme's wrapped field, so its edge, surface, focus ring and states come from
 *   the textarea inside it, as in the input group. The text is a bare `textarea` that grows with
 *   its content through `field-sizing: content` and stops at the number of lines the input writes
 *   as {@link ROWS}, after which it scrolls. While files are dragged over it the box takes the focus
 *   edge. The submit control is pushed to the end of the row of controls. The strip sizes its
 *   leading glyph to its text and pushes a control after its words, such as a dismiss button, to
 *   its end.
 */

import {
  defineSlotRecipe,
  dense,
  FIELD_EDGE,
  onSlot,
  onSlots,
  sizeVariants,
  surface,
  wrappedField,
  wrappedFieldVariants,
} from "@stealthscale/theme/authoring";

/**
 * Custom property the input writes: the most lines it grows to before it scrolls.
 */
export const ROWS = "--composer-rows";

/**
 * Custom property the size axis sets: the inset around the text and the controls.
 */
const INSET = "--composer-inset";

/**
 * The inset, read from {@link INSET}.
 */
const PADDED = `var(${INSET})`;

/**
 * Sizes the composer offers.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Describes one size's inset and text style.
 */
interface Metric {
  /**
   * Step of the inset scale around the text and the controls.
   */
  readonly inset: string;

  /**
   * Text style of the text.
   */
  readonly text: string;
}

/**
 * Maps each size to its inset and text style.
 */
const METRICS: Readonly<Record<(typeof SIZES)[number], Metric>> = {
  lg: { inset: "md", text: "body.lg" },
  md: { inset: "sm", text: "body.md" },
  sm: { inset: "xs", text: "body.sm" },
};

/**
 * Styles an outlined composer at the middle size.
 */
export const recipe = defineSlotRecipe({
  base: {
    attachments: {
      paddingBlockStart: PADDED,
      paddingInline: PADDED,
    },
    context: {
      "& > :not(button) + button": { marginInlineStart: "auto" },
      "& > svg": { blockSize: "1em", flexShrink: "0", inlineSize: "1em" },
      alignItems: "center",
      backgroundColor: "bg.subtle",
      borderStartEndRadius: "inherit",
      borderStartStartRadius: "inherit",
      color: "fg.muted",
      display: "flex",
      gap: dense("{spacing.gap.sm}"),
      minInlineSize: "0",
      paddingBlock: dense("{spacing.gap.xs}"),
      paddingInline: PADDED,
      textStyle: "label.sm",
    },
    detail: {
      color: "fg.muted",
      textStyle: "label.xs",
    },
    input: {
      _placeholder: { color: "fg.muted" },
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      color: "fg",
      display: "block",
      fieldSizing: "content",
      font: "inherit",
      inlineSize: "full",
      letterSpacing: "inherit",
      maxBlockSize: `calc(var(${ROWS}) * 1lh + ${PADDED} * 2)`,
      outline: "none",
      padding: PADDED,
      resize: "none",
    },
    root: {
      ...wrappedField(),
      "&[data-dragging]": { [FIELD_EDGE]: "{colors.border.focus}" },
      borderRadius: "l3",
      display: "flex",
      flexDirection: "column",
      inlineSize: "full",
      margin: "0",
      minInlineSize: "0",
      position: "relative",
    },
    submit: {
      marginInlineStart: "auto",
    },
    suggestion: {
      "&[aria-selected=true]": {
        _highContrast: {
          background: "Highlight",
          color: "HighlightText",
          forcedColorAdjust: "none",
        },
        layerStyle: "fill.muted",
      },
      alignItems: "baseline",
      borderRadius: "l1",
      cursor: "option",
      display: "flex",
      gap: dense("{spacing.gap.sm}"),
      paddingBlock: dense("{spacing.gap.xs}"),
      paddingInline: dense("{spacing.inset.sm}"),
      textStyle: "label.sm",
    },
    suggestions: {
      ...surface("md"),
      display: "flex",
      flexDirection: "column",
      insetBlockEnd: "100%",
      insetInline: "0",
      marginBlockEnd: dense("{spacing.gap.xs}"),
      padding: dense("{spacing.inset.xs}"),
      position: "absolute",
      zIndex: "dropdown",
    },
    toolbar: {
      alignItems: "center",
      display: "flex",
      gap: dense("{spacing.gap.xs}"),
      paddingBlockEnd: PADDED,
      paddingInline: PADDED,
    },
  },
  className: "composer",
  defaultVariants: { size: "md", variant: "outline" },
  jsx: [/^Composer\.\w+$/u],
  slots: [
    "root",
    "context",
    "attachments",
    "input",
    "suggestions",
    "suggestion",
    "detail",
    "toolbar",
    "submit",
  ],
  variants: {
    size: onSlots({
      input: sizeVariants((size) => ({ textStyle: METRICS[size].text }), SIZES),
      root: sizeVariants(
        (size) => ({ [INSET]: dense(`{spacing.inset.${METRICS[size].inset}}`) }),
        SIZES,
      ),
    }),
    variant: onSlot("root", wrappedFieldVariants()),
  },
});
