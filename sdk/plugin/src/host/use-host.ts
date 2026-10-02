/**
 * Reads the host's runtime for a hook, and fails where the hook renders outside a host.
 */

import { use } from "react";

import { HostContext, type HostRuntime } from "#host/runtime.ts";

/**
 * Returns the runtime of the host above the calling component.
 *
 * @param hook - Name of the hook that reads it, which the error names: `useSlot`.
 * @throws {@link Error} Where no host is above the component.
 */
export function useHost(hook: string): HostRuntime {
  const host = use(HostContext);

  if (host === undefined) {
    throw new Error(
      `${hook}() found no host. A plugin's components render inside a host, and a test renders them with renderPlugin.`,
    );
  }

  return host;
}
