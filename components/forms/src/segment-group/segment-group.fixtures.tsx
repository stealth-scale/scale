/**
 * Builds the segment groups the part specifications render.
 */

import { type ReactElement } from "react";

import { fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { ItemText } from "#segment-group/item-text.tsx";
import { Item } from "#segment-group/item.tsx";
import { Root, type RootProps } from "#segment-group/root.tsx";

/**
 * Options every composed group offers, in order.
 */
export const PERIODS = ["Week", "Month", "Quarter"] as const;

/**
 * Renders a group of three options, with the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param closed - Option rendered disabled, or none.
 * @returns The group.
 */
export function composed(props: RootProps = {}, closed?: (typeof PERIODS)[number]): ReactElement {
  return (
    <Root {...props}>
      {PERIODS.map((period) => (
        <Item disabled={period === closed} key={period} value={period}>
          <ItemText>{period}</ItemText>
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
