/**
 * Builds the selects the part specifications render, and drives them.
 */

import { type ReactElement, type ReactNode } from "react";

import { act, screen } from "@testing-library/react";
import { ListCollection } from "@zag-js/collection";

import { pressed, settled } from "@stealthscale/testing-react";

import { ClearTrigger } from "#select/clear-trigger.tsx";
import { Content, type ContentProps } from "#select/content.tsx";
import { Control } from "#select/control.tsx";
import { Indicator } from "#select/indicator.tsx";
import { ItemIndicator } from "#select/item-indicator.tsx";
import { ItemText } from "#select/item-text.tsx";
import { Item } from "#select/item.tsx";
import { Label } from "#select/label.tsx";
import { Positioner } from "#select/positioner.tsx";
import { Root, type RootProps } from "#select/root.tsx";
import { Trigger } from "#select/trigger.tsx";
import { ValueText } from "#select/value-text.tsx";

/**
 * Describes one account a select offers.
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
 * Returns a collection of four accounts, the last one frozen.
 *
 * @returns The collection.
 */
export function accounts(): ListCollection<Account> {
  return new ListCollection<Account>({
    isItemDisabled: (account) => account.frozen === true,
    items: [
      { id: "bridge", name: "Bridge Ledger" },
      { id: "halden", name: "Halden & Co" },
      { id: "perrin partners", name: "Perrin Freight" },
      { frozen: true, id: "voss", name: "Voss Holdings" },
    ],
    itemToString: (account) => account.name,
    itemToValue: (account) => account.id,
  });
}

/**
 * Describes how a composed select differs from the default one.
 */
export interface Composition {
  /**
   * Whether the select renders its clear trigger. Defaults to true.
   */
  readonly cleared?: boolean | undefined;

  /**
   * Whether the select renders `Select.Label`. Defaults to true.
   */
  readonly labelled?: boolean | undefined;

  /**
   * `aria-label` of the trigger, or nothing.
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
 * Composition of the default select.
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
 * Renders a select of four accounts, with the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - Whether the label and the clear trigger render, the trigger's
 *   `aria-label`, the panel's props, and the rows.
 * @returns The select.
 */
export function picked(
  props: Partial<RootProps> = {},
  composition: Composition = PLAIN,
): ReactElement {
  const { cleared = true, labelled = true, named, panel, rows } = composition;
  const collection = props.collection ?? accounts();

  return (
    <Root collection={collection} {...props}>
      {labelled ? <Label>Account</Label> : null}
      <Control>
        <Trigger aria-label={named}>
          <ValueText placeholder="Pick an account" />
        </Trigger>
        {cleared ? (
          <ClearTrigger>
            <svg aria-hidden="true" />
          </ClearTrigger>
        ) : null}
        <Indicator>
          <svg aria-hidden="true" />
        </Indicator>
      </Control>
      <Positioner>
        <Content {...panel}>{rows ?? rowsOf(collection.items)}</Content>
      </Positioner>
    </Root>
  );
}

/**
 * Waits one animation frame inside `act`, for the machine's deferred focus.
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
 * Returns the trigger, found by its role.
 *
 * @returns The trigger element.
 */
export function trigger(): HTMLElement {
  return screen.getByRole("combobox");
}

/**
 * Presses the trigger and waits for the machine to open the panel and move focus into it.
 *
 * @returns A promise that resolves once the panel has focus.
 */
export async function opened(): Promise<void> {
  await pressed(trigger());
  await settled();
  await framed();
}
