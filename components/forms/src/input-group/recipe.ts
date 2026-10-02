/**
 * Recipe for the input group: one field box that contains fields, marks and addons in one or more
 * rows.
 *
 * @remarks
 *   Five slots. The root is the box: it draws the edge, the surface and every state from the
 *   theme's wrapped field, read from the controls inside it. Fields, marks and addons are flex
 *   items at their own widths, so a mark of any width never covers the text. A field is a bare
 *   control that grows from zero into the free width, or keeps the width of its `size` attribute. A
 *   mark holds an icon, a unit, a separator, a counter or a button, and a button at either end sits
 *   4px from the edge. An addon is a segment that reaches the box's edge at either end, with a
 *   divider on the side that faces the fields. A divider also separates two adjacent fields, and an
 *   inset lies on both sides of every divider. Forced colors replace an input's own edge color with
 *   the browser's gray, so a divider between fields paints `CanvasText` there. A root that contains
 *   rows stacks them and draws a divider between them, and each row lays out its items the way a
 *   root without rows does. The gap between items is half the text size. The field's height sets
 *   the row's height, so the box grows by 1px when a subtle or flushed look widens its edge on
 *   focus and the look's -1px margin keeps the content below in place. The recipe has no `palette`
 *   axis, because a field's color reports a state, and no `effect` axis, because an effect would
 *   compete with the focus ring and the status edge.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  FIELD_EDGE,
  fieldStatusVariants,
  onSlot,
  onSlots,
  type Scale,
  sizeVariants,
  statusEmitted,
  wrappedField,
  wrappedFieldVariants,
} from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, from which the binding writes each part's class.
 */
const CLASS = "input-group";

/**
 * Custom property that carries the box's inline inset. The size axis and the flushed look set it,
 * and the root, the rows, the addons and the marks read it.
 */
const INSET = "--input-group-inset";

/**
 * The box's inline inset, read from {@link INSET}.
 */
const PADDED = `var(${INSET})`;

/**
 * Corner radius inside the box's edge, for an addon at either end.
 */
const INNER = "calc({radii.l2} - {borderWidths.control})";

/**
 * Gap between the items of a row: half the group's text size.
 */
const GAP = "0.5em";

/**
 * Selects a mark that contains a control, such as a button or a link.
 */
const CONTROLLED = ":has(> :is(a, button))";

/**
 * Selects a root that contains rows.
 */
const ROWED = `&:has(> .${CLASS}__row)`;

/**
 * Divider in the field's edge color on the inline start side.
 */
const DIVIDER_START = {
  borderInlineStartColor: `var(${FIELD_EDGE})`,
  borderInlineStartStyle: "solid",
  borderInlineStartWidth: "control",
} as const;

/**
 * Wrapped field looks lifted onto the root.
 */
const LOOKS = onSlot("root", wrappedFieldVariants());

/**
 * Returns the height of one row inside the box at one size: the control height less both edges.
 */
function inner(size: Scale): string {
  return `calc(${dense(`{sizes.control.${size}}`)} - {borderWidths.control} * 2)`;
}

