/**
 * Renders the leading text of an alert.
 *
 * @remarks
 *   The default element is a `span` rather than a heading, because a live region is announced as
 *   one utterance and a heading inside it adds an entry to the document outline for content that
 *   is usually removed moments later; a persistent notice that does belong in the outline takes
 *   `as="h2"`, or whichever level the surrounding document uses. This slot is also where severity
 *   is stated in words, since an alert that conveyed it through the palette and the icon alone
 *   would fail WCAG 1.4.1.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Renders the headline of an alert, at medium weight.
 */
export const Title = withContext("span", "title");

/**
 * The props of a styled `span`.
 */
export type TitleProps = ComponentProps<typeof Title>;
