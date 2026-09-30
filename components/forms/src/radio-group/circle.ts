/**
 * Styles the circle of a radio option, which the radio group and the radio card render alike.
 *
 * @remarks
 *   The circle reads the theme's field fragment, so its edge, hover and invalid state match the
 *   checkbox's box and every text field. It leaves out the fragment's coarse-pointer height,
 *   because a circle's height is its size: the radio group widens its target with `touchTarget`,
 *   and a radio card is its own target. A checked circle shows a dot in the look's ink, rendered
 *   as `::after`, scaled by the look, and in `CanvasText` under forced colors.
 */

import { dense, field, sizeVariants, type SystemStyleObject } from "@stealthscale/theme/authoring";

/**
 * Sizes a circle is offered at.
 */
export const SIZES = ["sm", "md", "lg"] as const;

/**
 * Returns the base of a circle: the field's edge and states, a round box, and the dot of a checked
 * circle.
 */
export function circle(): SystemStyleObject {
  const { _touch: _raised, ...edged } = field();

  return {
    ...edged,
    _checked: {
      _after: {
        background: "currentColor",
        borderRadius: "full",
        boxSize: "full",
        content: '""',
      },
    },
    _highContrast: {
      _checked: { _after: { background: "CanvasText", forcedColorAdjust: "none" } },
    },
    alignItems: "center",
    borderRadius: "full",
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center",
  };
}

/**
 * Returns a look that fills a checked circle with a layer style and scales its dot.
 *
 * @param layerStyle - Layer style of the checked fill.
 * @param dot - Scale of the dot against the circle.
 */
export function filled(layerStyle: string, dot = "0.4"): SystemStyleObject {
  return { _checked: { _after: { scale: dot }, layerStyle } };
}

/**
 * Returns the size axis of a circle: a box on the icon scale at each size.
 */
export function circleSizes(): Record<(typeof SIZES)[number], SystemStyleObject> {
  return sizeVariants((size) => ({ boxSize: dense(`{sizes.icon.${size}}`) }), SIZES);
}
