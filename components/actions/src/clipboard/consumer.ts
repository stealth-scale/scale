/**
 * Hands the running machine to a caller's own render function.
 *
 * @remarks
 *   A caller whose control is not the trigger, or whose words change with the state, reads
 *   `copied`, `value` and `copy` here and draws what it likes with them. It draws no element of
 *   its own, so it sits anywhere under the root.
 */

import { type ReactNode } from "react";

import { type ClipboardApi, useClipboard } from "#clipboard/machine.ts";

/**
 * Describes what the consumer takes: a function of the machine's api.
 */
export interface ConsumerProps {
  /**
   * Draws whatever the caller likes from the machine's state and methods.
   */
  readonly children: (api: ClipboardApi) => ReactNode;
}

/**
 * Calls the caller's function with the running machine.
 *
 * @param props - The function to draw with.
 * @returns The tree the function drew.
 */
export function Consumer({ children }: ConsumerProps): ReactNode {
  return children(useClipboard());
}
