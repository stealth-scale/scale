/**
 * Passes the running machine's API to a render function.
 *
 * @remarks
 *   A caller whose control is not the trigger, or whose text depends on the state, reads `copied`,
 *   `value` and `copy` from the API. The consumer renders no element of its own, so it works at any
 *   depth below the root.
 */

import { type ReactNode } from "react";

import { type ClipboardApi, useClipboard } from "#clipboard/machine.ts";

/**
 * Props of `Clipboard.Consumer`: the render function.
 */
export interface ConsumerProps {
  /**
   * Render function called with the machine's API.
   */
  readonly children: (api: ClipboardApi) => ReactNode;
}

/**
 * Calls the render function with the API of the nearest root.
 *
 * @param props - The render function, as `children`.
 * @returns The tree the render function returns.
 */
export function Consumer({ children }: ConsumerProps): ReactNode {
  return children(useClipboard());
}
