/**
 * Renders clipboard parts inside a root for the specs, all sharing one machine.
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
 * Value every case copies.
 */
export const LINK = "https://stealthscale.io/payouts/4109";

/**
 * Renders a tree inside a root that runs the machine.
 *
 * @param children - Part under test.
 * @param props - Root props, applied over the value.
 * @returns The root with the part inside.
 */
export function clipped(children: ReactNode, props: Partial<RootProps> = {}): ReactElement {
  return (
    <Root value={LINK} {...props}>
      {children}
    </Root>
  );
}

/**
 * Clicks an element and waits for the machine's transition.
 *
 * @remarks
 *   The machine schedules its update after the click, so a DOM read directly after the click
 *   returns the previous state. Every case that clicks uses this helper.
 * @param control - Element to click.
 * @returns A promise that resolves after the update flushes.
 */
export async function pressed(control: HTMLElement): Promise<void> {
  fireEvent.click(control);
  await settled();
}

/**
 * Renders a label, a field and a trigger under one root.
 *
 * @param props - Root props, applied over the value.
 * @returns The root with the three parts.
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
