/**
 * Renders the bar of items: a list of triggers and links, and the indicator that runs along it.
 *
 * @remarks
 *   The element is a `ul`, so a screen reader announces how many items the bar has. The machine
 *   measures an open trigger against the list, which it positions.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#navigation-menu/context.ts";
import { useNavigationMenu } from "#navigation-menu/machine.ts";

/**
 * Renders the `ul` with the navigation menu's list class.
 */
const Listed = withContext("ul", "list");

/**
 * Describes the props of the list: the props of a `ul`.
 */
export type ListProps = ComponentProps<typeof Listed>;

/**
 * Renders the list with the machine's list props merged under the caller's.
 *
 * @param props - The items and the props of a `ul`.
 * @returns The `ul` element.
 */
export function List(props: ListProps): ReactElement {
  return <Listed {...mergeProps(useNavigationMenu().getListProps(), props)} />;
}
