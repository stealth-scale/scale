/**
 * Renders the row above the title that shows where the page is, such as a breadcrumb trail.
 *
 * @remarks
 *   The row reads the body role one size smaller than the page, so a reader takes the title first.
 *   `when` renders it at one width of the page alone.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { useShown, type WhenProps } from "#page/state.ts";

/**
 * Renders the `div` with the recipe's context class.
 */
const Row = withContext("div", "context");

/**
 * Describes the props of the context row: `when` and the props of a `div`.
 */
export interface ContextProps extends ComponentProps<typeof Row>, WhenProps {}

/**
 * Renders the context row at the width `when` names.
 *
 * @param props - The width and the props of a `div`.
 * @returns The `div` element, or nothing at the other width.
 */
export function Context({ when, ...rest }: ContextProps): null | ReactElement {
  return useShown(when) ? <Row {...rest} /> : null;
}
