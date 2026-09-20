/**
 * Builds the switcher a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Menu } from "@stealthscale/component-disclosure";

import { Detail } from "#switcher/detail.ts";
import { Label } from "#switcher/label.ts";
import { Name } from "#switcher/name.ts";
import { Root, type RootProps } from "#switcher/root.tsx";
import { Trigger } from "#switcher/trigger.tsx";

/**
 * Draws whatever a case wants measured inside the switcher that hands down the variants.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the switcher.
 * @returns The switcher, holding it.
 */
export function switched(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Draws the control alone, with the list closed.
 *
 * @remarks
 *   A case that reads the control rather than the list takes this, because an open menu measures
 *   where to place itself after the render returns and a synchronous case would read the control
 *   before that settled. React reports the state the machine writes then as an update outside
 *   `act`.
 * @param props - Whatever the case sets on the switcher.
 * @returns The switcher, holding the control and no list.
 */
export function triggered(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger label="Workspace">
        <Label>
          <Name>Acme</Name>
          <Detail>Pro plan</Detail>
        </Label>
      </Trigger>
    </Root>
  );
}

/**
 * Draws a whole switcher, so a case can read what the control says and what the panel holds.
 *
 * @param props - Whatever the case sets on the switcher.
 * @returns The parts composed the way a caller composes them: the control, and the menu's own
 *   panel of rows.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root open {...props}>
      <Trigger label="Workspace">
        <Label>
          <Name>Acme</Name>
          <Detail>Pro plan</Detail>
        </Label>
      </Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.OptionItem checked type="radio" value="acme">
            <Menu.ItemIndicator>✓</Menu.ItemIndicator>
            <Menu.ItemMark>A</Menu.ItemMark>
            <Menu.ItemLines>
              <Menu.ItemText>Acme</Menu.ItemText>
              <Menu.ItemDescription>Pro plan</Menu.ItemDescription>
            </Menu.ItemLines>
          </Menu.OptionItem>
          <Menu.OptionItem checked={false} type="radio" value="globex">
            <Menu.ItemIndicator>✓</Menu.ItemIndicator>
            <Menu.ItemMark>G</Menu.ItemMark>
            <Menu.ItemText>Globex</Menu.ItemText>
          </Menu.OptionItem>
        </Menu.Content>
      </Menu.Positioner>
    </Root>
  );
}
