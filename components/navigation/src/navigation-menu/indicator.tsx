/**
 * Renders the bar under the open trigger, which moves and resizes as another trigger opens.
 *
 * @remarks
 *   The element is an `li` of the list, `aria-hidden`, because the open trigger reports its own
 *   state. It reads the open trigger's place and width from the root's `--trigger-x` and
 *   `--trigger-width`, and fades out once every item closes.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { usePresence } from "@stealthscale/hooks";

import { withContext } from "#navigation-menu/context.ts";
import { useNavigationMenu } from "#navigation-menu/machine.ts";

/**
 * Renders the `li` with the navigation menu's indicator class.
 */
const Marked = withContext("li", "indicator");

/**
 * Describes the props of the indicator: the props of an `li`, without `ref`, which the presence
 * takes.
 */
export type IndicatorProps = Omit<ComponentProps<typeof Marked>, "ref">;

/**
 * Renders the indicator with the machine's indicator props and the presence props merged over the
 * caller's.
 *
 * @param props - The props of an `li`.
 * @returns The `li` element.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const api = useNavigationMenu();
  const { props: presented, setNode } = usePresence({ present: api.open });

  return <Marked {...mergeProps(api.getIndicatorProps(), presented, props)} ref={setNode} />;
}
