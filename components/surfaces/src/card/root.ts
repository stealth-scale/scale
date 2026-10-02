/**
 * Renders the panel that contains every band of a card.
 *
 * @remarks
 *   The element is an `article`, which a screen reader lists and moves between. Name it: point
 *   `aria-labelledby` at the title's `id`, or pass `aria-label`. Pass `as="div"` for a card that is
 *   part of its surroundings. The root resolves every variant, and the other parts read them from
 *   context.
 */

import { type ComponentProps, createElement, type ReactElement } from "react";

import { withProvider } from "#card/context.ts";

/**
 * Renders the root slot and provides the recipe's variants to the other parts.
 */
const Styled = withProvider("article", "root");

/**
 * Describes the props of `Root`: the recipe's variants and the props of an `article`.
 */
export type RootProps = ComponentProps<typeof Styled>;

/**
 * Renders the root, with `aria-disabled` on a disabled card.
 *
 * @remarks
 *   `aria-disabled` announces the card's content as unavailable and marks it inactive for contrast
 *   checks. An `aria-disabled` the caller passes takes precedence.
 * @param props - The recipe's variants and the props of an `article`.
 * @returns The root element.
 */
export function Root(props: RootProps): ReactElement {
  return createElement(
    Styled,
    props.disabled === true ? { "aria-disabled": true, ...props } : props,
  );
}
