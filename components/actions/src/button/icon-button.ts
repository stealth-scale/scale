/**
 * Renders an icon-only button and forces the caller to supply an accessible name for it.
 *
 * @remarks
 *   The button recipe is reused with `shape` defaulted to `square`, so a theme that restyles the
 *   button restyles this with it. An icon contributes no text content, so the props type demands
 *   either `aria-label` or `aria-labelledby`. A union makes an unnamed icon button a compile
 *   error, where a lint rule would only warn about one.
 */

import { type ComponentProps, type JSX } from "react";

import { withContext } from "#button/context.ts";

/**
 * Applies the button recipe with `shape` pinned to `square`, keeping the same `type` default the
 * button sets.
 */
const Square = withContext("button", { defaultProps: { shape: "square", type: "button" } });

/**
 * Carries the accessible name as text on the element itself.
 */
interface Labelled {
  /**
   * The text announced in place of the icon.
   */
  "aria-label": string;
}

/**
 * Carries the accessible name by reference to another element.
 */
interface LabelledBy {
  /**
   * The id of the element whose text announces this control.
   */
  "aria-labelledby": string;
}

/**
 * Admits either accessible-name attribute and rejects a control that carries neither.
 */
export type Named = Labelled | LabelledBy;

/**
 * Extends the square button's props with the accessible-name requirement.
 */
export type IconButtonProps = ComponentProps<typeof Square> & Named;

/**
 * Renders a square button around a single icon, announced through `aria-label` or
 * `aria-labelledby`.
 */
export const IconButton: (props: IconButtonProps) => JSX.Element = Square;
