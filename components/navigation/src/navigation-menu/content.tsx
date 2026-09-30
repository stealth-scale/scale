/**
 * Renders the panel its item's trigger opens.
 *
 * @remarks
 *   A panel is written inside its item. While the menu renders a viewport, the panel shows inside
 *   it. The item then renders the machine's visually hidden proxy, which moves Tab from the trigger
 *   into the panel and back out, and an element whose `aria-owns` references the panel. Without a
 *   viewport the panel opens under its trigger. A panel is
 *   `hidden` while closed and fades out before it hides. Arrows move between its links, and Escape
 *   and a press outside close it. A mouse that leaves it closes it after the root's `closeDelay`,
 *   unless the root sets `disablePointerLeaveClose`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { Portal } from "@stealthscale/component-primitives";
import { usePresence } from "@stealthscale/hooks";

import { withContext } from "#navigation-menu/context.ts";
import { useNavigationMenu } from "#navigation-menu/machine.ts";
import { useClosesOnLeave, useItem } from "#navigation-menu/scopes.ts";

/**
 * Renders the `div` with the navigation menu's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`, without `ref`, which the presence
 * takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Drawn>, "ref">;

/**
 * Renders the panel with the machine's content props and the presence props merged over the
 * caller's, inside the viewport while the menu renders one.
 *
 * @param props - The links and the props of a `div`.
 * @returns The `div` element, or the two elements of the machine's beside a portal to the viewport.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useNavigationMenu();
  const { value } = useItem();
  const { props: presented, setNode } = usePresence({ present: api.value === value });
  const closes = useClosesOnLeave();
  const machine = api.getContentProps({ value });
  const { onPointerLeave: _leave, ...kept } = machine;
  const panel = <Drawn {...mergeProps(closes ? machine : kept, presented, props)} ref={setNode} />;
  const viewport = api.getViewportNode();

  if (!api.isViewportRendered || viewport === null) return panel;

  return (
    <>
      <div {...api.getViewportProxyProps({ value })} />
      <div {...api.getTriggerProxyProps({ value })} />
      <Portal container={viewport}>{panel}</Portal>
    </>
  );
}
