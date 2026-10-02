/**
 * Declares the attachment's slot recipe: a file attached to a message or waiting in a composer, and
 * the list that groups several.
 *
 * @remarks
 *   A horizontal attachment is a row: the media square, the title over the description, and the
 *   actions at the end. A vertical one is a tile: the media across the top, the words under it,
 *   and the actions over the media's corner. The root writes its state as `data-state`: an `idle`
 *   attachment, not yet sent, has a dashed edge, and a failed one has the error edge and inks its
 *   media and description in the error ink. The title and the description keep one line and end in
 *   an ellipsis, so a long file name never widens the list. A group stacks rows and wraps tiles.
 */

import {
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
  truncate,
} from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, which a selector across parts reads.
 */
const CLASS = "attachment";

/**
 * Selects the media of an attachment, from a rule on its root.
 */
const MEDIA = `.${CLASS}__media`;

/**
 * Selects the description of an attachment, from a rule on its root.
 */
const DESCRIPTION = `.${CLASS}__description`;

/**
 * Sizes the attachment offers.
 */
const SIZES = ["xs", "sm", "md"] as const;

/**
 * Describes one size's steps and text styles.
 */
interface Metric {
  /**
   * Text style of the description.
   */
  readonly detail: string;

  /**
   * Step of the gap scale between the parts.
   */
  readonly gap: string;

  /**
   * Step of the inset scale around the parts.
   */
  readonly inset: string;

  /**
   * Step of the control scale the media square takes.
   */
  readonly media: string;

  /**
   * Text style of the title.
   */
  readonly text: string;
}

/**
 * Maps each size to its steps and text styles.
 */
const METRICS: Readonly<Record<(typeof SIZES)[number], Metric>> = {
  md: { detail: "body.xs", gap: "sm", inset: "sm", media: "md", text: "label.sm" },
  sm: { detail: "body.xs", gap: "sm", inset: "xs", media: "sm", text: "label.xs" },
  xs: { detail: "body.xs", gap: "xs", inset: "xs", media: "xs", text: "label.xs" },
};

/**
 * Styles a horizontal attachment at the middle size.
 */
export const recipe = defineSlotRecipe({
  base: {
    actions: {
      alignItems: "center",
      display: "flex",
      flexShrink: "0",
      gap: dense("{spacing.gap.xs}"),
    },
    content: {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      minInlineSize: "0",
    },
    description: {
      ...truncate(),
      color: "fg.muted",
    },
    group: {
      display: "flex",
      gap: dense("{spacing.gap.sm}"),
      listStyle: "none",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
    },
    media: {
      "& > img": { blockSize: "full", inlineSize: "full", objectFit: "cover" },
      "& > svg": { blockSize: "50%", inlineSize: "50%" },
      alignItems: "center",
      aspectRatio: "square",
      backgroundColor: "bg.muted",
      borderRadius: "l1",
      color: "fg.muted",
      display: "flex",
      flexShrink: "0",
      justifyContent: "center",
      overflow: "hidden",
    },
    root: {
      "&[data-state=error]": {
        [`& ${DESCRIPTION}, & ${MEDIA}`]: { color: "fg.error" },
        borderColor: "border.error",
      },
      "&[data-state=idle]": { borderStyle: "dashed" },
      alignItems: "center",
      backgroundColor: "bg.panel",
      borderColor: "border",
      borderRadius: "l2",
      borderStyle: "solid",
      borderWidth: "hairline",
      display: "flex",
      maxInlineSize: "full",
      minInlineSize: "0",
      position: "relative",
    },
    title: {
      ...truncate(),
      color: "fg",
      fontWeight: "medium",
    },
  },
  className: CLASS,
  compoundVariants: [
    {
      css: { media: { inlineSize: "full" } },
      name: "tiled",
      orientation: "vertical",
    },
  ],
  defaultVariants: { orientation: "horizontal", size: "md" },
  jsx: [/^Attachment\.\w+$/u],
  slots: ["group", "root", "media", "content", "title", "description", "actions"],
  variants: {
    /**
     * Whether an attachment is a row or a tile, and whether a group stacks or wraps them.
     */
    orientation: {
      horizontal: {
        group: { flexDirection: "column" },
        root: { flexDirection: "row", minInlineSize: "min({sizes.40}, 100%)" },
      },
      vertical: {
        actions: {
          insetBlockStart: dense("{spacing.inset.xs}"),
          insetInlineEnd: dense("{spacing.inset.xs}"),
          position: "absolute",
        },
        group: { flexDirection: "row", flexWrap: "wrap" },
        root: { alignItems: "stretch", flexDirection: "column", inlineSize: "{sizes.32}" },
      },
    },
    size: onSlots({
      description: sizeVariants((size) => ({ textStyle: METRICS[size].detail }), SIZES),
      media: sizeVariants(
        (size) => ({ inlineSize: dense(`{sizes.control.${METRICS[size].media}}`) }),
        SIZES,
      ),
      root: sizeVariants(
        (size) => ({
          gap: dense(`{spacing.gap.${METRICS[size].gap}}`),
          padding: dense(`{spacing.inset.${METRICS[size].inset}}`),
        }),
        SIZES,
      ),
      title: sizeVariants((size) => ({ textStyle: METRICS[size].text }), SIZES),
    }),
  },
});