/**
 * Defines the input group recipe: an outline box at size `md` with its items centred by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    addon: {
      "&:first-child": {
        borderEndStartRadius: INNER,
        borderStartStartRadius: INNER,
        marginInlineStart: `calc(${PADDED} * -1)`,
      },
      "&:last-child": {
        borderEndEndRadius: INNER,
        borderStartEndRadius: INNER,
        marginInlineEnd: `calc(${PADDED} * -1)`,
      },
      "&:not(:first-child)": {
        ...DIVIDER_START,
        marginInlineStart: `calc(${PADDED} - ${GAP})`,
      },
      "&:not(:last-child)": {
        borderInlineEndColor: `var(${FIELD_EDGE})`,
        borderInlineEndStyle: "solid",
        borderInlineEndWidth: "control",
        marginInlineEnd: `calc(${PADDED} - ${GAP})`,
      },
      alignItems: "center",
      alignSelf: "stretch",
      color: "fg.muted",
      columnGap: GAP,
      display: "flex",
      flex: "none",
      paddingInline: PADDED,
      whiteSpace: "nowrap",
    },
    field: {
      _placeholder: { color: "fg.muted" },
      "&:is(select)": { flex: "none", inlineSize: "auto" },
      "&:is(textarea)": { alignSelf: "stretch", resize: "none" },
      "&[size]": { flex: "none", inlineSize: "auto" },
      "& + &": {
        ...DIVIDER_START,
        _highContrast: { borderInlineStartColor: "CanvasText" },
        marginInlineStart: `calc(${PADDED} - ${GAP})`,
        paddingInlineStart: PADDED,
      },
      alignSelf: "center",
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      color: "fg",
      flex: "1 1 0",
      font: "inherit",
      inlineSize: "0",
      letterSpacing: "inherit",
      minInlineSize: "0",
      outline: "none",
      padding: "0",
    },
    mark: {
      "& svg": { boxSize: "1.25em", flexShrink: "0" },
      [`&:first-child${CONTROLLED}`]: { marginInlineStart: `calc({spacing.1} - ${PADDED})` },
      [`&:last-child${CONTROLLED}`]: { marginInlineEnd: `calc({spacing.1} - ${PADDED})` },
      alignItems: "center",
      color: "fg.muted",
      display: "inline-flex",
      flex: "none",
      fontVariantNumeric: "tabular-nums",
      justifyContent: "center",
      whiteSpace: "nowrap",
    },
    root: {
      ...wrappedField(),
      borderRadius: "l2",
      columnGap: GAP,
      cursor: "field",
      display: "flex",
      inlineSize: "full",
      margin: "0",
      minInlineSize: "0",
      paddingInline: PADDED,
      [ROWED]: { flexDirection: "column", paddingInline: "0" },
    },
    row: {
      "&:not(:first-child)": {
        borderBlockStartColor: `var(${FIELD_EDGE})`,
        borderBlockStartStyle: "solid",
        borderBlockStartWidth: "control",
      },
      [`&:not(:first-child) > .${CLASS}__addon`]: {
        borderStartEndRadius: "0",
        borderStartStartRadius: "0",
      },
      [`&:not(:last-child) > .${CLASS}__addon`]: {
        borderEndEndRadius: "0",
        borderEndStartRadius: "0",
      },
      alignItems: "inherit",
      alignSelf: "stretch",
      columnGap: GAP,
      display: "flex",
      minInlineSize: "0",
      paddingInline: PADDED,
    },
  },
  className: CLASS,
  defaultVariants: { align: "center", size: "md", variant: "outline" },
  jsx: [/^InputGroup(\.\w+)?$/u],
  slots: ["root", "row", "field", "mark", "addon"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Cross-axis alignment of each row.
     *
     * @remarks
     *   `start` keeps each mark on the first line of a field that runs to several lines, such as a
     *   textarea.
     */
    align: {
      start: { root: { alignItems: "flex-start" } },

      center: { root: { alignItems: "center" } },
    },

    /**
     * Row height, text size and inline inset. The height reads the control scale, the text the
     * label role at the normal weight, and the inset the inset scale one size smaller.
     */
    size: onSlots({
      field: sizeVariants((size) => ({
        "&:is(textarea)": {
          blockSize: "auto",
          paddingBlock: `calc((${inner(size)} - 1lh) / 2)`,
        },
        blockSize: inner(size),
      })),
      mark: sizeVariants((size) => ({ minBlockSize: inner(size) })),
      root: sizeVariants((size) => ({
        fontWeight: "normal",
        [INSET]: dense(`{spacing.inset.${below(size)}}`),
        textStyle: `label.${size}`,
      })),
    }),

    /**
     * Status the group reports. Each value sets the edge and the focus ring from that status's
     * palette.
     */
    status: onSlot("root", fieldStatusVariants()),

    /**
     * Edges and surface of the box, and the fill of a filled addon.
     *
     * @remarks
     *   A filled addon takes the surface one step darker than the box: `bg.subtle` on the outline
     *   look, `bg.muted` on the subtle look. A plain addon has no fill, and a flushed addon has no
     *   fill in either look. The flushed box keeps the smallest inset, the same as the flushed
     *   input.
     */
    variant: {
      flushed: {
        root: { ...LOOKS.flushed.root, [INSET]: dense("{spacing.inset.xs}") },
      },
      outline: {
        addon: { "&[data-look=filled]": { background: "bg.subtle" } },
        root: LOOKS.outline.root,
      },
      subtle: {
        addon: { "&[data-look=filled]": { background: "bg.muted" } },
        root: LOOKS.subtle.root,
      },
    },
  },
});
