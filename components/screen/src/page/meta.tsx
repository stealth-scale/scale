/**
 * Renders the row beside the title, such as a status, a count or the date the item was created.
 *
 * @remarks
 *   The row shares the title's line on a wide page and moves onto its own row under the title on
 *   a folded page, so the title's text wraps before the meta stacks. `when` renders it at one width
 *   of the page alone, such as a count the narrow page's tab picker already shows.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { useShown, type WhenProps } from "#page/state.ts";

/**
 * Renders the `div` with the recipe's meta class.
 */
const Row = withContext("div", "meta");

/**
 * Describes the props of the meta row: `when` and the props of a `div`.
 */
export interface MetaProps extends ComponentProps<typeof Row>, WhenProps {}

/**
 * Renders the meta row at the width `when` names.
 *
 * @param props - The width and the props of a `div`.
 * @returns The `div` element, or nothing at the other width.
 */
export function Meta({ when, ...rest }: MetaProps): null | ReactElement {
  return useShown(when) ? <Row {...rest} /> : null;
}
