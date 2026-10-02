/**
 * Recipe for a form built from a schema: the form element, the region its own errors are read
 * from, a group's members, a field's cell, an item of a repeat group, a step's heading and a row
 * of actions.
 *
 * @remarks
 *   The fields, the legends, the steps and the buttons are the library's own components, each
 *   styled by its own recipe. This recipe lays them out. The form is a column whose fields are two
 *   steps of the gap scale above the form's size apart, and a button in that column takes its own
 *   width. The errors region is on the page while it is empty, and takes back the gap after it, so
 *   an empty region leaves no room. A group lays its members out down the page, in a wrapping row,
 *   or in a grid of the count of columns it writes as `--form-columns`. A row or a grid keeps every
 *   member at its own height, so the labels of one row line up. A grid lays its members out at
 *   their natural width while it measures them, at least `sizes.48` a column, and in one column
 *   while they do not fit. A cell spans the columns it writes as `--form-span`, and one column in a
 *   grid that does not fit. Every item after the first has a hairline above it. A section, a group
 *   with a legend, has twice the gap before and after it in a column. A section that follows
 *   another member of a column opens with a hairline, so the groups of a form read apart from its
 *   fields. A field that writes a width caps its control at `sizes.48` when short and `sizes.sm`
 *   when medium, and its label and texts keep the column. A tab panel inside the form has no inline
 *   inset, so its fields line up with the tabs and the buttons. The recipe has no `palette` or
 *   `effect` axis, because a form renders no box of its own. The compiler extracts nothing from
 *   `form.Form`, the member of the object `useSchemaForm` returns, so the recipe emits every size
 *   through `staticCss`.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  onSlots,
  type Scale,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Sizes the form offers: `sm`, `md` and `lg`.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Class name of the library's button recipe, whose root the form aligns to its start.
 */
export const BUTTON = "button";

/**
 * Class name of the library's tabs recipe, whose panels the form keeps without an inline inset.
 */
export const TABS = "tabs";

/**
 * Class name of the library's field recipe, whose control the form caps at the field's width.
 */
export const FIELD = "field";

/**
 * Attribute a field's root writes its width in, which caps the control inside the field.
 */
export const WIDTH = "data-field-width";

/**
 * Selects the control of a field whose root writes a width: every child of the root but the
 * label, the counter and the texts.
 */
const CAPPED = `> :not(.${FIELD}__label, .${FIELD}__counter, .${FIELD}__helperText, .${FIELD}__errorText)`;

/**
 * Custom property with the count of columns a grid group lays its members out in.
 */
export const COLUMNS = "--form-columns";

/**
 * Custom property with the count of columns a cell spans.
 */
export const SPAN = "--form-span";

/**
 * Selects a grid group while it measures its members at their natural width.
 */
const MEASURING = "&[data-columns][data-measuring]";

/**
 * Selects a grid group whose members do not fit at their natural width.
 */
const CROWDED = "&[data-columns][data-crowded]";

/**
 * Selects a cell inside a grid group whose members do not fit.
 */
const CROWDED_CELL = "[data-crowded] > &";

/**
 * Maps each size to the step of the gap scale between the fields of a form of that size: two steps
 * above it, 12, 16 and 24px at `sm`, `md` and `lg`.
 */
const SPACED: Readonly<Record<Scale, Scale>> = {
  "2xl": "4xl",
  "3xl": "4xl",
  "4xl": "4xl",
  lg: "2xl",
  md: "xl",
  sm: "lg",
  xl: "3xl",
  xs: "md",
};

/**
 * Maps each size to the step of the gap scale between a section's hairline and its legend: twice
 * the gap between fields, 24, 32 and 48px at `sm`, `md` and `lg`.
 */
const SECTIONED: Readonly<Record<Scale, Scale>> = {
  "2xl": "4xl",
  "3xl": "4xl",
  "4xl": "4xl",
  lg: "4xl",
  md: "3xl",
  sm: "2xl",
  xl: "4xl",
  xs: "xl",
};

/**
 * Selects a section whose parent lays its members out in a column: the form, an item, a step, or a
 * group without columns or a row.
 */
const COLUMNED = ":not([data-columns], [data-direction=row]) > &";

/**
 * Selects a section that follows another member of its column, other than an empty errors region or
 * a step's heading.
 */
