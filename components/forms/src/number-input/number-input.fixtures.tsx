/**
 * Builds the number inputs the part specifications render.
 */

import { type ReactElement } from "react";

import { act } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { DecrementTrigger } from "#number-input/decrement-trigger.tsx";
import { IncrementTrigger } from "#number-input/increment-trigger.tsx";
import { Input, type InputProps } from "#number-input/input.tsx";
import { Root, type RootProps } from "#number-input/root.tsx";
import { Scrubber } from "#number-input/scrubber.tsx";

/**
 * Props of the input when the case sets none: the name `Seats`.
 */
const NAMED: InputProps = { "aria-label": "Seats" };

/**
 * Renders a count of seats from 1 to 50, starting at 4, with the props the case sets on the root
 * and on the input.
 *
 * @param props - The props of the root.
 * @param input - The props of the input. Defaults to the name `Seats`.
 * @returns The number input.
 */
export function composed(props: RootProps = {}, input: InputProps = NAMED): ReactElement {
  return (
    <Root defaultValue="4" max={50} min={1} {...props}>
      <DecrementTrigger />
      <Input {...input} />
      <IncrementTrigger />
    </Root>
  );
}

/**
 * Renders a line height from 1 to 3 with a scrubber before the input, with the props the case sets
 * on the root.
 *
 * @param props - The props of the root.
 * @returns The number input.
 */
export function scrubbed(props: RootProps = {}): ReactElement {
  return (
    <Root defaultValue="1.5" max={3} min={1} step={0.5} {...props}>
      <Scrubber>↔</Scrubber>
      <Input aria-label="Line height" />
    </Root>
  );
}

/**
 * Focuses an element and waits for the machine to settle.
 *
 * @param element - The element to focus.
 * @returns A promise that resolves once the machine has settled.
 */
export async function focused(element: HTMLElement): Promise<void> {
  act(() => {
    element.focus();
  });
  await settled();
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
