/**
 * Connects the floating panel machine and provides it and the presence of the panel to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads it from context, so the trigger, the
 *   positioner and the content report the same state. The parts read the service beside the api,
 *   because the content's keys send the machine's own move event, and the stage triggers read the
 *   stage, which the api does not report. Unless the caller states otherwise, Escape closes the
 *   panel and the panel is at least 240 by 100 pixels. The machine alone ignores Escape and lets an
 *   edge drag shrink the panel to nothing. A controlled panel is open until the caller's `open`
 *   turns false.
 */

import { useId } from "react";

import * as floatingPanel from "@zag-js/floating-panel";
import { normalizeProps, useMachine } from "@zag-js/react";

import {
  createRequiredContext,
  omitUndefined,
  type Presence,
  splitEnumerable,
} from "@stealthscale/hooks";

/**
 * Describes the api `floatingPanel.connect` returns: a prop getter per part plus the panel's state
 * and methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version. It references
 *   `@zag-js/types`, so the package declares that package as a dependency.
 */
export type FloatingPanelApi = ReturnType<typeof floatingPanel.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 *
 * @remarks
 *   `strategy` is left out: the machine computes the place in window coordinates, which only a
 *   panel fixed to the window reads correctly. `translations` is left out for the stage triggers'
 *   `label`.
 */
export type FloatingPanelOptions = Partial<Omit<floatingPanel.Props, "strategy" | "translations">>;

/**
 * Describes what the root provides to its parts: the connected api and the running service.
 */
export interface FloatingPanelMachine {
  /**
   * Connected api, with a prop getter per part.
   */
  readonly api: FloatingPanelApi;

  /**
   * Running service, whose events, context and computed values the parts read.
   */
  readonly service: floatingPanel.Service;
}

/**
 * Creates the context through which the root provides the machine to its parts.
 *
 * @remarks
 *   `useFloatingPanel` throws when no `FloatingPanel.Root` is mounted above the calling part.
 */
export const [MachineProvider, useFloatingPanel] =
  createRequiredContext<FloatingPanelMachine>("FloatingPanel");

/**
 * Creates the context through which the root provides the panel's presence to the positioner and
 * the content.
 */
export const [PanelProvider, usePanelPresence] = createRequiredContext<Presence>("FloatingPanel");

/**
 * Smallest size of the panel unless the caller states one, in pixels.
 */
const MIN_SIZE: floatingPanel.Size = { height: 100, width: 240 };

/**
 * Runs the floating panel machine with a close that leaves a controlled panel open.
 *
 * @remarks
 *   The machine's close trigger, trigger and `setOpen(false)` send one close event. With `open`
 *   controlled, the machine reports the close and moves to its closed state anyway, so the panel
 *   leaves while the caller's `open` is still true. Its open event and Escape report the change
 *   and wait for the caller. The close does the same here.
 */
const MACHINE: typeof floatingPanel.machine = {
  ...floatingPanel.machine,
  states: {
    ...floatingPanel.machine.states,
    open: {
      ...floatingPanel.machine.states.open,
      on: {
        ...floatingPanel.machine.states.open.on,
        CLOSE: [
          { actions: ["invokeOnClose"], guard: "isOpenControlled" },
          { actions: ["invokeOnClose", "resetRect", "setFinalFocus"], target: "closed" },
        ],
      },
    },
  },
};

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 *   `splitEnumerable` hands it a copy of the props, so React's `key` getter is never read.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine settings and the element props.
 */
export function splitFloatingPanelProps<Props extends FloatingPanelOptions>(
  props: Props,
): [FloatingPanelOptions, Omit<Props, keyof floatingPanel.Props>] {
  return splitEnumerable(floatingPanel.splitProps<Props>)(props);
}

/**
 * Starts the floating panel machine and returns its connected api and its service.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 */
export function useFloatingPanelMachine(options: FloatingPanelOptions): FloatingPanelMachine {
  const generated = useId();
  const service = useMachine(MACHINE, {
    closeOnEscape: true,
    minSize: MIN_SIZE,
    ...omitUndefined(options),
    id: options.id ?? generated,
  });

  return { api: floatingPanel.connect(service, normalizeProps), service };
}
