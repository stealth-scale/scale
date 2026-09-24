/**
 * Fixtures for the popover specs: a root around one part, a popover with a caller's click handler
 * and a whole popover.
 */

import { type ReactElement, type ReactNode } from "react";

import {
  Arrow,
  ArrowTip,
  CloseTrigger,
  Content,
  Description,
  Indicator,
  Positioner,
  Root,
  type RootProps,
  Title,
  Trigger,
} from "#popover/index.ts";

/**
 * Renders a part inside a root that runs the machine.
 *
 * @param children - The part under test.
 * @returns The root with the part inside it.
 */
export function opened(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Renders a popover whose trigger calls a caller's click handler, with the props the case sets on
 * the root.
 *
 * @param onClick - Called on each press of the trigger.
 * @param props - The props the case sets on the root.
 * @returns The popover.
 */
export function handled(onClick: () => void, props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger onClick={onClick}>Filters</Trigger>
      <Positioner>
        <Content>
          <Title>Filter the list</Title>
        </Content>
      </Positioner>
    </Root>
  );
}

/**
 * Renders a trigger with an indicator and a panel with an arrow, a title, a description and a close
 * trigger, with the props the case sets on the root.
 *
 * @param props - The props the case sets on the root.
 * @returns The popover.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger>
        Filters
        <Indicator>v</Indicator>
      </Trigger>
      <Positioner>
        <Content>
          <Arrow>
            <ArrowTip />
          </Arrow>
          <Title>Filter the list</Title>
          <Description>Only the rows matching all of these are shown.</Description>
          <CloseTrigger>x</CloseTrigger>
        </Content>
      </Positioner>
    </Root>
  );
}
