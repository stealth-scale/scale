/**
 * Builds the text roles a recipe names in place of a size: body, heading, label, caption, code and
 * display, each with a face, a weight, a leading and a tracking.
 *
 * @remarks
 *   A theme restates a role once and every recipe that reads it follows. The heading role sets the
 *   heading face. The label role sets a control's text. Above `xl` the label grows more slowly
 *   than its control: the label sizes at `xl` to `4xl` are 20.25, 20.25, 20.25 and 22.78px at the
 *   foundation's scale, while the control grows from 48 to 80px. The heading role skips two sizes
 *   per step above `2xl`, because a document heading and a hero heading are separate uses. A role
 *   reads its leading and tracking from the token scales, not from the size table.
 */

import { type TextStyle, type TextStyles } from "#pandacss.ts";

/**
 * Describes the body role settings a theme can state.
 */
export interface BodyRole {
  /**
   * Leading of body text, as a step of the line-height scale. Defaults to `normal`.
   */
  leading?: string | undefined;
}

/**
 * Describes the heading role settings a theme can state. Each setting applies to every step.
 */
export interface HeadingRole {
  /**
   * Leading, as a step of the line-height scale. Defaults to each step's own.
   */
  leading?: string | undefined;

  /**
   * Tracking, as a step of the letter-spacing scale. Defaults to each step's own.
   */
  tracking?: string | undefined;

  /**
   * Weight, as a step of the weight scale. Defaults to semibold below `xl` and bold from `xl`.
   */
  weight?: string | undefined;
}

/**
 * Describes the label role settings a theme can state.
 */
export interface LabelRole {
  /**
   * Tracking of a control's text, as a step of the letter-spacing scale. Defaults to `normal`.
   *
   * @remarks
   *   The setting is part of the role, not a recipe extension. The role is written into every size
   *   variant, and the compiler puts variants in a later cascade layer than the base, so tracking
   *   in a theme's `base` never applies to a control that has a size.
   */
  tracking?: string | undefined;

  /**
   * Weight of a control's text. Defaults to `medium`.
   */
  weight?: string | undefined;
}

/**
 * Describes the roles a theme can restate.
 */
export interface Roles {
  /**
   * Settings of the body role.
   */
  body?: BodyRole | undefined;

  /**
   * Settings of the heading role.
   */
  heading?: HeadingRole | undefined;

  /**
   * Settings of the label role.
   */
  label?: LabelRole | undefined;
}

/**
 * Describes one role at one size.
 */
interface Role {
  /**
   * Face. Defaults to the body face.
   */
  family?: string | undefined;

  /**
   * Leading, as a step of the line-height scale.
   */
  leading: string;

  /**
   * Size, as a step of the font-size scale.
   */
  size: string;

  /**
   * Tracking, as a step of the letter-spacing scale.
   */
  tracking: string;

  /**
   * Weight, as a step of the weight scale.
   */
  weight: string;
}

/**
 * Describes one step of the heading role: its size, and the leading, tracking and weight a theme
 * can override.
 */
interface HeadingStep {
  /**
   * Leading, as a step of the line-height scale.
   */
  leading: string;

  /**
   * Size, as a step of the font-size scale.
   */
  size: string;

  /**
   * Tracking, as a step of the letter-spacing scale. Defaults to `normal`.
   */
  tracking?: string | undefined;

  /**
   * Weight, as a step of the weight scale. Defaults to `semibold`.
   */
  weight?: string | undefined;
}

/**
 * Returns one role as a text style token.
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
 * Returns one heading step in the heading face, with the theme's settings over the step's own.
 *
 * @remarks
 *   Each step states its own leading and tracking. A section heading at body size keeps normal
 *   leading, a page heading is snug, and a hero heading is tight with tight tracking.
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
 * Returns the body role at one size, at the theme's leading or `normal`.
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
 * Returns the label role at one size, at the theme's weight or `medium`.
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
 * Returns the code role at one size, in the monospaced face.
 */
function code(size: string): Record<"value", TextStyle> {
  return role({ family: "mono", leading: "normal", size, tracking: "normal", weight: "normal" });
}

/**
 * Returns the display role at one size: bold, with no leading and the tightest tracking.
 */
function display(size: string): Record<"value", TextStyle> {
  return role({ family: "heading", leading: "none", size, tracking: "tighter", weight: "bold" });
}

/**
 * Returns every text role at every size it offers, with the theme's settings applied.
 *
 * @param stated - Role settings the theme states. Each defaults to the foundation's.
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
      "2xl": label(stated, "xl"),
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
