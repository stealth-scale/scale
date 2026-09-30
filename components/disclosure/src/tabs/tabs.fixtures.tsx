/**
 * Fixtures for the tabs specs: a root around one part, a set of three tabs, and a set of four
 * closable tabs that a close removes.
 */

import { type ReactElement, type ReactNode, useState } from "react";

import { CloseTrigger } from "#tabs/close-trigger.tsx";
import { type CloseDetails } from "#tabs/closing.ts";
import { Content } from "#tabs/content.tsx";
import { Indicator } from "#tabs/indicator.tsx";
import { List } from "#tabs/list.tsx";
import { Root, type RootProps } from "#tabs/root.tsx";
import { Trigger } from "#tabs/trigger.tsx";

/**
 * Lists the closable tabs by value, the third disabled.
 */
const CLOSABLE = ["first", "second", "third", "fourth"];

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

/**
 * Renders the closable tabs that are still open, each with a close trigger, and removes a tab when
 * the root reports its close.
 *
 * @param props - The props the case sets on the root, and the values open at the start.
 * @returns The tabs.
 */
// eslint-disable-next-line react/only-export-components -- the fixture keeps the open tabs in state, so it is a component
function Workspace({ initial, onClose, ...props }: WorkspaceProps): ReactElement {
  const [open, setOpen] = useState(initial);

  return (
    <Root
      defaultValue="second"
      onClose={(details: CloseDetails) => {
        onClose?.(details);
        setOpen((was) => was.filter((value) => value !== details.value));
      }}
      {...props}
    >
      <List>
        {open.map((value) => (
          <Trigger closable disabled={value === "third"} key={value} value={value}>
            {value}
            <CloseTrigger>x</CloseTrigger>
          </Trigger>
        ))}
        <Indicator />
      </List>
      {open.map((value) => (
        <Content key={value} value={value}>{`The ${value} panel`}</Content>
      ))}
    </Root>
  );
}

/**
 * Describes the props of the closable set: the root's props and the values open at the start.
 */
interface WorkspaceProps extends RootProps {
  /**
   * Values of the tabs open at the start.
   */
  readonly initial: readonly string[];
}

/**
 * Renders four closable tabs, the third disabled, open on the second, with the props the case
 * sets on the root. A close removes the tab.
 *
 * @param props - The props the case sets on the root.
 * @param initial - The values open at the start.
 * @returns The tabs.
 */
export function closable(
  props: RootProps = {},
  initial: readonly string[] = CLOSABLE,
): ReactElement {
  return <Workspace initial={initial} {...props} />;
}
