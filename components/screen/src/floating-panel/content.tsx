/**
 * Renders the floating panel: a `dialog` that is not modal, named by its title.
 *
 * @remarks
 *   The page around the panel remains in use. On opening, focus moves to the panel, or to the
 *   element `initialFocusEl` returns, and on closing it returns to the trigger. Focus inside a
 *   panel brings it in front of the other open panels. Tab moves from the trigger to the panel and
 *   on from the panel's last control to the control after the trigger, and Shift+Tab from the panel
 *   back to the trigger, so the panel follows the trigger in the tab order wherever a portal puts
 *   it. While the panel itself has focus the arrow keys move it and Alt with an arrow resizes it,
 *   and Escape closes the panel in front. The panel is shown and inert while its exit animation
 *   runs.
 */

import { type ComponentProps, type ReactElement, useEffect } from "react";

import { proxyTabFocus } from "@zag-js/dom-query";
import { mergeProps } from "@zag-js/react";

import { withContext } from "#floating-panel/context.ts";
import { keyed } from "#floating-panel/keys.ts";
import { useFloatingPanel, usePanelPresence } from "#floating-panel/machine.ts";

/**
 * Renders the `div` with the floating panel's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`, without `ref`, which the presence
 * takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Drawn>, "ref">;

/**
 * Returns the element with an id, or null.
 *
 * @param id - The id the machine wrote on the element.
 */
function byId(id: unknown): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[id="${String(id)}"]`);
}

/**
 * Renders the panel with the machine's content props, the presence props and the keys merged under
 * the caller's, and moves Tab between the panel and the trigger while the panel is open.
 *
 * @param props - The parts of the panel and the props of a `div`.
 * @returns The `div` element.
 */
export function Content(props: ContentProps): ReactElement {
  const { api, service } = useFloatingPanel();
  const { props: presented, setNode } = usePanelPresence();
  const machine = api.getContentProps();
  const content: unknown = machine["id"];
  const trigger: unknown = api.getTriggerProps()["id"];

  useEffect((): (() => void) | undefined => {
    if (!api.open) return undefined;

    return proxyTabFocus(() => byId(content), {
      defer: true,
      onFocus: (element) => {
        element.focus({ preventScroll: true });
      },
      triggerElement: () => byId(trigger),
    });
  }, [api.open, content, trigger]);

  const own: Pick<ContentProps, "onKeyDown"> = {
    onKeyDown: (event) => {
      keyed(event, service);
    },
  };

  return <Drawn {...mergeProps(machine, presented, own, props)} ref={setNode} />;
}
