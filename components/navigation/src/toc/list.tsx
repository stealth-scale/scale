/**
 * Renders the list of heading rows.
 *
 * @remarks
 *   The element is `ul`, so a screen reader announces the number of headings. The indicator is
 *   positioned against this list, so render `Toc.Indicator` as its first child.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toc/context.ts";
import { useToc } from "#toc/machine.ts";

/**
 * Unordered list with the list slot classes.
 */
const Styled = withContext("ul", "list");

/**
 * Describes the props of Toc.List: the props of an unordered list element.
 */
export type ListProps = ComponentProps<typeof Styled>;

/**
 * Renders an unordered list with the ID the machine measures the rows against.
 */
export function List(props: ListProps): ReactElement {
  const api = useToc();

  return <Styled {...mergeProps(api.getListProps(), props)} />;
}
