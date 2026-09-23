/**
 * Renders the headline of the alert.
 *
 * @remarks
 *   The default element is a `span`, because a live region is announced as one utterance and a
 *   heading in it adds an outline entry for content that usually disappears. A persistent notice
 *   that belongs in the outline passes `as="h2"` or the level the document uses. The title states
 *   the severity in words, because WCAG 1.4.1 rejects a status told by color alone.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Renders a span at medium weight.
 */
export const Title = withContext("span", "title");

/**
 * Describes the props of Alert.Title: the props of a span element.
 */
export type TitleProps = ComponentProps<typeof Title>;
