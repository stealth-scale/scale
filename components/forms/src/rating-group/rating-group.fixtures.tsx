/**
 * Builds the rating groups the part specifications render, and drives them.
 */

import { type ReactElement } from "react";

import { act, fireEvent, screen } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { Control } from "#rating-group/control.ts";
import { ItemIndicator } from "#rating-group/item-indicator.tsx";
import { Item } from "#rating-group/item.tsx";
import { Items } from "#rating-group/items.tsx";
import { Label } from "#rating-group/label.tsx";
import { Root, type RootProps } from "#rating-group/root.tsx";

/**
 * Describes how a composed rating group differs from the default one.
 */
export interface Composition {
  /**
   * Whether the group renders `RatingGroup.Label`. Defaults to true.
   */
  readonly labelled?: boolean | undefined;
}

/**
 * Composition of the default rating group.
 */
const PLAIN: Composition = {};

/**
 * Renders a five-star rating with its label, with the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - Whether the label renders.
 * @returns The rating group.
 */
export function composed(props: RootProps = {}, composition: Composition = PLAIN): ReactElement {
  const { labelled = true } = composition;

  return (
    <Root {...props}>
      {labelled ? <Label>Your stay</Label> : null}
      <Control>
        <Items>
          {(index) => (
            <Item index={index}>
              <ItemIndicator>★</ItemIndicator>
            </Item>
          )}
        </Items>
      </Control>
    </Root>
  );
}

/**
 * Returns the item a person reaches by its name.
 *
 * @param name - The item's accessible name.
 * @returns The element in the `radio` role.
 */
export function star(name: RegExp | string): HTMLElement {
  return screen.getByRole("radio", { name });
}

/**
 * Focuses an item and waits for the machine to enter its focused state.
 *
 * @param element - The item.
 * @returns A promise that resolves once the machine has settled.
 */
export async function focused(element: HTMLElement): Promise<void> {
  act(() => {
    element.focus();
  });
  await settled();
}

/**
 * Presses a key on an item and waits for the machine to answer.
 *
 * @param element - The item.
 * @param key - The key, as `KeyboardEvent.key` names it.
 * @returns A promise that resolves once the machine has settled.
 */
export async function keyed(element: HTMLElement, key: string): Promise<void> {
  fireEvent.keyDown(element, { key });
  await settled();
}
