/**
 * Fixtures for the collapsible specs: a root around one part, a settled press and a whole
 * collapsible.
 */

import { type ReactElement, type ReactNode } from "react";

import { fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { Content } from "#collapsible/content.tsx";
import { Indicator } from "#collapsible/indicator.tsx";
import { Root, type RootProps } from "#collapsible/root.tsx";
import { Trigger } from "#collapsible/trigger.tsx";

/**
 * Renders a part inside a root that runs the machine.
 *
 * @param children - The part under test.
 * @returns The root with the part inside it.
 */
export function disclosed(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Clicks a control and waits for the machine's update.
 *
 * @remarks
 *   The machine schedules its update, so a case reads the new state only after the press is
 *   flushed.
 * @param control - The control to click.
 * @returns A promise that settles after the update.
 */
export async function pressed(control: HTMLElement): Promise<void> {
  fireEvent.click(control);
  await settled();
}

/**
 * Renders a trigger with an indicator and its content, with the props the case sets on the root.
 *
 * @param props - The props the case sets on the root.
 * @returns The collapsible.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger>
        Details
        <Indicator>v</Indicator>
      </Trigger>
      <Content>The block</Content>
    </Root>
  );
}
