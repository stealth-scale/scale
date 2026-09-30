/**
 * Renders one tab of a page's tab list, with its count as a badge.
 *
 * @remarks
 *   The words are a string, because a narrow page renders them as a row of the picker. The tab
 *   lists itself with its tab list while it is mounted and updates its row in place, so the
 *   picker's rows keep the tabs' order. A space before the badge makes the count a word of its own
 *   in the tab's accessible name. On a narrow page the tab renders nothing and the picker renders
 *   its row.
 */

import { type ReactElement } from "react";

import { Badge } from "@stealthscale/component-data";
import { Tabs } from "@stealthscale/component-disclosure";
import { useSafeLayoutEffect } from "@stealthscale/hooks";

import { useTabList } from "#page/tabs-state.ts";

/**
 * Describes the props of a tab: its words, its count and the props of the disclosure package's
 * tab trigger.
 */
export interface TabProps extends Omit<Tabs.TriggerProps, "children"> {
  /**
   * Words of the tab.
   */
  readonly children: string;

  /**
   * Number the tab's badge shows, such as the rows the tab's view contains.
   */
  readonly count?: number | undefined;
}

/**
 * Renders the tab, or nothing on a narrow page, and lists it with its tab list.
 *
 * @param props - The words, the count and the trigger's props.
 * @returns The `button` element, or nothing on a narrow page.
 */
export function Tab({
  children,
  count,
  disabled = false,
  value,
  ...rest
}: TabProps): null | ReactElement {
  const { narrow, put, remove } = useTabList();

  useSafeLayoutEffect(
    () => (): void => {
      remove(value);
    },
    [remove, value],
  );

  useSafeLayoutEffect(() => {
    put({ count, disabled, label: children, value });
  });

  if (narrow) return null;

  return (
    <Tabs.Trigger disabled={disabled} value={value} {...rest}>
      {children}
      {count === undefined ? null : (
        <>
          {" "}
          <Badge palette="neutral" size="sm">
            {count}
          </Badge>
        </>
      )}
    </Tabs.Trigger>
  );
}
