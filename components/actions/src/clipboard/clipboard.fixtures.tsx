/**
 * Assembles the wrappers a clipboard part needs before a case can render it, all sharing one
 * machine.
 */

import { type ReactElement, type ReactNode } from "react";

import { fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { Control } from "#clipboard/control.tsx";
import { Indicator } from "#clipboard/indicator.tsx";
import { Input } from "#clipboard/input.tsx";
import { Label } from "#clipboard/label.tsx";
import { Root, type RootProps } from "#clipboard/root.tsx";
import { Trigger } from "#clipboard/trigger.tsx";

/**
 * The string every case puts on the clipboard.
 */
export const LINK = "https://stealthscale.io/payouts/4109";

/**
 * Renders a tree inside a root running the machine.
 *
 * @param children - The part under test.
 * @param props - Overrides for the root, applied over the value.
 * @returns The root, wrapping the part.
 */
export function clipped(children: ReactNode, props: Partial<RootProps> = {}): ReactElement {
  return (
    <Root value={LINK} {...props}>
      {children}
    </Root>
  );
}

/**
 * Clicks an element and waits for the machine's transition to finish.
 *
 * @remarks
 *   The machine schedules its own update, so a case that reads the DOM straight after the click
 *   still sees the state from before it. Every case that clicks goes through here.
 * @param control - The element to click.
 * @returns A promise that resolves once the update has flushed.
 */
export async function pressed(control: HTMLElement): Promise<void> {
  fireEvent.click(control);
  await settled();
}

/**
 * Renders a label, a field and a trigger under one root.
 *
 * @param props - Overrides for the root, applied over the value.
 * @returns The parts nested as a caller would nest them.
 */
export function composed(props: Partial<RootProps> = {}): ReactElement {
  return clipped(
    <>
      <Label>Link to the payout</Label>
      <Control>
        <Input />
        <Trigger>
          <Indicator copied="✓">⧉</Indicator>
        </Trigger>
      </Control>
    </>,
    props,
  );
}
