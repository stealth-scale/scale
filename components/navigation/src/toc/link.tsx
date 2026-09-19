/**
 * Draws the link to one heading.
 *
 * @remarks
 *   The element is `a`, and the address is the caller's: the heading's id behind a `#`. The
 *   machine states `aria-current="location"` while the heading is on screen, which is the value
 *   for a place within the page rather than a page within a set. Where the root names a scroll
 *   container, a press scrolls that container to the heading and writes the fragment into the
 *   address, so a link works with and without a router.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toc/context.ts";
import { type TocItem, useToc } from "#toc/machine.ts";

/**
 * Draws the link at the size the root states.
 */
const Linked = withContext("a", "link");

/**
 * Describes what a link takes.
 */
export interface LinkProps extends ComponentProps<typeof Linked> {
  /**
   * The heading the link leads to: its id in the document, and how deep it sits.
   */
  readonly item: TocItem;
}

/**
 * Leads to one heading.
 *
 * @param props - The heading it leads to, and everything a styled anchor takes.
 * @returns The link, saying whether its heading is on screen.
 */
export function Link({ item, ...rest }: LinkProps): ReactElement {
  const api = useToc();

  return <Linked {...mergeProps(api.getLinkProps({ item }), rest)} />;
}
