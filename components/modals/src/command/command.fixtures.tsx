/**
 * Renders the palettes the part specifications test, and drives the field.
 */

import { type ReactElement, type ReactNode } from "react";

import { fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { ACTIONS } from "#command/actions.fixtures.ts";
import { Empty } from "#command/empty.ts";
import { Input } from "#command/input.tsx";
import { List } from "#command/list.tsx";
import { Root, type RootProps } from "#command/root.tsx";

/**
 * Renders a part inside a root with the fixture actions.
 *
 * @param children - The part under test.
 * @param props - The root's props, without the actions and the list's name.
 * @returns The root.
 */
export function palette(
  children: ReactNode,
  props: Omit<RootProps, "actions" | "aria-label"> = {},
): ReactElement {
  return (
    <Root actions={ACTIONS} aria-label="Commands" {...props}>
      {children}
    </Root>
  );
}

/**
 * Sets the field to a query and waits for the filtered list and its announcement to settle.
 *
 * @param field - The query field.
 * @param text - The query.
 */
export async function typed(field: HTMLElement, text: string): Promise<void> {
  fireEvent.change(field, { target: { value: text } });
  await settled();
}

/**
 * Presses a control and waits for the list it filters to settle.
 *
 * @param control - The control to press.
 */
export async function pressed(control: HTMLElement): Promise<void> {
  fireEvent.click(control);
  await settled();
}

/**
 * Renders a palette with a field and a list, and the empty message inside the list.
 *
 * @param props - The root's props, without the actions and the list's name.
 * @returns The palette.
 */
export function composed(props: Omit<RootProps, "actions" | "aria-label"> = {}): ReactElement {
  return (
    <Root actions={ACTIONS} aria-label="Commands" {...props}>
      <Input aria-label="Type a command" />
      <List>
        <Empty>No commands match</Empty>
      </List>
    </Root>
  );
}
