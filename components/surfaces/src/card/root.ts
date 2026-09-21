/**
 * Renders the panel every band of a card sits in.
 *
 * @remarks
 *   The element is an `article`, which a screen reader announces and can jump between, so a page of
 *   cards reads as a set of units instead of one run of text. A card that belongs to its
 *   surroundings rather than standing on its own takes `as="div"`. An article has no accessible
 *   name of its own: point `aria-labelledby` at the title's id, or pass `aria-label`. Without one
 *   it is announced as `article` and nothing else. Every variant is set here and read by the bands
 *   below.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#card/context.ts";

/**
 * Renders the root slot and publishes the recipe's variants to the bands below it.
 */
export const Root = withProvider("article", "root");

/**
 * Combines the recipe's variants with every prop an `article` element accepts.
 */
export type RootProps = ComponentProps<typeof Root>;
