/**
 * Exposes the running machine to a render function the caller supplies.
 *
 * @remarks
 *   A caller whose control is something other than the trigger, or whose text depends on the
 *   state, reads `copied`, `value` and `copy` from the api and renders whatever it needs. Nothing
 *   is rendered around the function, so it can sit at any depth below the root.
 */

import { type ReactNode } from "react";

import { type ClipboardApi, useClipboard } from "#clipboard/machine.ts";

/**
 * Carries the single render function the consumer calls.
 */
export interface ConsumerProps {
  /**
   * The function called with the machine's api, whose result is rendered in place.
   */
  readonly children: (api: ClipboardApi) => ReactNode;
}

/**
 * Invokes the render function with the api of the nearest root.
 *
 * @param props - The render function, under `children`.
 * @returns The tree the render function produced.
 */
export function Consumer({ children }: ConsumerProps): ReactNode {
  return children(useClipboard());
}
