/**
 * Writes the base of a thing that floats over the page: a popover or a menu, and the backdrop
 * behind a dialog.
 */

import { motion } from "#authoring/recipes/motion.ts";
import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Writes the base of a popover or a menu: the popover surface, a hairline edge, the roundest
 * corner, a lifted shadow, the popover rung, and a scale-fade in and out.
 */
export function floating(): SystemStyleObject {
  return {
    ...motion("scale-fade.in", "scale-fade.out"),
    background: "bg.popover",
    borderColor: "border",
    borderRadius: "l3",
    borderWidth: "hairline",
    boxShadow: "lg",
    color: "fg",
    zIndex: "popover",
  };
}

/**
 * Writes the base of a backdrop: the whole viewport, dimmed, on the overlay rung, fading in and
 * out.
 */
export function overlay(): SystemStyleObject {
  return {
    ...motion("fade.in", "fade.out"),
    background: "bg.backdrop",
    inset: "0",
    position: "fixed",
    zIndex: "overlay",
  };
}
