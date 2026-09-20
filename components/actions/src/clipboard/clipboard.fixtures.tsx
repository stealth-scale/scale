/**
 * Builds the clipboard a part's specification needs above it, every part reading one machine.
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
 * The value every case copies.
 */
export const LINK = "https://stealthscale.io/payouts/4109";

/**
 * Draws whatever a case wants measured inside the root that runs the machine.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the root.
 * @returns The root, holding it.
 */
export function clipped(children: ReactNode, props: Partial<RootProps> = {}): ReactElement {
  return (
    <Root value={LINK} {...props}>
      {children}
    </Root>
  );
}

/**
 * Presses a control and waits for the machine to settle.
 *
 * @remarks
 *   A machine schedules its own update, so the state a case reads back has not changed yet unless
 *   the press is flushed. Every case that presses something goes through this.
 * @param control - The control to press.
 * @returns Nothing. The caller reads the screen.
 */
export async function pressed(control: HTMLElement): Promise<void> {
  fireEvent.click(control);
  await settled();
}

/**
 * Draws a whole clipboard, so a case can press the trigger and read what the parts do.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The parts composed the way a caller composes them.
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
