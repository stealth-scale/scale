/**
 * Renders the message shown while the scope of a search keeps no row, and announces it.
 *
 * @remarks
 *   Put the message in the scope the search filters: in the content for the header's search, in a
 *   block for the block's search. It renders while its scope keeps no row, so a caller that filters
 *   its own list and renders the message in place of the list gets it too. A screen reader hears it
 *   through a polite live region when a query empties the scope. Name what was searched:
 *   `No projects match` tells the reader that the search ran and found nothing, and `No results`
 *   does not. A rail removes it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { useAnnounce, useFilterActive, useFilterEmpty } from "@stealthscale/hooks";

import { withContext } from "#sidebar/context.ts";

/**
 * Renders the message `p` at the sidebar's size.
 */
const Noted = withContext("p", "empty");

/**
 * Describes the props of `Empty`.
 */
export type EmptyProps = ComponentProps<typeof Noted>;

/**
 * Renders the message while the scope keeps no row, and announces it while a query is active.
 *
 * @param props - The `p` element's props.
 * @returns The `p` element, or nothing while the scope keeps a row.
 */
export function Empty(props: EmptyProps): null | ReactElement {
  const empty = useFilterEmpty();
  const searching = useFilterActive();
  const announce = useAnnounce();

  if (!empty) return null;

  return (
    <Noted
      {...props}
      ref={(node: HTMLParagraphElement | null) => {
        if (node !== null && searching) announce(node.innerText);
      }}
    />
  );
}
