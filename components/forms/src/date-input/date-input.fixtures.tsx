/**
 * Builds the date inputs the part specifications render, and drives them.
 */

import { type ReactElement, type ReactNode } from "react";

import { act, fireEvent, screen } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { ClearTrigger } from "#date-input/clear-trigger.tsx";
import { Control } from "#date-input/control.tsx";
import { Label } from "#date-input/label.tsx";
import { Root, type RootProps } from "#date-input/root.tsx";
import { Segments } from "#date-input/segments.tsx";

/**
 * Describes how a composed date input differs from the default one.
 */
export interface Composition {
  /**
   * Groups the control renders in place of one `DateInput.Segments`.
   */
  readonly groups?: ReactNode;

  /**
   * Text of `DateInput.Label`, or nothing to render no label. Defaults to `Appointment`.
   */
  readonly label?: null | string | undefined;
}

/**
 * Composition of the default date input.
 */
const PLAIN: Composition = {};

/**
 * Renders a date input labelled Appointment with one group of segments and a clear trigger, with
 * the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - The label's text and the groups of the control.
 * @returns The date input.
 */
export function dated(props: RootProps = {}, composition: Composition = PLAIN): ReactElement {
  const { label = "Appointment" } = composition;

  return (
    <Root {...props}>
      {label === null ? null : <Label>{label}</Label>}
      <Control>
        {composition.groups ?? <Segments />}
        <ClearTrigger>
          <svg aria-hidden="true" />
        </ClearTrigger>
      </Control>
    </Root>
  );
}

/**
 * Renders a range labelled Stay with a Check-in and a Check-out group.
 *
 * @param props - The props of the root.
 * @returns The date input.
 */
export function stay(props: RootProps = {}): ReactElement {
  return dated(
    { selectionMode: "range", ...props },
    {
      groups: (
        <>
          <Segments aria-label="Check-in" />
          <Segments aria-label="Check-out" index={1} />
        </>
      ),
      label: "Stay",
    },
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
 * Returns the segment of the given accessible name.
 *
 * @param name - The segment's accessible name, such as `month, Appointment`.
 * @returns The segment element.
 */
export function segment(name: string): HTMLElement {
  return screen.getByRole("spinbutton", { name });
}

/**
 * Returns a hidden input inside a render.
 *
 * @param container - The render's container.
 * @param index - Index of the group whose input it is. Defaults to 0.
 * @returns The input element.
 */
export function hiddenOf(container: HTMLElement, index = 0): HTMLInputElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every case that reads it renders the group
  return container.querySelectorAll('input[aria-hidden="true"]')[index] as HTMLInputElement;
}

/**
 * Focuses an element and waits for the machine to enter its focused state.
 *
 * @param element - The element focused.
 * @returns A promise that resolves once the machine has settled.
 */
export async function focused(element: HTMLElement): Promise<void> {
  act(() => {
    element.focus();
  });
  await settled();
}

/**
 * Types text into the focused segment one character at a time, as a keyboard does.
 *
 * @remarks
 *   Each character is a `textInput` event, from which React builds `onBeforeInput`. The machine
 *   moves focus to the next segment once a segment is full, so each character goes to the element
 *   with focus.
 * @param text - The characters typed.
 * @returns A promise that resolves once the machine has taken the last character.
 */
export async function typed(text: string): Promise<void> {
  if (text === "") return;

  const event = new Event("textInput", { bubbles: true, cancelable: true });

  Object.defineProperty(event, "data", { value: text.slice(0, 1) });
  fireEvent(document.activeElement ?? document.body, event);
  await settled();
  await framed();
  await typed(text.slice(1));
}

/**
 * Presses a key on an element and waits for the machine.
 *
 * @param element - The element with focus.
 * @param key - The key's name.
 * @returns A promise that resolves once the machine has settled.
 */
export async function keyed(element: Element, key: string): Promise<void> {
  fireEvent.keyDown(element, { key });
  await settled();
  await framed();
}
