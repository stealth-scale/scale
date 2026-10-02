/**
 * Builds the radio groups the part specifications render.
 */

import { type ReactElement } from "react";

import { fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { ItemControl } from "#radio-group/item-control.tsx";
import { ItemText } from "#radio-group/item-text.tsx";
import { Item } from "#radio-group/item.tsx";
import { Label } from "#radio-group/label.tsx";
import { Root, type RootProps } from "#radio-group/root.tsx";

/**
 * Options every composed group offers, in order.
 */
export const WINDOWS = ["Same day", "Next day", "Weekly"] as const;

/**
 * Describes how a composed group differs from the default one.
 */
export interface Composition {
  /**
   * Option rendered disabled, or none.
   */
  readonly closed?: (typeof WINDOWS)[number] | undefined;

  /**
   * Whether the group renders `RadioGroup.Label`. Defaults to true.
   */
  readonly labelled?: boolean | undefined;
}

/**
 * Renders a group of three options, with the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - The option rendered disabled, and whether the label renders.
 * @returns The group.
 */
export function composed(
  props: RootProps = {},
  { closed, labelled = true }: Composition = {},
): ReactElement {
  return (
    <Root {...props}>
      {labelled ? <Label>Payout window</Label> : null}
      {WINDOWS.map((window) => (
        <Item disabled={window === closed} key={window} value={window}>
          <ItemControl />
          <ItemText>{window}</ItemText>
        </Item>
      ))}
    </Root>
  );
}

/**
 * Presses an element and waits for the machine to settle.
 *
 * @param control - The element to press.
 * @returns A promise that resolves once the machine has settled.
 */
export async function pressed(control: HTMLElement): Promise<void> {
  fireEvent.click(control);
  await settled();
}
