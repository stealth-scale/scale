/**
 * Builds the switchers the specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { Menu } from "@stealthscale/component-disclosure";

import { Action } from "#switcher/action.tsx";
import { type Choice } from "#switcher/choice.ts";
import { Detail } from "#switcher/detail.ts";
import { Label } from "#switcher/label.ts";
import { Name } from "#switcher/name.ts";
import { Root, type RootProps } from "#switcher/root.tsx";
import { Trigger } from "#switcher/trigger.tsx";

/**
 * Three workspaces: one with a plan, one without, and one the reader cannot switch to.
 */
export const CHOICES: readonly Choice[] = [
  { detail: "Pro plan", label: "Acme", value: "acme" },
  { label: "Globex Corporation", value: "globex" },
  { disabled: true, label: "Old Books", value: "old" },
];

/**
 * Renders a switcher from the three workspaces, with one action after them.
 *
 * @param props - The root's props.
 * @returns The switcher.
 */
export function chosen(props: RootProps = {}): ReactElement {
  return (
    <Root checkIcon="✓" indicator="⇕" items={CHOICES} label="Workspace" {...props}>
      <Action value="new">New workspace</Action>
    </Root>
  );
}

/**
 * Renders a part inside the root, which provides the variants.
 *
 * @param children - The part under test.
 * @param props - The root's props.
 * @returns The root with the part inside it.
 */
export function switched(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Renders the control without a positioner, so the menu is closed.
 *
 * @remarks
 *   A synchronous case that reads the control uses this fixture. An open menu positions itself
 *   after the render returns, and React reports the machine's state update then as outside `act`.
 * @param props - The root's props.
 * @returns The switcher with the control only.
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
 * Renders an open switcher with two rows, one of them checked.
 *
 * @param props - The root's props.
 * @returns The switcher with the control and the menu's positioner and content.
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
