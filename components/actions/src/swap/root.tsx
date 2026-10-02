/**
 * Renders the swap's root, which holds its two marks in one place.
 *
 * @remarks
 *   The root has no role and no name. The control around it states what the marks show: a toggle
 *   button keeps one name and sets `aria-pressed`, and a button whose words change names the action
 *   a press takes. The root writes `data-swap` as `on` or `off`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#swap/context.ts";
import { StateProvider } from "#swap/state.ts";

/**
 * Renders the `span` with the swap's root class.
 */
const Framed = withProvider("span", "root");

/**
 * Describes the props of the root: which mark shows, how the marks render while hidden, the
 * recipe's `motion` and the props of a `span`.
 */
export interface RootProps extends ComponentProps<typeof Framed> {
  /**
   * Whether a mark renders nothing until it first shows. False unless the caller passes true.
   */
  readonly lazyMount?: boolean | undefined;

  /**
   * Whether the `on` mark shows. False unless the caller passes true, which shows the `off` mark.
   */
  readonly swap?: boolean | undefined;

  /**
   * Whether a mark renders nothing once its exit motion ends. False unless the caller passes true.
   */
  readonly unmountOnExit?: boolean | undefined;
}

/**
 * Renders the root and provides which mark shows to the indicators.
 *
 * @param props - Which mark shows, how the marks render while hidden, the motion and the props of a
 *   `span`.
 * @returns The `span` element inside the state's provider.
 */
export function Root({
  lazyMount = false,
  swap = false,
  unmountOnExit = false,
  ...props
}: RootProps): ReactElement {
  return (
    <StateProvider value={{ lazyMount, swap, unmountOnExit }}>
      <Framed data-swap={swap ? "on" : "off"} {...props} />
    </StateProvider>
  );
}
