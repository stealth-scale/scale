/**
 * Renders a row's link as the trigger of its tooltip.
 *
 * @remarks
 *   The tooltip's trigger renders an anchor through `as`, which keeps the machine's pointer and
 *   focus handlers and its `aria-describedby` on the link itself.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Tooltip } from "@stealthscale/component-disclosure";

/**
 * Renders an `a` element with the tooltip's trigger props.
 *
 * @param props - The props of an anchor.
 * @returns The `a` element.
 */
export function Tip(props: ComponentProps<"a">): ReactElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the trigger renders the anchor through as, which does not retype the props it forwards
  return <Tooltip.Trigger as="a" {...(props as Tooltip.TriggerProps)} />;
}
