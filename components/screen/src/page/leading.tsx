/**
 * Renders the mark before the title, such as an avatar, a logo or an icon for the kind of item.
 *
 * @remarks
 *   The mark and the title read as one line. Give the mark an accessible name when it adds
 *   information, and hide it when it repeats the title. `when` renders it at one width of the page
 *   alone, such as a mark a phone gives the title's room to.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { useShown, type WhenProps } from "#page/state.ts";

/**
 * Renders the `div` with the recipe's leading class.
 */
const Mark = withContext("div", "leading");

/**
 * Describes the props of the leading mark: `when` and the props of a `div`.
 */
export interface LeadingProps extends ComponentProps<typeof Mark>, WhenProps {}

/**
 * Renders the leading mark at the width `when` names.
 *
 * @param props - The width and the props of a `div`.
 * @returns The `div` element, or nothing at the other width.
 */
export function Leading({ when, ...rest }: LeadingProps): null | ReactElement {
  return useShown(when) ? <Mark {...rest} /> : null;
}
