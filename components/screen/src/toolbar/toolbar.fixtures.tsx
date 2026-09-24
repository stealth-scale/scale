/**
 * Renders the toolbars the part specifications test.
 */

import { type ReactElement, type ReactNode } from "react";

import { Center } from "#toolbar/center.ts";
import { End } from "#toolbar/end.ts";
import { Item } from "#toolbar/item.tsx";
import { Root, type RootProps } from "#toolbar/root.tsx";
import { Search } from "#toolbar/search.tsx";
import { Start } from "#toolbar/start.ts";

/**
 * Describes the props a case sets: the root's props without the name the fixture sets.
 */
export type Settings = Omit<RootProps, "aria-label">;

/**
 * Renders a part inside a toolbar root.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The toolbar.
 */
export function ranged(children: ReactNode, props: Settings = {}): ReactElement {
  return (
    <Root aria-label="Invoice" {...props}>
      {children}
    </Root>
  );
}

/**
 * Renders a toolbar with a control and a search, open or closed.
 *
 * @remarks
 *   The control remains in the document in both states, so a case can read where focus moves when
 *   the search opens and closes.
 * @param opened - Whether the search covers the row.
 * @param props - The root's props.
 * @returns The toolbar.
 */
export function searched(opened: boolean, props: Settings = {}): ReactElement {
  return (
    <Root aria-label="Invoice" {...props}>
      <Item>Open the search</Item>
      <Search opened={opened}>
        <input aria-label="Search invoices" type="search" />
      </Search>
    </Root>
  );
}

/**
 * Renders a toolbar with a start, a centre and an end band.
 *
 * @param props - The root's props.
 * @returns The toolbar.
 */
export function composed(props: Settings = {}): ReactElement {
  return (
    <Root aria-label="Invoice" {...props}>
      <Start>
        <Item>Filter</Item>
      </Start>
      <Center>April</Center>
      <End>
        <Item>Download</Item>
      </End>
    </Root>
  );
}
