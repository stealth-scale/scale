/**
 * Styles a file upload: the group, its label, the dropzone that takes dropped and picked files, and
 * the list of the files it accepted.
 *
 * @remarks
 *   The root is the `fieldset` that groups the parts, with the element's edge, margin, padding and
 *   minimum width reset. It stacks its parts and keeps each button at its own width, and the
 *   dropzone and the list take the whole width. The dropzone is the theme's field with a dashed
 *   edge at the indicator width, so its edge, focus ring, invalid edge and disabled look are the
 *   field's. While files are dragged over it, the edge turns solid in the inherited palette's solid
 *   color over the palette's subtle fill. Each file is a row with a hairline edge: a preview square
 *   of the control height, the name on one line above the size, and the input group's square button
 *   that removes the file. A refused file's row takes the error edge. The recipe has no `palette`
 *   axis, because a field's color reports a state, and no `effect` axis, because an effect would
 *   compete with the focus ring and the drag state.
 */

import {
  axis,
  below,
  defineSlotRecipe,
  dense,
  field,
  FIELD_EDGE,
  onSlot,
  onSlots,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

import { trigger, triggerSizes } from "#input-group/trigger.ts";

/**
 * Sizes the recipe offers, the sizes a field and a fieldset pass down.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Size of a file upload.
 */
type Size = (typeof SIZES)[number];

/**
 * Maps each size to the sizes token the dropzone is at least as tall as: 128, 160 and 192px.
 */
const HEIGHTS: Readonly<Record<Size, string>> = { lg: "48", md: "40", sm: "32" };

/**
 * Maps each size to the icon step of a glyph in the dropzone: 20, 24 and 32px.
 */
const GLYPHS: Readonly<Record<Size, string>> = { lg: "xl", md: "lg", sm: "md" };

/**
 * Selects a dropzone while files are dragged over it.
 */
const DRAGGING = "&[data-dragging]";

/**
 * Selects the row of a file the upload refused.
 */
const REFUSED = "&[data-type=rejected]";

/**
 * Fills of the dropzone at rest and under a pointer, in each look.
 */
const FILLS = {
  outline: { hover: "bg.subtle", rest: "bg.panel" },
  subtle: { hover: "bg.muted", rest: "bg.subtle" },
};

/**
 * Returns the dropzone's fills in one look: at rest, under a pointer, read-only and while files are
 * dragged over it.
 *
 * @remarks
 *   A look applies over the base, so each look restates the fill of every state, and the drag
 *   state restates it under a pointer, whose selector is more specific.
 */
function filled(look: keyof typeof FILLS): SystemStyleObject {
  const { hover, rest } = FILLS[look];

  return {
    _hover: { background: hover },
    "&[data-readonly]": { background: "bg.subtle" },
    background: rest,
    [DRAGGING]: {
      _hover: { background: "colorPalette.subtle" },
      background: "colorPalette.subtle",
    },
  };
}

/**
 * Lists the dropzone's looks in the order of the shared set of looks, loudest first.
 */
const LOOKS = axis(["subtle", "outline"], filled);

/**
 * Defines the file upload recipe, which defaults to an outline dropzone at size `md`.
 */
export const recipe = defineSlotRecipe({
  base: {
    dropzone: {
      ...field(),
      _disabled: { cursor: "disabled", layerStyle: "disabled" },
      alignItems: "center",
      borderRadius: "l3",
      borderStyle: "dashed",
      borderWidth: "indicator",
      cursor: "button",
      display: "flex",
      [DRAGGING]: {
        _hover: { [FIELD_EDGE]: "{colors.colorPalette.solid}" },
        borderStyle: "solid",
        [FIELD_EDGE]: "{colors.colorPalette.solid}",
      },
      flexDirection: "column",
      fontWeight: "normal",
      justifyContent: "center",
      justifySelf: "stretch",
      textAlign: "center",
    },
    item: {
      alignItems: "center",
      animationStyle: "fade.in",
      background: "bg.panel",
      borderColor: "border",
      borderRadius: "l2",
      borderStyle: "solid",
      borderWidth: "hairline",
      display: "flex",
      minInlineSize: "0",
      [REFUSED]: { borderColor: "border.error" },
    },
    itemContent: { display: "grid", flex: "1", minInlineSize: "0" },
    itemDeleteTrigger: trigger(),
    itemGroup: {
      "&:empty": { display: "none" },
      display: "grid",
      justifySelf: "stretch",
      listStyle: "none",
      margin: "0",
      padding: "0",
    },
    itemName: {
      color: "fg",
      fontWeight: "medium",
      overflowX: "clip",
      overflowY: "visible",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    itemPreview: {
      alignItems: "center",
      background: "bg.subtle",
      borderRadius: "l1",
      color: "fg.muted",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      overflow: "clip",
    },
    itemPreviewImage: { blockSize: "full", inlineSize: "full", objectFit: "cover" },
    itemSizeText: { color: "fg.muted", fontWeight: "normal" },
    label: { _disabled: { layerStyle: "disabled" }, color: "fg", fontWeight: "medium" },
    root: {
      borderStyle: "none",
      display: "grid",
      inlineSize: "full",
      justifyItems: "start",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
  },
  className: "file-upload",
  defaultVariants: { size: "md", variant: "outline" },
  jsx: [/^FileUpload(\.\w+)?$/u],
  slots: [
    "root",
    "label",
    "dropzone",
    "itemGroup",
    "item",
    "itemPreview",
    "itemPreviewImage",
    "itemContent",
    "itemName",
    "itemSizeText",
    "itemDeleteTrigger",
  ],
  variants: {
    /**
     * Height, padding and text at each size. The dropzone is at least 128, 160 or 192px tall, a
     * row's preview square is the control height, and the delete trigger is the input group's
     * square.
     */
    size: onSlots({
      dropzone: sizeVariants(
        (size) => ({
          "& svg": { boxSize: dense(`{sizes.icon.${GLYPHS[size]}}`) },
          gap: dense(`{spacing.gap.${below(size)}}`),
          minBlockSize: dense(`{sizes.${HEIGHTS[size]}}`),
          padding: dense(`{spacing.inset.${size}}`),
          textStyle: `label.${size}`,
        }),
        SIZES,
      ),
      item: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${size}}`),
          padding: dense(`{spacing.gap.${size}}`),
          textStyle: `label.${size}`,
        }),
        SIZES,
      ),
      itemDeleteTrigger: sizeVariants((size) => triggerSizes()[size], SIZES),
      itemGroup: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
      itemPreview: sizeVariants(
        (size) => ({
          "& svg": { boxSize: dense(`{sizes.icon.${size}}`) },
          boxSize: dense(`{sizes.control.${size}}`),
        }),
        SIZES,
      ),
      itemSizeText: sizeVariants((size) => ({ textStyle: `label.${below(size)}` }), SIZES),
      label: sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES),
      root: sizeVariants((size) => ({ rowGap: dense(`{spacing.gap.${below(size)}}`) }), SIZES),
    }),

    /**
     * Fill of the dropzone: the panel, or the subtle ground.
     */
    variant: onSlot("dropzone", LOOKS()),
  },
});
