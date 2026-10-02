/**
 * Fixtures for the accordion specs: a root around one item, a whole accordion, and a press that
 * focuses the trigger first.
 */

import { type ReactElement, type ReactNode } from "react";

import { act } from "@testing-library/react";

import { pressed, settled } from "@stealthscale/testing-react";

import { ItemBody } from "#accordion/item-body.ts";
import { ItemContent } from "#accordion/item-content.tsx";
import { ItemHeading } from "#accordion/item-heading.ts";
import { ItemIndicator } from "#accordion/item-indicator.tsx";
import { ItemTrigger } from "#accordion/item-trigger.tsx";
import { Item } from "#accordion/item.tsx";
import { Root, type RootProps } from "#accordion/root.tsx";

/**
 * Values of the composed accordion's items, one with a space in it.
 */
export const VALUES = ["delivery", "returns policy", "abroad"] as const;

/**
 * Titles of the composed accordion's triggers, by value.
 */
const TITLES: Readonly<Record<(typeof VALUES)[number], string>> = {
  abroad: "Abroad",
  delivery: "Delivery",
  "returns policy": "Returns policy",
};

/**
 * Renders parts inside a root and one item with the value `first`.
 *
 * @param children - The parts under test.
 * @returns The root with the item around the parts.
 */
export function itemed(children: ReactNode): ReactElement {
  return (
    <Root>
      <Item value="first">{children}</Item>
    </Root>
  );
}

/**
 * Renders three items, each a heading with a trigger and an indicator above its content, with the
 * props the case sets on the root.
 *
 * @param props - The props the case sets on the root.
 * @param disabled - Value of the item to disable, if any.
 * @returns The accordion.
 */
export function composed(props: RootProps = {}, disabled?: string): ReactElement {
  return (
    <Root {...props}>
      {VALUES.map((value) => (
        <Item disabled={value === disabled} key={value} value={value}>
          <ItemHeading>
            <ItemTrigger>
              {TITLES[value]}
              <ItemIndicator>v</ItemIndicator>
            </ItemTrigger>
          </ItemHeading>
          <ItemContent>
            <ItemBody>{`About ${value}`}</ItemBody>
          </ItemContent>
        </Item>
      ))}
    </Root>
  );
}

/**
 * Focuses a trigger and presses it, the way a pointer does.
 *
 * @remarks
 *   The machine toggles an item only while a trigger has focus. A browser focuses a button on the
 *   press, and happy-dom does not.
 * @param trigger - The trigger to press.
 * @returns A promise that settles after the machine's update.
 */
export async function toggled(trigger: HTMLElement): Promise<void> {
  act(() => {
    trigger.focus();
  });
  await settled();
  await pressed(trigger);
}
