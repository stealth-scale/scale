/**
 * Renders the band under the body, usually with the controls that confirm or cancel.
 *
 * @remarks
 *   The element is `footer`, which is a contentinfo landmark only at the top of a document, and
 *   plain content inside a `section`. It spreads its children to both ends, so a note at the start
 *   and the controls at the end need no spacer.
 */

import { type ComponentProps } from "react";

import { withContext } from "#section/context.ts";

/**
 * Renders the `footer` with the recipe's footer class.
 */
export const Footer = withContext("footer", "footer");

/**
 * Describes the props of the footer: the props of a `footer`.
 */
export type FooterProps = ComponentProps<typeof Footer>;
