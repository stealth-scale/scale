/**
 * Connects the scroll area machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads it from context. The machine measures the
 *   viewport when it first intersects the window, and again whenever the root or the content
 *   resizes.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as scrollArea from "@zag-js/scroll-area";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `scrollArea.connect` returns: a prop getter per part plus the machine's state
 * and methods.
 *
 * @remarks
 *   The type comes from `connect`, so it follows the installed machine version.
 */
export type ScrollAreaApi = ReturnType<typeof scrollArea.connect>;

/**
 * Describes the machine settings the root passes to the machine.
 */
export type ScrollAreaOptions = Partial<scrollArea.Props>;

/**
 * Creates the context through which the root provides the connected api to its parts.
 *
 * @remarks
 *   `useScrollArea` throws when no `ScrollArea.Root` is mounted above the calling part.
 */
export const [MachineProvider, useScrollArea] = createRequiredContext<ScrollAreaApi>("ScrollArea");

/**
 * Runs Zag's scroll area machine with both scrollbars and the corner hidden until a measurement
 * finds an overflow, and measures the viewport as the machine starts.
 *
 * @remarks
 *   The viewport takes a tab stop only while the machine reports overflow. The machine starts in a
 *   layout effect, so the first measurement lands before the first paint, and a focus trap that
 *   runs in the next frame moves focus onto the viewport only when it scrolls. Zag alone starts
 *   with both scrollbars shown and measures one timer after a resize observer's first callback.
 */
const MACHINE: typeof scrollArea.machine = {
  ...scrollArea.machine,

  /**
   * Returns Zag's context with the scrollbars and the corner hidden.
   */
  context(params) {
    return {
      // eslint-disable-next-line typescript/no-non-null-assertion -- Zag's scroll area machine declares its context
      ...scrollArea.machine.context!(params),
      hiddenState: params.bindable<scrollArea.ScrollbarHiddenState>(() => ({
        defaultValue: { cornerHidden: true, scrollbarXHidden: true, scrollbarYHidden: true },
        hash: ({ cornerHidden, scrollbarXHidden, scrollbarYHidden }) =>
          `Y:${String(scrollbarYHidden)} X:${String(scrollbarXHidden)} C:${String(cornerHidden)}`,
      })),
    };
  },
  entry: ["checkHovering", "setThumbSize"],
};

/**
 * Starts the scroll area machine and returns its connected api.
 *
 * @param options - Machine settings split from the root's props. React generates `id` when the
 *   caller states none.
 * @returns The api.
 */
export function useScrollAreaMachine(options: ScrollAreaOptions): ScrollAreaApi {
  const generated = useId();
  const service = useMachine(MACHINE, {
    ...omitUndefined(options),
    id: options.id ?? generated,
  });

  return scrollArea.connect(service, normalizeProps);
}

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine settings and the element props.
 */
export function splitScrollAreaProps<Props extends ScrollAreaOptions>(
  props: Props,
): [ScrollAreaOptions, Omit<Props, keyof scrollArea.Props>] {
  return splitEnumerable(scrollArea.splitProps<Props>)(props);
}
