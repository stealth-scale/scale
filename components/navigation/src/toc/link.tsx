/**
 * Renders the link to one heading.
 *
 * @remarks
 *   The element is `a`, and the caller passes the heading's ID behind a `#` as `href`. The machine
 *   sets `aria-current="location"` while the heading is visible, the value WAI-ARIA defines for a
 *   location inside a page. When the root has a `scrollEl`, a click scrolls that element to the
 *   heading and writes the fragment to the URL, so the link works with or without a router.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toc/context.ts";
import { type TocItem, useToc } from "#toc/machine.ts";

/**
 * Anchor with the link slot classes.
 */
const Styled = withContext("a", "link");

/**
 * Describes the props of Toc.Link: the heading and the props of an anchor element.
 */
export interface LinkProps extends ComponentProps<typeof Styled> {
  /**
   * Heading the link points to: its element ID as `value` and its level as `depth`.
   */
  readonly item: TocItem;
}

/**
 * Renders an anchor that sets `aria-current` while its heading is visible.
 */
export function Link({ item, ...rest }: LinkProps): ReactElement {
  const api = useToc();

  return <Styled {...mergeProps(api.getLinkProps({ item }), rest)} />;
}
