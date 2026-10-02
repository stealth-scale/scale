/**
 * Returns the styles of a square button for a field, which the number input's steppers, the
 * password input's visibility toggle, the editable's triggers and the tags input's clear trigger
 * share.
 *
 * @remarks
 *   The button is a square of the tag height at its size and never under 24px, the WCAG 2.5.8
 *   target size. It takes the field's muted ink, fills with `bg.muted` on hover and with
 *   `bg.emphasized` while pressed, and a disabled button is transparent on hover. It sizes its
 *   glyph to 1.25 times its text, the size an input group's mark gives a glyph. A mark at an input
 *   group's end places it 4px from the box's end. Each recipe that spreads these keeps its own
 *   class name, so a theme can restyle one without the other.
 */

import {
  dense,
  interactive,
  type Scale,
  sizeVariants,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Returns the base styles of the button, which render an interactive square in the field's muted
 * ink.
 */
export function trigger(): SystemStyleObject {
  return {
    ...interactive(),
    _active: { background: "bg.emphasized" },
    _disabled: {
      _hover: { background: "transparent", color: "fg.muted" },
      layerStyle: "disabled",
    },
    _hover: { background: "bg.muted", color: "fg" },
    "& svg": { boxSize: "1.25em", flexShrink: "0" },
    alignItems: "center",
    borderRadius: "l1",
    color: "fg.muted",
    display: "inline-flex",
    flexShrink: "0",
    justifyContent: "center",
    padding: "0",
  };
}

/**
 * Returns the side of the button's square at one size: the tag height, and at least 24px.
 */
export function triggerSide(size: Scale): string {
  return `max({sizes.6}, ${dense(`{sizes.tag.${size}}`)})`;
}

/**
 * Returns the button's size axis, which sizes the square to its side at each size.
 */
export function triggerSizes(): Record<Scale, SystemStyleObject> {
  return sizeVariants((size) => ({ boxSize: triggerSide(size) }));
}
