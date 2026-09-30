/**
 * Fixtures for the popover specs: a closed root around a part, an open panel around a part, a
 * popover with a caller's click handler and a whole popover.
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
 * Renders a part beside the panel inside a closed root, for a part on the trigger's side.
 *
 * @param children - The part under test.
 * @returns The root with the part inside it.
 */
export function rooted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Renders a part inside the panel of an open root.
 *
 * @remarks
 *   The open machine tracks presses outside the content one frame after it opens, so the fixture
 *   renders the positioner and the content around the part.
 * @param children - The part under test.
 * @returns The root with the part inside its panel.
 */
export function opened(children: ReactNode): ReactElement {
  return (
    <Root defaultOpen>
      <Positioner>
        <Content>{children}</Content>
      </Positioner>
    </Root>
  );
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
