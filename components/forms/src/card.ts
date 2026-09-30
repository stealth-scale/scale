/**
 * Styles a card a person chooses, which the radio card and the checkbox card render alike.
 *
 * @remarks
 *   Each function returns the styles of one part, and each recipe places them on its own slots, so
 *   the two cards share their edges, fills, padding and text and differ only in the mark. The card
 *   is the target: it renders the focus ring, rests on the panel and takes the look's fill while
 *   checked. The content is a grid of the words and the mark. The title reads the label role, and
 *   the description and the addon read the body role one size smaller. A disabled card fills with
 *   `bg.subtle`, and its words dim.
 */

import { below, dense, sizeVariants, type SystemStyleObject } from "@stealthscale/theme/authoring";

/**
 * Sizes a card is offered at.
 */
export const SIZES = ["sm", "md", "lg"] as const;

/**
 * Selects one of the sizes a card is offered at.
 */
export type Size = (typeof SIZES)[number];

/**
 * Selects where a card's mark goes: at the end of the words, or above them.
 */
export type Layout = "inline" | "stacked";

/**
 * Describes the placement of the content's grid and of the mark in it for one layout.
 */
export interface Placement {
  /**
   * Columns of the content's grid.
   */
  readonly content: SystemStyleObject;

  /**
   * Cell of the mark in the content's grid.
   */
  readonly mark: SystemStyleObject;
}

/**
 * Returns the base of a card: the panel surface, the edge, the focus ring and the states.
 */
export function card(): SystemStyleObject {
  return {
    _disabled: { background: "bg.subtle", cursor: "disabled" },
    _hover: { borderColor: "border.emphasized" },
    _invalid: { borderColor: "border.error" },
    background: "bg.panel",
    borderColor: "border",
    borderRadius: "l2",
    borderWidth: "control",
    color: "fg",
    cursor: "button",
    display: "flex",
    flexDirection: "column",
    focusRingColor: "colorPalette.focusRing",
    focusVisibleRing: "outside",
    position: "relative",
    transitionDuration: "press",
    transitionProperty: "common",
    transitionTimingFunction: "press",
    userSelect: "none",
  };
}

/**
 * Returns the base of the content: a grid whose rows keep to their content in a card stretched to
 * the height of its row.
 */
export function content(): SystemStyleObject {
  return { alignContent: "start", alignItems: "start", display: "grid", flex: "1" };
}

/**
 * Returns the base of the title: the card's ink at the medium weight, in the first column.
 */
export function title(): SystemStyleObject {
  return {
    _disabled: { layerStyle: "disabled" },
    color: "inherit",
    fontWeight: "medium",
    gridColumn: "1",
  };
}

/**
 * Returns the base of the description: the muted ink, in the first column.
 */
export function description(): SystemStyleObject {
  return { _disabled: { layerStyle: "disabled" }, color: "fg.muted", gridColumn: "1" };
}

/**
 * Returns the base of the addon: a row under a hairline in the card's edge color.
 */
export function addon(): SystemStyleObject {
  return {
    _disabled: { layerStyle: "disabled" },
    borderBlockStartWidth: "hairline",
    borderColor: "inherit",
    color: "fg.muted",
    display: "block",
  };
}

/**
 * Returns the addon at each size: the gap scale above and below, the inset scale beside, and the
 * body role one size smaller.
 */
export function addonSizes(): Record<Size, SystemStyleObject> {
  return sizeVariants(
    (size) => ({
      paddingBlock: dense(`{spacing.gap.${size}}`),
      paddingInline: dense(`{spacing.inset.${size}}`),
      textStyle: `body.${below(size)}`,
    }),
    SIZES,
  );
}

/**
 * Returns the content at each size: the inset scale around it, the gap scale between its columns,
 * and the smallest gap between its rows.
 */
