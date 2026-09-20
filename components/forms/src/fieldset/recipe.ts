/**
 * Defines the styles a fieldset is drawn with.
 *
 * @remarks
 *   Four parts. The root groups the fields, the legend names the group, and the two texts sit
 *   under them.
 *   The message reads the palette, which the status axis sets, the same way a field's does. A
 *   fieldset defaults to the error palette.
 *   The orientation axis lays the fields down the group or across it. A group of two or three
 *   short options reads better across, and anything longer wraps and reads better down.
 *   The root clears the browser's own border, inset and minimum width. A `fieldset` defaults to a
 *   minimum inline size of its content, so one inside a flex or grid parent refuses to shrink and
 *   pushes the layout wider than the page.
 */

import {
  defineSlotRecipe,
  dense,
  onSlot,
  onSlots,
  sizeVariants,
  statusEmitted,
  statusVariants,
} from "@stealthscale/theme/authoring";

/**
 * The steps a group is read at.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Draws a group stacked at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    errorText: {
      alignItems: "center",
      color: "colorPalette.fg",
      display: "flex",
      gap: dense("{spacing.gap.xs}"),
    },
    helperText: { color: "fg.muted" },
    legend: { fontWeight: "semibold" },
    root: {
      borderStyle: "none",
      colorPalette: "error",
      display: "flex",
      flexDirection: "column",
      inlineSize: "full",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
  },
  className: "fieldset",
  defaultVariants: { orientation: "vertical", size: "md" },
  jsx: [/^Fieldset(\.\w+)?$/u],
  slots: ["root", "legend", "helperText", "errorText"],
  staticCss: [statusEmitted()],
  variants: {
    /**
     * Which way the fields inside the group run.
     *
     * @remarks
     *   Across the group, every child starts from twelve rem and grows into the row, so two fields
     *   share it and a fifth wraps. A field fills the width it is given, and a row of fields at
     *   their own width put each on a line of its own, so the group across read the same as the
     *   group down. The two texts are held to the full width rather than given a basis, so they
     *   take a row each without a rule on the root and a rule on the part meeting on one property.
     */
    orientation: {
      horizontal: {
        errorText: { minInlineSize: "full" },
        helperText: { minInlineSize: "full" },
        root: { "& > *": { flexBasis: "48", flexGrow: "1" }, flexFlow: "row wrap" },
      },
      vertical: { root: { flexDirection: "column" } },
    },

    size: onSlots({
      errorText: sizeVariants((size) => ({ textStyle: `body.${size}` }), SIZES),
      helperText: sizeVariants((size) => ({ textStyle: `body.${size}` }), SIZES),
      legend: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), SIZES),
    }),

    /**
     * The palette the message is drawn in. A group defaults to the error palette, and one
     * reporting something else states its own.
     */
    status: onSlot("root", statusVariants()),
  },
});
