/**
 * Renders the group of footer rows, such as a total.
 *
 * @remarks
 *   The element is a `tfoot`, which a screen reader announces as the table's footer.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Renders the `tfoot` with the table's footer class.
 */
export const Footer = withContext("tfoot", "footer");

/**
 * Describes the props of the footer: the props of a `tfoot`.
 */
export type FooterProps = ComponentProps<typeof Footer>;
