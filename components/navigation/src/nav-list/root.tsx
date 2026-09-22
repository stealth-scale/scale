/**
 * Draws the list the rows sit in and moves focus between them on the arrow keys.
 *
 * @remarks
 *   The element is `ul`, so a screen reader counts the destinations and says how many there are.
 *   The list carries no landmark of its own. A page holds more than one of these, and the landmark
 *   belongs to whatever names the set: a sidebar's `nav`, a page's own, or a caller's `as="nav"`.
 *   The arrows the list answers are the ones it is read along. A column answers the down and up
 *   arrows and a dock answers the ones along the line, which is what `variant` already states, so
 *   nothing new has to be said at the call site. A caller's own key handler runs first and keeps
 *   the key where it has taken it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withProvider } from "#nav-list/context.ts";
import { useRowKeys } from "#nav-list/keys.ts";

/**
 * Draws the list and sets the variants every part below it reads.
 */
const Listed = withProvider("ul", "root");

/**
 * The variant whose rows run along the line rather than down the page.
 */
const DOCK = "dock";

/**
 * Describes what the list takes.
 */
export type RootProps = ComponentProps<typeof Listed>;

/**
 * Gathers the rows and answers the keys that cross them.
 *
 * @param props - The recipe's variants and the element's props together.
 * @returns The list, holding them.
 */
export function Root(props: RootProps): ReactElement {
  const onKeyDown = useRowKeys(props.variant === DOCK);

  return <Listed {...mergeProps({ onKeyDown }, props)} />;
}