export function contentSizes(): Record<Size, SystemStyleObject> {
  return sizeVariants(
    (size) => ({
      columnGap: dense(`{spacing.gap.${size}}`),
      padding: dense(`{spacing.inset.${size}}`),
      rowGap: dense("{spacing.gap.xs}"),
    }),
    SIZES,
  );
}

/**
 * Returns the description at each size: the body role one size smaller.
 */
export function descriptionSizes(): Record<Size, SystemStyleObject> {
  return sizeVariants((size) => ({ textStyle: `body.${below(size)}` }), SIZES);
}

/**
 * Returns the title at each size: the label role.
 */
export function titleSizes(): Record<Size, SystemStyleObject> {
  return sizeVariants((size) => ({ textStyle: `label.${size}` }), SIZES);
}

/**
 * Returns the alignment of the words and the mark in the content.
 *
 * @param align - Start or center.
 */
export function aligned(align: "center" | "start"): SystemStyleObject {
  return { justifyItems: align, textAlign: align };
}

/**
 * Returns the content's columns and the mark's cell for one layout.
 *
 * @remarks
 *   The inline layout puts the mark in a second column beside the title and the description, and
 *   the stacked layout puts it in the first row above them.
 * @param layout - Inline or stacked.
 */
export function laidOut(layout: Layout): Placement {
  return layout === "inline"
    ? {
        content: { gridTemplateColumns: "minmax(0, 1fr) auto" },
        mark: { gridColumn: "2", gridRow: "1 / span 2" },
      }
    : {
        content: { gridTemplateColumns: "minmax(0, 1fr)" },
        mark: { gridColumn: "1", gridRow: "1" },
      };
}

/**
 * Returns the invalid edge a look restates after its checked edge.
 *
 * @remarks
 *   The compiler emits a look in a later cascade layer than the base, so the base's invalid edge
 *   gives way to every look's checked edge. Restated after the checked edge in the same look, the
 *   invalid edge applies to a checked card that is invalid.
 */
function invalidEdge(): SystemStyleObject {
  return { _invalid: { borderColor: "border.error" } };
}

/**
 * Returns the solid look of a card: the palette's solid fill and the contrast ink while checked.
 */
export function solidCard(): SystemStyleObject {
  return {
    _checked: {
      background: "colorPalette.solid",
      borderColor: "colorPalette.solid",
      color: "colorPalette.contrast",
    },
    ...invalidEdge(),
  };
}

/**
 * Returns the ink of the description and the addon on a checked solid card: the card's own.
 */
export function onSolid(): SystemStyleObject {
  return { _checked: { color: "inherit" } };
}

/**
 * Returns the subtle look of a card: the muted surface at rest and the palette's muted fill while
 * checked, with no edge but the invalid one.
 *
 * @remarks
 *   The look restates the invalid edge, because its transparent edge would apply over the base's.
 */
export function subtleCard(): SystemStyleObject {
  return {
    _checked: { background: "colorPalette.muted", color: "colorPalette.fg" },
    ...invalidEdge(),
    background: "bg.muted",
    borderColor: "transparent",
  };
}

/**
 * Returns the surface look of a card: the palette's subtle fill and muted edge while checked.
 */
export function surfaceCard(): SystemStyleObject {
  return {
    _checked: {
      background: "colorPalette.subtle",
      borderColor: "colorPalette.muted",
      color: "colorPalette.fg",
    },
    ...invalidEdge(),
  };
}

/**
 * Returns the outline look of a card: the palette's solid edge while checked.
 */
export function outlineCard(): SystemStyleObject {
  return { _checked: { borderColor: "colorPalette.solid" }, ...invalidEdge() };
}

/**
 * Returns the edge of a checked card under forced colors: `Highlight`.
 *
 * @remarks
 *   A recipe places it in a compound over every look, because each look writes a checked edge and
 *   the compiler emits the looks in a later cascade layer than the base.
 */
export function forcedEdge(): SystemStyleObject {
  return { _highContrast: { _checked: { borderColor: "Highlight" } } };
}
