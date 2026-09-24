/**
 * Fixtures for the tabs specs: a root around one part and a set of three tabs.
 */

import { type ReactElement, type ReactNode } from "react";

import { Content } from "#tabs/content.tsx";
import { Indicator } from "#tabs/indicator.tsx";
import { List } from "#tabs/list.tsx";
import { Root, type RootProps } from "#tabs/root.tsx";
import { Trigger } from "#tabs/trigger.tsx";

/**
 * Renders a part inside a root that runs the machine.
 *
 * @param children - The part under test.
 * @returns The root with the part inside it.
 */
export function tabbed(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Renders three tabs, the third disabled, and their panels, open on the first, with the props the
 * case sets on the root.
 *
 * @param props - The props the case sets on the root.
 * @returns The tabs.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root defaultValue="first" {...props}>
      <List>
        <Trigger value="first">First</Trigger>
        <Trigger value="second">Second</Trigger>
        <Trigger disabled value="third">
          Third
        </Trigger>
        <Indicator />
      </List>
      <Content value="first">The first panel</Content>
      <Content value="second">The second panel</Content>
      <Content value="third">The third panel</Content>
    </Root>
  );
}
