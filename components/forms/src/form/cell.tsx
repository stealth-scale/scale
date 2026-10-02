/**
 * Renders the cell around one field of a form built from a schema.
 *
 * @remarks
 *   A field without a span is its own grid item, so the cell renders nothing of its own. A field
 *   with a span renders inside an element that spans that many columns of the grid around it, and
 *   one column while the grid's fields do not fit. A span outside a grid changes nothing.
 */

import { type ReactNode } from "react";

import { type CellProps } from "@stealthscale/provider-form";

import { withContext } from "#form/context.ts";
import { SPAN } from "#form/recipe.ts";

/**
 * Renders the `div` with the form's cell class.
 */
const Spanned = withContext("div", "cell");

/**
 * Renders a field as it is, or inside an element spanning the columns it takes.
 *
 * @param props - The field and the columns it spans.
 * @returns The field, or the cell around it.
 */
export function Cell({ children, span }: CellProps): ReactNode {
  if (span === undefined) return children;

  const spanned: Record<string, string> = { [SPAN]: String(span) };

  return <Spanned style={spanned}>{children}</Spanned>;
}
