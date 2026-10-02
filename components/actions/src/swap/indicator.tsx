/**
 * Renders one of the swap's two marks.
 *
 * @remarks
 *   Each indicator runs a presence: the `on` mark shows while the root's `swap` is true and the
 *   `off` mark while it is false. A mark that leaves plays its exit motion, `inert` so it takes no
 *   focus, and then carries `data-hidden`. The recipe hides a mark with `data-hidden` by its
 *   visibility, which keeps the mark's room. The global reset takes a mark with the `hidden`
 *   attribute out of the layout, which would size the root to the visible mark alone. The presence
 *   skips the entry motion on mount, so a swap that first renders shows its mark at rest, and
 *   `data-state` appears with the first change.
 */

import { type ComponentProps, type ReactElement } from "react";

import { usePresence } from "@stealthscale/hooks";

import { withContext } from "#swap/context.ts";
import { useSwapState } from "#swap/state.ts";

/**
 * Renders the `span` with the swap's indicator class.
 */
const Drawn = withContext("span", "indicator");

/**
 * Describes the props of an indicator: which mark it is and the props of a `span`, without `ref`,
 * which the presence takes.
 */
export interface IndicatorProps extends Omit<ComponentProps<typeof Drawn>, "ref"> {
  /**
   * Which mark this is: `on` shows while the root's `swap` is true, `off` while it is false.
   */
  readonly type: "off" | "on";
}

/**
 * Renders the mark with its presence's `data-state` and `inert`, and `data-hidden` in place of
 * `hidden`, under the caller's props.
 *
 * @param props - Which mark this is and the props of a `span`.
 * @returns The `span` element, or nothing while the presence renders nothing.
 */
export function Indicator({ type, ...props }: IndicatorProps): null | ReactElement {
  const { lazyMount, swap, unmountOnExit } = useSwapState();
  const {
    props: { hidden, ...presented },
    setNode,
    unmounted,
  } = usePresence({
    lazyMount,
    present: type === "on" ? swap : !swap,
    skipAnimationOnMount: true,
    unmountOnExit,
  });

  if (unmounted) return null;

  return (
    <Drawn
      {...presented}
      data-hidden={hidden ? "" : undefined}
      {...props}
      data-type={type}
      ref={setNode}
    />
  );
}
