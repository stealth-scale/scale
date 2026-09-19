/**
 * Defines the text styles: the sizes with the leading and tracking each is read at, and the roles
 * a recipe names instead of a size.
 *
 * @remarks
 *   A role states what the text is for. A heading role names the heading face, so a theme that
 *   sets a display face once changes every heading, and a label role is what a control's text
 *   reads, so a theme that tightens its controls restates eight styles rather than every recipe.
 *   The label grows slower than the control above `xl`, so a hero's words stay words while its
 *   box grows to a hero's. The heading role steps over two sizes above `2xl`, because a document
 *   heading and a hero heading are different things and a size between them reads as neither.
 *   A role names its leading and tracking from the token scales rather than from the size table,
 *   because the leading of a heading is a decision and the leading of a size is a computation.
 */

import { type TextStyle, type TextStyles } from "#pandacss.ts";
import { typography } from "#scales/type.ts";

/**
 * Describes what a role states beyond its size.
 */
interface Role {
  /**
   * The face, which is the body face unless the role says otherwise.
   */
  family?: string | undefined;

  /**
   * The leading, as a step of the line-height scale.
   */
  leading: string;

  /**
   * The size, as a step of the size scale.
   */
  size: string;

  /**
   * The tracking, as a step of the letter-spacing scale.
   */
  tracking: string;

  /**
   * The weight, as a step of the weight scale.
   */
  weight: string;
}

/**
 * Writes one role as a text style.
 */
function role(stated: Role): Record<"value", TextStyle> {
  return {
    value: {
      ...(stated.family === undefined ? {} : { fontFamily: stated.family }),
      fontSize: stated.size,
      fontWeight: stated.weight,
      letterSpacing: stated.tracking,
      lineHeight: stated.leading,
    },
  };
}

/**
 * Writes a heading role at one size, in the heading face.
 *
 * @remarks
 *   The leading and the tracking are the role's to state, because a heading of a document and a
 *   heading of a page are read differently: a section title at the text's own size keeps the
 *   text's leading and no tracking, a page title is set a little closer, and a hero heading is set
 *   tight and tracked in.
 */
function heading(
  size: string,
  leading: string,
  tracking = "normal",
  weight = "semibold",
): Record<"value", TextStyle> {
  return role({ family: "heading", leading, size, tracking, weight });
}

/**
 * Writes a body role at one size, at normal leading.
 */
function body(size: string): Record<"value", TextStyle> {
  return role({ leading: "normal", size, tracking: "normal", weight: "normal" });
}

/**
 * Writes a label role at one size, which is what a control's text is set in.
 */
function label(size: string): Record<"value", TextStyle> {
  return role({ leading: "tight", size, tracking: "normal", weight: "medium" });
}

/**
 * Writes a code role at one size, in the monospaced face.
 */
function code(size: string): Record<"value", TextStyle> {
  return role({ family: "mono", leading: "normal", size, tracking: "normal", weight: "normal" });
}

/**
 * Lists the text styles: the sizes `2xs` to `7xl`, then the roles over them.
 */
export const textStyles: TextStyles = {
  ...typography(),
  body: { lg: body("lg"), md: body("md"), sm: body("sm"), xl: body("xl"), xs: body("xs") },
  caption: role({ leading: "snug", size: "xs", tracking: "normal", weight: "normal" }),
  code: { md: code("md"), sm: code("sm") },
  display: {
    lg: role({
      family: "heading",
      leading: "none",
      size: "7xl",
      tracking: "tighter",
      weight: "bold",
    }),
    md: role({
      family: "heading",
      leading: "none",
      size: "6xl",
      tracking: "tighter",
      weight: "bold",
    }),
    sm: role({
      family: "heading",
      leading: "none",
      size: "5xl",
      tracking: "tighter",
      weight: "bold",
    }),
  },
  heading: {
    "2xl": heading("4xl", "tight", "tight", "bold"),
    "3xl": heading("6xl", "tight", "tight", "bold"),
    "4xl": heading("8xl", "tight", "tight", "bold"),
    lg: heading("2xl", "snug"),
    md: heading("xl", "snug"),
    sm: heading("lg", "normal"),
    xl: heading("3xl", "tight", "tight", "bold"),
    xs: heading("md", "normal"),
  },
  label: {
    "2xl": label("lg"),
    "3xl": label("xl"),
    "4xl": label("2xl"),
    lg: label("lg"),
    md: label("md"),
    sm: label("sm"),
    xl: label("xl"),
    xs: label("xs"),
  },
};