const FOLLOWING = "&:not(:first-child, .form__errors:empty + *, .form__heading + *)";

/**
 * Returns the gap at one size: the gap scale at the size, under the density.
 */
function gapOf(size: Scale): string {
  return dense(`{spacing.gap.${size}}`);
}

/**
 * Defines the form recipe: a column at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    actions: { alignItems: "center", display: "flex", flexWrap: "wrap" },
    cell: {
      [CROWDED_CELL]: { gridColumn: "auto" },
      gridColumn: `span var(${SPAN})`,
      minInlineSize: "0",
    },
    errors: { _focusVisible: { focusVisibleRing: "outside" } },
    group: {
      "&[data-columns]": {
        alignItems: "start",
        display: "grid",
        gridTemplateColumns: `repeat(var(${COLUMNS}), minmax(0, 1fr))`,
      },
      "&[data-direction=row]": {
        "& > *": { flexBasis: "48", flexGrow: "1" },
        alignItems: "flex-start",
        flexFlow: "row wrap",
      },
      [CROWDED]: { gridTemplateColumns: "minmax(0, 1fr)" },
      display: "flex",
      flexDirection: "column",
      [MEASURING]: { gridTemplateColumns: `repeat(var(${COLUMNS}), minmax({sizes.48}, 1fr))` },
      minInlineSize: "0",
    },
    heading: { margin: "0" },
    item: {
      "& + &": {
        borderBlockStartColor: "border",
        borderBlockStartStyle: "solid",
        borderBlockStartWidth: "hairline",
      },
      display: "flex",
      flexDirection: "column",
      minInlineSize: "0",
    },
    root: {
      [`& [${WIDTH}=medium] ${CAPPED}`]: { maxInlineSize: "sm" },
      [`& [${WIDTH}=short] ${CAPPED}`]: { maxInlineSize: "48" },
      [`& > .${BUTTON}`]: { alignSelf: "flex-start" },
      display: "flex",
      flexDirection: "column",
      inlineSize: "full",
      minInlineSize: "0",
    },
  },
  className: "form",
  defaultVariants: { size: "md" },
  jsx: [/^\w+\.Form$/u],
  slots: ["root", "errors", "group", "section", "cell", "item", "heading", "actions"],
  staticCss: [{ size: [...SIZES] }],
  variants: {
    /**
     * Space between the members, the items and the actions, and the size of a step's heading. The
     * fields are two steps of the gap scale above the size apart: 12, 16 and 24px. A section that
     * follows another member of a column opens with a hairline, with twice that space above the
     * line and below it. The actions are the gap at the size apart, and the heading reads the
     * heading role one size smaller, the size of a group's legend. Every field of the form takes
     * the same size. A tab panel's inline inset is cleared here, because the tabs recipe sets it at
     * each size.
     */
    size: onSlots({
      actions: sizeVariants((size) => ({ gap: gapOf(size) }), SIZES),
      errors: sizeVariants(
        (size) => ({ _empty: { marginBlockEnd: `calc(${gapOf(SPACED[size])} * -1)` } }),
        SIZES,
      ),
      group: sizeVariants((size) => ({ gap: gapOf(SPACED[size]) }), SIZES),
      heading: sizeVariants((size) => ({ textStyle: `heading.${below(size)}` }), SIZES),
      item: sizeVariants(
        (size) => ({
          "& + &": { paddingBlockStart: gapOf(SPACED[size]) },
          gap: gapOf(SPACED[size]),
        }),
        SIZES,
      ),
      root: sizeVariants(
        (size) => ({
          [`& .${TABS}__content`]: { paddingInline: "0" },
          gap: gapOf(SPACED[size]),
        }),
        SIZES,
      ),
      section: sizeVariants(
        (size) => ({
          [COLUMNED]: {
            "& + *": { marginBlockStart: gapOf(SPACED[size]) },
            [FOLLOWING]: {
              borderBlockStartColor: "border",
              borderBlockStartStyle: "solid",
              borderBlockStartWidth: "hairline",
              marginBlockStart: gapOf(SPACED[size]),
              paddingBlockStart: gapOf(SECTIONED[size]),
            },
          },
        }),
        SIZES,
      ),
    }),
  },
});
