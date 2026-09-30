/**
 * Renders the button of one page.
 *
 * @remarks
 *   The element is the library's square `Button` with the page's number, or its `a` for links,
 *   named "Page N" unless the caller passes another `label`, so the name contains the number the
 *   button shows. The current page takes `aria-current="page"`, which the button's looks mark as
 *   on. A link's address is the one `getPageUrl` returns, and a press on a link follows it without
 *   changing the page.
 */

import { type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { type ButtonProps } from "@stealthscale/component-actions";

import { PageButton, PageLink } from "#pagination/bound.ts";
import { linked } from "#pagination/linked.ts";
import { usePagination } from "#pagination/machine.ts";

/**
 * Describes the props of a page: its number, its accessible name and the props of a `Button`.
 */
export interface ItemProps extends Omit<ButtonProps, "value"> {
  /**
   * Accessible name of the page, "Page N" unless the caller passes another.
   */
  readonly label?: string | undefined;

  /**
   * Number of the page, from one.
   */
  readonly value: number;
}

/**
 * Renders a page with the machine's item props merged over the caller's.
 *
 * @param props - The page's number and name and the props of a `Button`.
 * @returns The `button` element, or an `a` for links.
 */
export function Item({ children, label, value, ...rest }: ItemProps): ReactElement {
  const { api, type } = usePagination();
  const Paged = type === "link" ? PageLink : PageButton;
  const item: ButtonProps = api.getItemProps({ type: "page", value });

  return (
    <Paged
      {...mergeProps(type === "link" ? linked(item) : item, rest)}
      aria-label={label ?? `Page ${value}`}
      shape="square"
    >
      {children ?? value}
    </Paged>
  );
}
