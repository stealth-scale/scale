/**
 * Renders the list of tabs.
 *
 * @remarks
 *   The machine sets `role="tablist"` and `aria-orientation`, so a screen reader announces the
 *   tabs as one set and the arrow keys along the orientation move between them.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tabs/context.ts";
import { useTabs } from "#tabs/machine.ts";

/**
 * Renders the `div` with the tabs' list class.
 */
const Strip = withContext("div", "list");

/**
 * Describes the props of the list: the props of a `div`.
 */
export type ListProps = ComponentProps<typeof Strip>;

/**
 * Renders the list with the machine's list props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function List(props: ListProps): ReactElement {
  const api = useTabs();

  return <Strip {...mergeProps(api.getListProps(), props)} />;
}
