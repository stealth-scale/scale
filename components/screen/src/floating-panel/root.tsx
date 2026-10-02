/**
 * Renders the floating panel's root and starts the machine its parts share.
 *
 * @remarks
 *   The machine has no root part, so the root receives no machine props. It renders a `div` with
 *   `display: contents`, which leaves the layout around the trigger unchanged. The root runs the
 *   panel's presence: the panel is not in the document until it first opens, and leaves once its
 *   exit animation ends.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type PresenceOptions, usePresence } from "@stealthscale/hooks";

import { withProvider } from "#floating-panel/context.ts";
import {
  type FloatingPanelOptions,
  MachineProvider,
  PanelProvider,
  splitFloatingPanelProps,
  useFloatingPanelMachine,
} from "#floating-panel/machine.ts";

/**
 * Renders the `div` that provides the recipe to the parts.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the presence of the panel and the props
 * of a `div`.
 *
 * @remarks
 *   The element's `id`, `dir`, `draggable` and `position` are left out, because the machine takes
 *   all four. It derives every part's id from `id` and writes `dir` on every part. It reads
 *   `draggable` as whether a person can move the panel, and `position` as the panel's place.
 *   `lazyMount` and `unmountOnExit` are true by default.
 */
export interface RootProps
  extends
    FloatingPanelOptions,
    Omit<ComponentProps<typeof Framed>, "dir" | "draggable" | "id" | "position">,
    Omit<PresenceOptions, "present"> {}

/**
 * Renders the root and provides the machine and the panel's presence to the parts.
 *
 * @param props - The machine's options, the presence options and the props of a `div`.
 * @returns The `div` element inside the providers.
 */
export function Root({
  lazyMount = true,
  onExitComplete,
  skipAnimationOnMount,
  unmountOnExit = true,
  ...props
}: RootProps): ReactElement {
  const [options, rest] = splitFloatingPanelProps(props);
  const machine = useFloatingPanelMachine(options);
  const panel = usePresence({
    lazyMount,
    onExitComplete,
    present: machine.api.open,
    skipAnimationOnMount,
    unmountOnExit,
  });

  return (
    <MachineProvider value={machine}>
      <PanelProvider value={panel}>
        <Framed {...rest} />
      </PanelProvider>
    </MachineProvider>
  );
}
