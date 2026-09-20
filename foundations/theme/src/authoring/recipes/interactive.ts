/**
 * Writes what every control the reader can press has in common, what a link has, and what a row of
 * a list the reader chooses from has.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Writes the base of a control: the hand, a transition of the properties a state changes at the
 * pace and the curve a press is answered with, no text selection, the disabled look, and the
 * focus ring in the palette's own color.
 *
 * @remarks
 *   The ring is the compiler's `focusVisibleRing` utility drawn outside the box, so a focused
 *   control does not change size, and its color is the palette's `focusRing` role, so a theme
 *   moves it with the palette. The box holds still under a press: a press is read from the look's
 *   pressed fill, from a ripple where the recipe draws one, and from an elevation dropping, and a
 *   box that shrinks under the pointer reads as flinching rather than as answering.
 */
export function interactive(): SystemStyleObject {
  return {
    _disabled: { layerStyle: "disabled" },
    cursor: "button",
    focusRingColor: "colorPalette.focusRing",
    focusVisibleRing: "outside",
    transitionDuration: "press",
    transitionProperty: "common",
    transitionTimingFunction: "press",
    userSelect: "none",
  };
}

/**
 * Writes the base of a link: the link ink, an underline on hover, the focus ring, and the same
 * ink once visited.
 *
 * @remarks
 *   A visited link keeps the link ink rather than taking the browser's purple, because the
 *   browser's purple is not a color the theme drew and clears no ratio the theme measured.
 */
export function link(): SystemStyleObject {
  return {
    _hover: { textDecoration: "underline", textUnderlineOffset: "normal" },
    _visited: { color: "fg.link" },
    color: "fg.link",
    cursor: "button",
    focusRingColor: "colorPalette.focusRing",
    focusVisibleRing: "outside",
    textDecoration: "none",
  };
}

/**
 * Writes the base of a row in a list the reader chooses from: a full-width line that holds a mark,
 * a label and a hint side by side, and that the list moves a highlight over.
 *
 * @remarks
 *   The row carries no focus ring and no press, because a list of this kind keeps focus on the
 *   container and moves a highlight over the rows. The pointer is the arrow rather than the hand,
 *   which is what the menu pattern asks for and what every desktop menu does. The row is positioned
 *   so a mark can be placed in the gutter the list leaves for one.
 */
export function row(): SystemStyleObject {
  return {
    _disabled: { layerStyle: "disabled" },
    alignItems: "center",
    borderRadius: "l1",
    cursor: "menuitem",
    display: "flex",
    flex: "0 0 auto",
    inlineSize: "100%",
    outline: "0",
    position: "relative",
    textAlign: "start",
    textDecoration: "none",
    transitionDuration: "press",
    transitionProperty: "common",
    transitionTimingFunction: "press",
    userSelect: "none",
  };
}
