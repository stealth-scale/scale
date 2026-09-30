/**
 * Renders one tab.
 *
 * @remarks
 *   The tab takes the `value` of the panel it shows. The machine sets `role="tab"`,
 *   `aria-selected`, `aria-controls` and the tab index. Only the selected tab is in the tab order,
 *   so the list is one tab stop and the arrow keys move inside it. The selected tab scrolls itself
 *   into view inside a list that scrolls sideways, and leaves the page where it is.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { revealSideways, useSafeLayoutEffect } from "@stealthscale/hooks";

import { withContext } from "#tabs/context.ts";
import { useTabs, useTabsActions } from "#tabs/machine.ts";

/**
 * Renders the `button` with the tabs' trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes the props of a tab: its value, whether it is disabled, whether it closes and the props
 * of a `button`.
 */
export interface TriggerProps extends ComponentProps<typeof Pressed> {
  /**
   * Whether a person can close the tab: Delete while it has focus, a middle click, or a press on
   * its `Tabs.CloseTrigger`. The root's `onClose` receives the tab's value.
   */
  readonly closable?: boolean | undefined;

  /**
   * Whether the tab is disabled.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Value of the panel the tab shows.
   */
  readonly value: string;
}

/**
 * Describes the props a closable tab adds: the key it states and the handlers that close it.
 */
type ClosingProps = Pick<
  ComponentProps<"button">,
  "aria-keyshortcuts" | "onAuxClick" | "onKeyDown"
>;

/**
 * Returns the props that make a tab closable: `aria-keyshortcuts="Delete"`, Delete and a middle
 * click.
 *
 * @param close - The root's close.
 */
function closingProps(close: (tab: HTMLElement) => void): ClosingProps {
  return {
    "aria-keyshortcuts": "Delete",
    onAuxClick: (event) => {
      if (event.button !== 1) return;

      event.preventDefault();
      close(event.currentTarget);
    },
    onKeyDown: (event) => {
      if (event.key !== "Delete") return;

      event.preventDefault();
      close(event.currentTarget);
    },
  };
}

/**
 * Renders a tab with the machine's trigger props merged over the caller's.
 *
 * @param props - The panel's value, the disabled and closable flags and the props of a `button`.
 * @returns The `button` element.
 */
export function Trigger({
  closable = false,
  disabled,
  value,
  ...rest
}: TriggerProps): ReactElement {
  const api = useTabs();
  const { close } = useTabsActions();
  const stated = { ...(disabled === undefined ? {} : { disabled }), value };
  const machine = api.getTriggerProps(stated);
  const selected = api.value === value;
  const id = String(machine["id"]);

  useSafeLayoutEffect(() => {
    if (!selected) return;

    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the tab renders before its layout effects run
    const tab = document.querySelector(`[id="${id}"]`) as HTMLElement;

    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every tab renders inside a Tabs.Root
    revealSideways(tab, tab.closest("[data-scope=tabs][data-part=root]") as Element);
  }, [id, selected]);

  return <Pressed {...mergeProps(machine, closable ? closingProps(close) : {}, rest)} />;
}
