/**
 * Renders a square button that contains one icon and requires an accessible name.
 *
 * @remarks
 *   It binds the button recipe with `shape` defaulting to `square`, so a theme that restyles the
 *   button restyles it too. An icon provides no text, so the props type requires `aria-label` or
 *   `aria-labelledby`. The union makes an unnamed icon button a type error, where a lint rule would
 *   only warn.
 */

import { type ComponentProps, type JSX } from "react";

import { withContext } from "#button/context.ts";

/**
 * Renders a button with `shape` defaulting to `square` and `type` defaulting to `button`.
 */
const Square = withContext("button", { defaultProps: { shape: "square", type: "button" } });

/**
 * Describes the prop that gives the control its accessible name as text.
 */
interface Labelled {
  /**
   * The accessible name a screen reader announces in place of the icon.
   */
  "aria-label": string;
}

/**
 * Describes the prop that takes the control's accessible name from another element.
 */
interface LabelledBy {
  /**
   * The id of the element whose text names the control.
   */
  "aria-labelledby": string;
}

/**
 * Requires `aria-label` or `aria-labelledby`.
 */
export type Named = Labelled | LabelledBy;

/**
 * Combines the square button's props with the accessible-name requirement.
 */
export type IconButtonProps = ComponentProps<typeof Square> & Named;

/**
 * Renders a square button around one icon, named by `aria-label` or `aria-labelledby`.
 */
export const IconButton: (props: IconButtonProps) => JSX.Element = Square;
