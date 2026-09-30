/**
 * Builds the checkboxes the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { Control } from "#checkbox/control.tsx";
import { Group, type GroupProps } from "#checkbox/group.tsx";
import { Indicator } from "#checkbox/indicator.tsx";
import { Label } from "#checkbox/label.tsx";
import { Root, type RootProps } from "#checkbox/root.tsx";
import { Legend } from "#fieldset/legend.tsx";
import { Root as FieldsetRoot, type RootProps as FieldsetRootProps } from "#fieldset/root.tsx";

/**
 * Values of the boxes in the group the specifications render.
 */
export const CHANNELS: readonly string[] = ["email", "sms", "push"];

/**
 * Renders the children inside a root, with the props the case sets on the root.
 *
 * @param children - The part under test.
 * @param props - The props of the root.
 * @returns The root with the children inside it.
 */
export function boxed(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Presses an element and waits for the machine to settle.
 *
 * @remarks
 *   The machine schedules its own update, so a case reads the new state only after the press is
 *   flushed.
 * @param control - The element to press.
 * @returns A promise that resolves once the machine has settled.
 */
export async function pressed(control: HTMLElement): Promise<void> {
  fireEvent.click(control);
  await settled();
}

/**
 * Renders a checkbox with every part: a box with both marks and a label.
 *
 * @param props - The props of the root.
 * @returns The checkbox.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Control>
        <Indicator>t</Indicator>
        <Indicator indeterminate>-</Indicator>
      </Control>
      <Label>Accept the terms</Label>
    </Root>
  );
}

/**
 * Renders a group of three channels under a parent box, inside a fieldset its legend names.
 *
 * @param props - The props of the group. `allValues` defaults to the three channels.
 * @param fieldset - The props of the fieldset around the group.
 * @returns The fieldset with the group inside it.
 */
export function listed(props: GroupProps = {}, fieldset: FieldsetRootProps = {}): ReactElement {
  return (
    <FieldsetRoot {...fieldset}>
      <Legend>Notify me by</Legend>
      <Group allValues={CHANNELS} {...props}>
        <Root parent>
          <Control />
          <Label>All channels</Label>
        </Root>
        {CHANNELS.map((channel) => (
          <Root key={channel} value={channel}>
            <Control />
            <Label>{channel}</Label>
          </Root>
        ))}
      </Group>
    </FieldsetRoot>
  );
}
