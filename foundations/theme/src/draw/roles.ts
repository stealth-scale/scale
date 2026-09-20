/**
 * Draws the text roles a recipe names instead of a size: body, heading, label, caption, code and
 * display, each with the face, the weight, the leading and the tracking it is read at.
 *
 * @remarks
 *   A role states what the text is for. A heading role names the heading face, so a theme that
 *   sets a display face once changes every heading, and a label role is what a control's text
 *   reads, so a theme that tightens its controls restates one role rather than every recipe. The
 *   label grows slower than the control above `xl`, so a hero's words stay words while its box
 *   grows to a hero's. The heading role steps over two sizes above `2xl`, because a document
 *   heading and a hero heading are different things and a size between them reads as neither. A
 *   role names its leading and tracking from the token scales rather than from the size table,
 *   because the leading of a heading is a decision and the leading of a size is a computation. A
 *   theme moves a role once: a heavier or tighter heading, a body with more air, or a lighter
 *   label reaches every recipe that reads the role.
 */

import { type TextStyle, type TextStyles } from "#pandacss.ts";

/**
 * Describes what a theme states about the body role.
 */
export interface BodyRole {
  /**
   * The leading body text is read at, as a step of the line-height scale. `normal` unless stated.
   */
  leading?: string | undefined;
}

/**
 * Describes what a theme states about the heading role, which every step of the role takes.
 */
export interface HeadingRole {
  /**
   * The leading, as a step of the line-height scale. Each step's own unless stated.
   */
  leading?: string | undefined;

  /**
   * The tracking, as a step of the letter-spacing scale. Each step's own unless stated.
   */
  tracking?: string | undefined;

  /**
   * The weight, as a step of the weight scale. Semibold below `xl` and bold from it unless
   * stated.
   */
  weight?: string | undefined;
}

/**
 * Describes what a theme states about the label role.
 */
export interface LabelRole {
  /**
   * The tracking a control's words are set at, as a step of the letter-spacing scale. `normal`
   * unless stated.
   *
   * @remarks
   *   Stated here rather than in a recipe extension. The role is written into every size variant,
   *   and the compiler layers a recipe's variants over its base, so tracking written into a
   *   theme's `base` never reaches a control that has a size.
   */
  tracking?: string | undefined;

  /**
   * The weight a control's words are set in. `medium` unless stated.
   */
  weight?: string | undefined;
}

/**
 * Describes the roles a theme moves.
 */
export interface Roles {
  /**
   * The role body text is read at.
   */
  body?: BodyRole | undefined;

  /**
   * The role every heading is read at.
   */
  heading?: HeadingRole | undefined;

  /**
   * The role a control's words are read at.
   */
  label?: LabelRole | undefined;
}

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
 * Describes one step of the heading role: the size it is set at, and the leading, tracking and
 * weight of its own that the theme may override.
 */
interface HeadingStep {
  /**
   * The leading, as a step of the line-height scale.
   */
  leading: string;

  /**
   * The size, as a step of the size scale.
   */
  size: string;

  /**
   * The tracking, as a step of the letter-spacing scale. `normal` unless the step says otherwise.
   */
  tracking?: string | undefined;

  /**
   * The weight, as a step of the weight scale. `semibold` unless the step says otherwise.
   */
  weight?: string | undefined;
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
 * Writes a heading role at one step, in the heading face, with what the theme states over the
 * step's own leading, tracking and weight.
 *
 * @remarks
 *   The leading and the tracking are the step's to state, because a heading of a document and a
 *   heading of a page are read differently: a section title at the text's own size keeps the
 *   text's leading and no tracking, a page title is set a little closer, and a hero heading is set
 *   tight and tracked in.
 */
function heading(stated: Roles, step: HeadingStep): Record<"value", TextStyle> {
  return role({
    family: "heading",
    leading: stated.heading?.leading ?? step.leading,
    size: step.size,
    tracking: stated.heading?.tracking ?? step.tracking ?? "normal",
    weight: stated.heading?.weight ?? step.weight ?? "semibold",
  });
}

/**
 * Writes a body role at one size, at the leading the theme states or the normal one.
 */
function body(stated: Roles, size: string): Record<"value", TextStyle> {
  return role({
    leading: stated.body?.leading ?? "normal",
    size,
    tracking: "normal",
    weight: "normal",
  });
}

/**
 * Writes a label role at one size, which is what a control's text is set in, at the weight the
 * theme states or medium.
 */
function label(stated: Roles, size: string): Record<"value", TextStyle> {
  return role({
    leading: "tight",
    size,
    tracking: stated.label?.tracking ?? "normal",
    weight: stated.label?.weight ?? "medium",
  });
}

/**
 * Writes a code role at one size, in the monospaced face.
 */
function code(size: string): Record<"value", TextStyle> {
  return role({ family: "mono", leading: "normal", size, tracking: "normal", weight: "normal" });
}

/**
 * Writes a display role at one size: bold, with no leading and the tightest tracking.
 */
function display(size: string): Record<"value", TextStyle> {
  return role({ family: "heading", leading: "none", size, tracking: "tighter", weight: "bold" });
}

/**
 * Draws the text roles over the sizes, with what the theme states about each role.
 *
 * @param stated - The roles the theme moves, each the foundation's unless stated.
 */
export function roles(stated: Roles = {}): TextStyles {
  return {
    body: {
      lg: body(stated, "lg"),
      md: body(stated, "md"),
      sm: body(stated, "sm"),
      xl: body(stated, "xl"),
      xs: body(stated, "xs"),
    },
    caption: role({ leading: "snug", size: "xs", tracking: "normal", weight: "normal" }),
    code: { md: code("md"), sm: code("sm") },
    display: { lg: display("7xl"), md: display("6xl"), sm: display("5xl") },
    heading: {
      "2xl": heading(stated, { leading: "tight", size: "4xl", tracking: "tight", weight: "bold" }),
      "3xl": heading(stated, { leading: "tight", size: "6xl", tracking: "tight", weight: "bold" }),
      "4xl": heading(stated, { leading: "tight", size: "8xl", tracking: "tight", weight: "bold" }),
      lg: heading(stated, { leading: "snug", size: "2xl" }),
      md: heading(stated, { leading: "snug", size: "xl" }),
      sm: heading(stated, { leading: "normal", size: "lg" }),
      xl: heading(stated, { leading: "tight", size: "3xl", tracking: "tight", weight: "bold" }),
      xs: heading(stated, { leading: "normal", size: "md" }),
    },
    label: {
      "2xl": label(stated, "lg"),
      "3xl": label(stated, "xl"),
      "4xl": label(stated, "2xl"),
      lg: label(stated, "lg"),
      md: label(stated, "md"),
      sm: label(stated, "sm"),
      xl: label(stated, "xl"),
      xs: label(stated, "xs"),
    },
  };
}
