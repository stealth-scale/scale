/**
 * Renders the toolbars the part specifications test.
 */

import { type ReactElement, type ReactNode } from "react";

import { Action } from "#toolbar/action.tsx";
import { Center } from "#toolbar/center.ts";
import { End } from "#toolbar/end.ts";
import { Item } from "#toolbar/item.tsx";
import { Root, type RootProps } from "#toolbar/root.tsx";
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
 * Renders a toolbar with a primary, a secondary and a tertiary action.
 *
 * @param props - The root's props.
 * @returns The toolbar.
 */
export function folding(props: Settings = {}): ReactElement {
  return (
    <Root aria-label="Invoice" {...props}>
      <Start>
        <Action primary>Filter</Action>
        <Action icon={<svg aria-hidden="true" />}>Export</Action>
        <Action>Columns</Action>
      </Start>
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
