/**
 * Supplies the root every part has to be rendered inside, and a helper for driving the field.
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
 * Wraps the part under test in a root carrying the fixture actions.
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
 */
export async function typed(field: HTMLElement, text: string): Promise<void> {
  fireEvent.change(field, { target: { value: text } });
  await settled();
}

/**
 * Presses a control and waits for the list it filters to settle.
 */
export async function pressed(control: HTMLElement): Promise<void> {
  fireEvent.click(control);
  await settled();
}

/**
 * Renders every part of the palette arranged the way a caller arranges them.
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
