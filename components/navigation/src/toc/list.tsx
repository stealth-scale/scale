/**
 * Draws the list the rows sit in.
 *
 * @remarks
 *   The element is `ul`, so a screen reader counts the headings. The indicator is placed inside
 *   it, against the rows the machine measures, so draw the indicator as the list's first child.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toc/context.ts";
import { useToc } from "#toc/machine.ts";

/**
 * Draws the list at the size the root states.
 */
const Listed = withContext("ul", "list");

/**
 * Describes what the list takes.
 */
export type ListProps = ComponentProps<typeof Listed>;

/**
 * Draws the list that holds one row per heading.
 *
 * @param props - Everything a styled list takes.
 * @returns The list, carrying the id the machine measures it by.
 */
export function List(props: ListProps): ReactElement {
  const api = useToc();

  return <Listed {...mergeProps(api.getListProps(), props)} />;
}
