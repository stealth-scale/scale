/**
 * Renders a group of body rows.
 *
 * @remarks
 *   The element is a `tbody`. The recipe's stripe and hover select this element's rows, because
 *   `:nth-of-type` counts within a parent.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Renders the `tbody` with the table's body class.
 */
export const Body = withContext("tbody", "body");

/**
 * Describes the props of a body: the props of a `tbody`.
 */
export type BodyProps = ComponentProps<typeof Body>;
