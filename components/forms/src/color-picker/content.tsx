/**
 * Renders the panel.
 *
 * @remarks
 *   The element is a `dialog` beside the trigger, or a `div` in place when the picker is inline.
 *   The machine moves focus to the panel's first control as the panel opens. Tab moves through the
 *   panel's controls and on from the last one to the control after the trigger, and Shift+Tab
 *   moves from the first one back to the trigger, so the panel follows the trigger in the tab order
 *   wherever a portal puts it. Focus that leaves the panel, Escape and a press outside close it.
 *   The dialog is named by the label that names the picker, else by the trigger's `aria-label`. It
 *   stays shown while its exit animation runs.
 */

import { type ComponentProps, type ReactElement, useEffect } from "react";

import { proxyTabFocus } from "@zag-js/dom-query";
import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#color-picker/context.ts";
import { useColorPicker, usePanelPresence } from "#color-picker/machine.ts";
import { useShared } from "#color-picker/state.ts";

/**
 * Renders the `div` with the color picker's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`, without `ref`, which the presence
 * takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Drawn>, "ref">;

/**
 * Renders the panel with the machine's content props and the presence props merged over the
 * caller's, and moves Tab between the panel and the trigger while a floating panel is open.
 *
 * @param props - The parts of the panel and the props of a `div`.
 * @returns The `div` element.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useColorPicker();
  const { ids, label, name } = useShared();
  const { props: presented, setNode } = usePanelPresence();
  const floating = api.open && !api.inline;

  useEffect((): (() => void) | undefined => {
    if (!floating) return undefined;

    return proxyTabFocus(() => document.querySelector<HTMLElement>(`[id="${ids.content}"]`), {
      defer: true,
      onFocus: (element) => {
        element.focus({ preventScroll: true });
      },
      triggerElement: () => document.querySelector<HTMLElement>(`[id="${ids.trigger}"]`),
    });
  }, [floating, ids.content, ids.trigger]);

  const named = label === undefined ? { "aria-label": name } : { "aria-labelledby": label };
  const own = api.inline ? { "data-inline": "" } : omitUndefined(named);

  return <Drawn {...mergeProps(api.getContentProps(), presented, own, props)} ref={setNode} />;
}
