/**
 * Builds the comboboxes the part specifications render, and drives them.
 */

import { type ReactElement, type ReactNode } from "react";

import { act, fireEvent, screen } from "@testing-library/react";
import { ListCollection } from "@zag-js/collection";

import { pressed, settled } from "@stealthscale/testing-react";

import { ClearTrigger } from "#combobox/clear-trigger.tsx";
import { Content, type ContentProps } from "#combobox/content.tsx";
import { Control } from "#combobox/control.tsx";
import { Empty } from "#combobox/empty.tsx";
import { Input } from "#combobox/input.tsx";
import { ItemIndicator } from "#combobox/item-indicator.tsx";
import { ItemText } from "#combobox/item-text.tsx";
import { Item } from "#combobox/item.tsx";
import { Label } from "#combobox/label.tsx";
import { Positioner } from "#combobox/positioner.tsx";
import { Root, type RootProps } from "#combobox/root.tsx";
import { Trigger } from "#combobox/trigger.tsx";

/**
 * Describes one account a combobox offers.
 */
export interface Account {
  /**
   * Whether the account is frozen, which disables its row.
   */
  readonly frozen?: boolean | undefined;

  /**
   * Value the account is chosen by.
   */
  readonly id: string;

  /**
   * Words the account is shown and announced by.
   */
  readonly name: string;
}

/**
 * Every account the default collection offers, the last one frozen.
 */
const ACCOUNTS: readonly Account[] = [
  { id: "bridge", name: "Bridge Ledger" },
  { id: "halden", name: "Halden & Co" },
  { id: "perrin partners", name: "Perrin Freight" },
  { frozen: true, id: "voss", name: "Voss Holdings" },
];

/**
 * Returns a collection of accounts: the four accounts, or the ones given.
 *
 * @param items - The accounts the collection offers.
 * @returns The collection.
 */
export function accounts(items: readonly Account[] = ACCOUNTS): ListCollection<Account> {
  return new ListCollection<Account>({
    isItemDisabled: (account) => account.frozen === true,
    items: [...items],
    itemToString: (account) => account.name,
    itemToValue: (account) => account.id,
  });
}

/**
 * Describes how a composed combobox differs from the default one.
 */
export interface Composition {
  /**
   * Whether the combobox renders its clear trigger. Defaults to true.
   */
  readonly cleared?: boolean | undefined;

  /**
   * Words of the empty message, which renders while the collection is empty.
   */
  readonly empty?: string | undefined;

  /**
   * Whether the combobox renders `Combobox.Label`. Defaults to true.
   */
  readonly labelled?: boolean | undefined;

  /**
   * `aria-label` of the input, or nothing.
   */
  readonly named?: string | undefined;

  /**
   * Props of the panel, such as the element it renders in place of its `div`.
   */
  readonly panel?: ContentProps | undefined;

  /**
   * Rows the panel renders in place of one row per account.
   */
  readonly rows?: ReactNode;
}

/**
 * Composition of the default combobox.
 */
const PLAIN: Composition = {};

/**
 * Returns one row per item of a collection, each with its text and its check.
 *
 * @param items - The items to render.
 * @returns The rows.
 */
export function rowsOf(items: readonly Account[]): ReactElement[] {
  return items.map((account) => (
    <Item item={account} key={account.id}>
      <ItemText item={account}>{account.name}</ItemText>
      <ItemIndicator item={account}>
        <svg aria-hidden="true" />
      </ItemIndicator>
    </Item>
  ));
}

/**
 * Renders a combobox of four accounts, with the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - Whether the label and the clear trigger render, the input's `aria-label`,
 *   the empty message, the panel's props, and the rows.
 * @returns The combobox.
 */
export function picked(
  props: Partial<RootProps> = {},
  composition: Composition = PLAIN,
): ReactElement {
  const { cleared = true, empty, labelled = true, named, panel, rows } = composition;
  const collection = props.collection ?? accounts();

  return (
    <Root collection={collection} {...props}>
      {labelled ? <Label>Account</Label> : null}
      <Control>
        <Input aria-label={named} placeholder="Search accounts" />
        {cleared ? (
          <ClearTrigger>
            <svg aria-hidden="true" />
          </ClearTrigger>
        ) : null}
        <Trigger>
          <svg aria-hidden="true" />
        </Trigger>
      </Control>
      <Positioner>
        <Content {...panel}>
          {empty === undefined ? null : <Empty>{empty}</Empty>}
          {rows ?? rowsOf(collection.items)}
        </Content>
      </Positioner>
    </Root>
  );
}

/**
 * Waits one animation frame inside `act`, for the machine's deferred focus and highlight.
 *
 * @returns A promise that resolves after the frame.
 */
export async function framed(): Promise<void> {
  await act(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      }),
  );
}

/**
 * Returns the input, found by its role.
 *
 * @returns The input element.
 */
export function input(): HTMLInputElement {
  return screen.getByRole("combobox");
}

/**
 * Presses the trigger and waits for the machine to open the panel.
 *
 * @returns A promise that resolves once the panel is open.
 */
export async function opened(): Promise<void> {
  await pressed(screen.getByRole("button", { name: "Toggle suggestions" }));
  await settled();
  await framed();
}

/**
 * Focuses the input and types a text into it, as a person replacing its text does.
 *
 * @param text - The text the input takes.
 * @returns A promise that resolves once the machine has settled.
 */
export async function typed(text: string): Promise<void> {
  act(() => {
    input().focus();
  });
  await settled();
  fireEvent.change(input(), { target: { value: text } });
  await settled();
  await framed();
}

/**
 * Presses a key on the input and waits for the machine.
 *
 * @param key - The key's name.
 * @returns A promise that resolves once the machine has settled.
 */
export async function keyed(key: string): Promise<void> {
  fireEvent.keyDown(input(), { key });
  await settled();
  await framed();
}

/**
 * Moves focus off the input, as Tab to the next control does.
 *
 * @returns A promise that resolves once the machine has settled.
 */
export async function left(): Promise<void> {
  act(() => {
    input().blur();
  });
  await settled();
  await framed();
}

/**
 * Returns the hidden select inside a render.
 *
 * @param container - The render's container.
 * @returns The select element.
 */
export function hiddenOf(container: HTMLElement): HTMLSelectElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every case that reads it renders one
  return container.querySelector("select") as HTMLSelectElement;
}
