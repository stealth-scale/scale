/**
 * Builds the pin inputs the part specifications render, and drives them.
 */

import { type ReactElement } from "react";

import { act, fireEvent, screen } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { Control } from "#pin-input/control.tsx";
import { Input } from "#pin-input/input.tsx";
import { Label } from "#pin-input/label.tsx";
import { Root, type RootProps } from "#pin-input/root.tsx";

/**
 * Places of the four boxes every composed code renders.
 */
export const PLACES = [0, 1, 2, 3] as const;

/**
 * Renders a four-character code, with the props the case sets on the root, under the label `Code`
 * unless `labelled` is false.
 *
 * @param props - The props of the root.
 * @param labelled - Whether the code renders `PinInput.Label`.
 * @returns The pin input.
 */
export function composed(props: RootProps = {}, labelled = true): ReactElement {
  return (
    <Root count={4} {...props}>
      {labelled ? <Label>Code</Label> : null}
      <Control>
        {PLACES.map((index) => (
          <Input index={index} key={index} />
        ))}
      </Control>
    </Root>
  );
}

/**
 * Returns the box at one place, found by its default name.
 *
 * @param place - Place of the box in the code, from 0.
 * @returns The `input` element.
 */
export function box(place: number): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("textbox", { name: `Character ${place + 1} of 4` });
}

/**
 * Returns the four boxes in order.
 *
 * @returns The `input` elements, first to last.
 */
export function boxes(): readonly HTMLInputElement[] {
  return PLACES.map((place) => box(place));
}

/**
 * Waits one animation frame inside `act`, for the machine's deferred work.
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
 * Focuses a box and waits for the machine to settle.
 *
 * @param target - The box to focus.
 * @returns A promise that resolves once the machine has settled.
 */
export async function focused(target: HTMLElement): Promise<void> {
  act(() => {
    target.focus();
  });
  await settled();
}

/**
 * Types one character into the focused box and waits for the machine to move on.
 *
 * @param target - The focused box.
 * @param character - The character to type.
 * @returns A promise that resolves once the machine has settled.
 */
export async function typed(target: HTMLElement, character: string): Promise<void> {
  fireEvent.input(target, { target: { value: character } });
  await settled();
}
