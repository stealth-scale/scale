/**
 * Renders a single link back to the page one level up.
 *
 * @remarks
 *   A folded page shows it in place of a full breadcrumb trail. Name the page it opens, such as
 *   `Invoices`, because `Back` does not say which page opens.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `a` with the recipe's trail class.
 */
export const Trail = withContext("a", "trail");

/**
 * Describes the props of the link back: the props of an `a`.
 */
export type TrailProps = ComponentProps<typeof Trail>;
