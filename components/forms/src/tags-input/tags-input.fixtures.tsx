/**
 * Builds the tags inputs the part specifications render, and drives them.
 */

import { type ReactElement, type ReactNode } from "react";

import { act, fireEvent, screen } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { ClearTrigger } from "#tags-input/clear-trigger.tsx";
import { Control } from "#tags-input/control.tsx";
import { Input } from "#tags-input/input.tsx";
import { ItemDeleteTrigger } from "#tags-input/item-delete-trigger.tsx";
import { ItemInput } from "#tags-input/item-input.tsx";
import { ItemPreview } from "#tags-input/item-preview.tsx";
import { ItemText } from "#tags-input/item-text.tsx";
import { Item } from "#tags-input/item.tsx";
import { Items } from "#tags-input/items.tsx";
import { Label } from "#tags-input/label.tsx";
import { Root, type RootProps } from "#tags-input/root.tsx";

/**
 * Tags a composed tags input starts with.
 */
export const ACCOUNTS = ["Bridge Ledger", "Halden & Co"];

/**
 * Describes how a composed tags input differs from the default one.
 */
export interface Composition {
  /**
   * Whether the tags input renders its clear trigger. Defaults to true.
   */
  readonly cleared?: boolean | undefined;

  /**
   * Whether the tags input renders `TagsInput.Label`. Defaults to true.
   */
  readonly labelled?: boolean | undefined;
}

/**
 * Composition of the default tags input.
 */
const PLAIN: Composition = {};

/**
 * Renders a field of accounts with every part, with the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - Whether the label and the clear trigger render.
 * @returns The tags input.
 */
export function composed(props: RootProps = {}, composition: Composition = PLAIN): ReactElement {
  const { cleared = true, labelled = true } = composition;

  return (
    <Root defaultValue={ACCOUNTS} {...props}>
      {labelled ? <Label>Accounts</Label> : null}
      <Control>
        <Items>
          {(value, index) => (
            <Item index={index} value={value}>
              <ItemPreview>
                <ItemText />
                <ItemDeleteTrigger>
                  <svg aria-hidden="true" />
                </ItemDeleteTrigger>
              </ItemPreview>
              <ItemInput />
            </Item>
          )}
        </Items>
        <Input aria-label={labelled ? undefined : "Accounts"} />
        {cleared ? (
          <ClearTrigger>
            <svg aria-hidden="true" />
          </ClearTrigger>
        ) : null}
      </Control>
    </Root>
  );
}

/**
 * Renders a field of accounts whose items the case writes.
 *
 * @param item - The render function of each item.
 * @param props - The props of the root.
 * @returns The tags input.
 */
export function around(
  item: (value: string, index: number) => ReactNode,
  props: RootProps = {},
): ReactElement {
  return (
    <Root defaultValue={ACCOUNTS} {...props}>
      <Label>Accounts</Label>
      <Control>
        <Items>{item}</Items>
        <Input />
      </Control>
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
 * Returns the input a person types into, found by its role and its name.
 *
 * @returns The `input` element.
 */
export function field(): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("textbox", { name: "Accounts" });
}

/**
 * Focuses the input and waits for the machine to enter its focused state.
 *
 * @returns A promise that resolves once the machine has settled.
 */
export async function focused(): Promise<void> {
  act(() => {
    field().focus();
  });
  await settled();
}

/**
 * Types text into the focused input and waits for the machine to read it.
 *
 * @param text - The whole text of the input after typing.
 * @returns A promise that resolves once the machine has settled.
 */
export async function typed(text: string): Promise<void> {
  fireEvent.input(field(), { target: { value: text } });
  await settled();
}

/**
 * Presses a key in the input and waits for the machine and its next frame.
 *
 * @param key - The key, as `KeyboardEvent.key` names it.
 * @returns A promise that resolves after the frame.
 */
export async function keyed(key: string): Promise<void> {
  fireEvent.keyDown(field(), { key });
  await settled();
  await framed();
}

/**
 * Returns the rendered tags, read from each preview's `data-value`, in order.
 *
 * @param container - The element the tags input rendered into.
 * @returns The tags.
 */
export function tags(container: ParentNode): readonly string[] {
  return [
    ...container.querySelectorAll<HTMLElement>(`.${slotClass("tags-input", "itemPreview")}`),
  ].map((tag) => tag.dataset["value"] ?? "");
}

/**
 * Returns the text of the polite live region, or nothing where the page has none.
 *
 * @returns The announcement.
 */
export function announced(): null | string | undefined {
  return document.querySelector('[role="status"][aria-live="polite"]')?.textContent;
}
