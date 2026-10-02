/**
 * Builds the toggle groups the part specifications render.
 */

import { type ReactElement } from "react";

import { fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { Item } from "#toggle-group/item.tsx";
import { Root, type RootProps } from "#toggle-group/root.tsx";

/**
 * Items every composed group offers, in order.
 */
export const MARKS = ["Bold", "Italic", "Small caps"] as const;

/**
 * Renders a group of three items, named Text style, with the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param closed - Item rendered disabled, or none.
 * @returns The group.
 */
export function composed(props: RootProps = {}, closed?: (typeof MARKS)[number]): ReactElement {
  return (
    <Root aria-label="Text style" {...props}>
      {MARKS.map((mark) => (
        <Item disabled={mark === closed} key={mark} value={mark}>
          {mark}
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
