/**
 * Renders the element that places the viewport under the bar, or beside a vertical one.
 *
 * @remarks
 *   `align` sets where the viewport is placed against the open trigger: `center` by default,
 *   `start` or `end`. The machine keeps the viewport 10px inside the window.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#navigation-menu/context.ts";
import { useNavigationMenu } from "#navigation-menu/machine.ts";
import { type Align, AlignProvider } from "#navigation-menu/scopes.ts";

/**
 * Renders the `div` with the navigation menu's viewport positioner class.
 */
const Placed = withContext("div", "viewportPositioner");

/**
 * Describes the props of the viewport positioner: the viewport's alignment and the props of a
 * `div`.
 */
export interface ViewportPositionerProps extends ComponentProps<typeof Placed> {
  /**
   * Where the viewport sits against the open trigger. Defaults to `center`.
   */
  readonly align?: Align | undefined;
}

/**
 * Renders the positioner with the machine's props, and provides the alignment to the viewport.
 *
 * @param props - The alignment, the viewport and the props of a `div`.
 * @returns The `div` element.
 */
export function ViewportPositioner({ align, ...props }: ViewportPositionerProps): ReactElement {
  const api = useNavigationMenu();

  return (
    <AlignProvider value={align}>
      <Placed {...mergeProps(api.getViewportPositionerProps(omitUndefined({ align })), props)} />
    </AlignProvider>
  );
}
