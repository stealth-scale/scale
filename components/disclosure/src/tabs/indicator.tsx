/**
 * Renders the indicator of the selected tab.
 *
 * @remarks
 *   The machine measures the selected tab into custom properties and sets `hidden` until it has a
 *   tab to measure, so the indicator does not flash at the list's start on the first render. The
 *   indicator sets `aria-hidden`, because the selected tab reports `aria-selected` and an element
 *   without a role inside a `tablist` is one more stop for a screen reader. It measures the
 *   selected tab again whenever an element enters or leaves its list, so a tab that closes or opens
 *   before the selected one leaves the indicator under the selected tab.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { useCallbackRef, useSafeLayoutEffect } from "@stealthscale/hooks";

import { withContext } from "#tabs/context.ts";
import { useTabs, useTabsActions } from "#tabs/machine.ts";

/**
 * Renders the `div` with the tabs' indicator class.
 */
const Bar = withContext("div", "indicator");

/**
 * Describes the props of the indicator: the props of a `div`.
 */
export type IndicatorProps = ComponentProps<typeof Bar>;

/**
 * Renders the indicator, hidden from assistive technology, with the machine's indicator props.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const api = useTabs();
  const measure = useCallbackRef(useTabsActions().measure);
  const machine = api.getIndicatorProps();
  const id = String(machine["id"]);

  useSafeLayoutEffect(() => {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the indicator renders before its layout effects run
    const list = (document.querySelector(`[id="${id}"]`) as Element).closest("[role=tablist]");
    const observer = new MutationObserver(() => {
      measure();
    });

    if (list) observer.observe(list, { childList: true, subtree: true });

    return (): void => {
      observer.disconnect();
    };
  }, [id, measure]);

  return <Bar {...mergeProps({ "aria-hidden": true }, machine, props)} />;
}
