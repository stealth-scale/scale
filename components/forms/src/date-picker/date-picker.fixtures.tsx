/**
 * Builds the date pickers the part specifications render, and drives them.
 */

import { type ReactElement, type ReactNode } from "react";

import { parseDate } from "@internationalized/date";
import { act, fireEvent, screen } from "@testing-library/react";

import { pressed, settled } from "@stealthscale/testing-react";

import { ClearTrigger } from "#date-picker/clear-trigger.tsx";
import { Content } from "#date-picker/content.tsx";
import { Control } from "#date-picker/control.tsx";
import { DayTable } from "#date-picker/day-table.tsx";
import { Header } from "#date-picker/header.tsx";
import { Input } from "#date-picker/input.tsx";
import { Label } from "#date-picker/label.tsx";
import { MonthTable } from "#date-picker/month-table.tsx";
import { Positioner } from "#date-picker/positioner.tsx";
import { Root, type RootProps } from "#date-picker/root.tsx";
import { Trigger } from "#date-picker/trigger.tsx";
import { View } from "#date-picker/view.tsx";
import { YearTable } from "#date-picker/year-table.tsx";

/**
 * Date the fixtures show: Wednesday, October 14, 2026.
 */
export const OCTOBER_14 = parseDate("2026-10-14");

/**
 * Describes how a composed date picker differs from the default one.
 */
export interface Composition {
  /**
   * Accessible name the panel takes in place of `Choose date`.
   */
  readonly content?: string | undefined;

  /**
   * Parts the control renders in place of an input, a clear trigger and a trigger.
   */
  readonly control?: ReactNode;

  /**
   * Text of `DatePicker.Label`, or nothing to render no label. Defaults to `Appointment`.
   */
  readonly label?: null | string | undefined;

  /**
   * Parts the panel renders in place of the day, month and year views.
   */
  readonly panel?: ReactNode;
}

/**
 * Composition of the default date picker.
 */
const PLAIN: Composition = {};

/**
 * Renders the day view with its header and its table.
 *
 * @returns The view.
 */
export function dayView(): ReactElement {
  return (
    <View view="day">
      <Header nextIcon={<svg aria-hidden="true" />} previousIcon={<svg aria-hidden="true" />} />
      <DayTable />
    </View>
  );
}

/**
 * Renders the day, month and year views, each with its header and its table.
 *
 * @returns The views.
 */
export function views(): ReactElement {
  return (
    <>
      {dayView()}
      <View view="month">
        <Header nextIcon={<svg aria-hidden="true" />} previousIcon={<svg aria-hidden="true" />} />
        <MonthTable />
      </View>
      <View view="year">
        <Header nextIcon={<svg aria-hidden="true" />} previousIcon={<svg aria-hidden="true" />} />
        <YearTable />
      </View>
    </>
  );
}

/**
 * Renders a floating date picker labelled Appointment on October 14, 2026, with the props the case
 * sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - The label, the control's parts and the panel's parts.
 * @returns The date picker.
 */
export function picked(props: RootProps = {}, composition: Composition = PLAIN): ReactElement {
  const { label = "Appointment" } = composition;

  return (
    <Root defaultFocusedValue={OCTOBER_14} {...props}>
      {label === null ? null : <Label>{label}</Label>}
      <Control>
        {composition.control ?? (
          <>
            <Input />
            <ClearTrigger>
              <svg aria-hidden="true" />
            </ClearTrigger>
            <Trigger>
              <svg aria-hidden="true" />
            </Trigger>
          </>
        )}
      </Control>
      <Positioner>
        <Content label={composition.content}>{composition.panel ?? views()}</Content>
      </Positioner>
    </Root>
  );
}

/**
 * Renders an inline date picker labelled Holiday around October 14, 2026.
 *
 * @param props - The props of the root.
 * @param panel - Parts the panel renders in place of the three views.
 * @param label - Text of `DatePicker.Label`, or nothing to render no label. Defaults to `Holiday`.
 * @returns The date picker.
 */
export function inlined(
  props: RootProps = {},
  panel: ReactNode = views(),
  label: null | string = "Holiday",
): ReactElement {
  return (
    <Root defaultFocusedValue={OCTOBER_14} inline {...props}>
      {label === null ? null : <Label>{label}</Label>}
      <Content>{panel}</Content>
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
 * Returns the trigger, found by its class.
 *
 * @returns The trigger element.
 */
export function trigger(): HTMLButtonElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every case that reads it renders one
  return document.querySelector(".date-picker__trigger") as HTMLButtonElement;
}

/**
 * Presses the trigger and waits for the machine to open the panel and focus a day.
 *
 * @returns A promise that resolves once the panel is open.
 */
export async function opened(): Promise<void> {
  await pressed(trigger());
  await settled();
  await framed();
}

/**
 * Returns the trigger of the day of the given name.
 *
 * @param name - The day's name, such as `Wednesday, October 14, 2026`.
 * @returns The element in the `button` role.
 */
export function day(name: string): HTMLElement {
  return screen.getByRole("button", { name });
}

/**
 * Returns a hidden input inside a render.
 *
 * @param container - The render's container.
 * @param index - Index of the date whose input it is. Defaults to 0.
 * @returns The input element.
 */
export function hiddenOf(container: HTMLElement, index = 0): HTMLInputElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every case that reads it renders the date
  return container.querySelectorAll('input[aria-hidden="true"]')[index] as HTMLInputElement;
}

/**
 * Presses a key on an element and waits for the machine.
 *
 * @param element - The element with focus.
 * @param key - The key's name.
 * @param shiftKey - Whether Shift is held.
 * @returns A promise that resolves once the machine has settled.
 */
export async function keyed(element: Element, key: string, shiftKey = false): Promise<void> {
  fireEvent.keyDown(element, { key, shiftKey });
  await settled();
  await framed();
}

/**
 * Types text into an input as a browser does, then presses Enter, which the machine parses.
 *
 * @param input - The input.
 * @param text - The text.
 * @returns A promise that resolves once the machine has settled.
 */
export async function entered(input: HTMLInputElement, text: string): Promise<void> {
  act(() => {
    input.focus();
  });
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, text);
  fireEvent(input, new InputEvent("input", { bubbles: true, inputType: "insertText" }));
  await settled();
  await keyed(input, "Enter");
}
