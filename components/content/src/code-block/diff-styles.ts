/**
 * Declares the styles of a code block's diff, which the code block's recipe merges into its own.
 *
 * @remarks
 *   The diff is a grid as wide as its longest line, one column unified and two side by side, so
 *   the scroll area scrolls the whole diff and the two sides keep one row per pair. A line tints in
 *   the success palette where it was added and the error palette where it was removed, and a
 *   changed word inside it takes the palette's muted fill. Forced colors remove the fills, so a
 *   changed word takes an underline there, and the `+` and `−` marks keep what happened visible.
 *   Line numbers and marks take no selection, so a copied diff contains only code. A fold is a
 *   full-width button in the subtle fill, and an empty side of a pair takes the same fill, so it
 *   reads as no line and not as a hole.
 */

import { dense, type SystemStyleObject } from "@stealthscale/theme/authoring";

/**
 * Describes the slots of a diff.
 */
type DiffSlot =
  | "change"
  | "diff"
  | "empty"
  | "filler"
  | "fold"
  | "line"
  | "mark"
  | "number"
  | "stat"
  | "text";

/**
 * Styles each slot of a diff.
 */
export const DIFF: Readonly<Record<DiffSlot, SystemStyleObject>> = {
  change: {
    _highContrast: { textDecorationLine: "underline" },
    background: "colorPalette.muted",
    borderRadius: "xs",
    textDecorationLine: "none",
  },
  diff: {
    "&[data-mode=split]": { gridTemplateColumns: "repeat(2, minmax(max-content, 1fr))" },
    display: "grid",
    fontFamily: "mono",
    gridTemplateColumns: "minmax(max-content, 1fr)",
    inlineSize: "max-content",
    minInlineSize: "full",
    paddingBlock: dense("{spacing.gap.sm}"),
  },
  empty: {
    color: "fg.muted",
    gridColumn: "1 / -1",
    paddingInline: dense("{spacing.inset.md}"),
  },
  filler: { background: "bg.subtle" },
  fold: {
    _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
    _hover: { background: "bg.muted" },
    background: "bg.subtle",
    color: "fg.muted",
    cursor: "button",
    focusVisibleRing: "inside",
    gridColumn: "1 / -1",
    paddingInline: dense("{spacing.inset.md}"),
    textAlign: "start",
  },
  line: {
    _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
    "&[data-kind=added]": { background: "colorPalette.subtle", colorPalette: "success" },
    "&[data-kind=removed]": { background: "colorPalette.subtle", colorPalette: "error" },
    display: "flex",
    focusRingColor: "border.focus",
    focusVisibleRing: "inside",
    whiteSpace: "pre",
  },
  mark: {
    color: "colorPalette.fg",
    flexShrink: "0",
    inlineSize: "{sizes.6}",
    textAlign: "center",
    userSelect: "none",
  },
  number: {
    color: "fg.muted",
    flexShrink: "0",
    fontVariantNumeric: "tabular-nums",
    minInlineSize: "{sizes.10}",
    paddingInline: dense("{spacing.gap.xs}"),
    textAlign: "end",
    userSelect: "none",
  },
  stat: {
    "& [data-kind=added]": { color: "fg.success" },
    "& [data-kind=removed]": { color: "fg.error" },
    alignItems: "center",
    display: "flex",
    fontVariantNumeric: "tabular-nums",
    gap: dense("{spacing.gap.sm}"),
  },
  text: { flex: "1", paddingInlineEnd: dense("{spacing.inset.md}") },
};
