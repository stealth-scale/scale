/**
 * Declares the scope a plugin's code renders in, and reads it.
 *
 * @remarks
 *   The host renders each page of a plugin, and `Slot` renders each extension, inside its plugin's
 *   scope. A hook that acts as a plugin, such as one that emits an event, reads the plugin's id
 *   there rather than taking it as an argument, so a plugin cannot act as another.
 */

import { createContext, use } from "react";

/**
 * Describes the plugin a component belongs to.
 */
export interface PluginScope {
  /**
   * Id of the plugin.
   */
  readonly pluginId: string;
}

/**
 * Passes a plugin's scope to the plugin's code that renders below it.
 */
export const PluginContext = createContext<PluginScope | undefined>(undefined);

/**
 * Returns the plugin the calling component belongs to.
 *
 * @throws {@link Error} Where the component renders outside every plugin's scope.
 */
export function usePlugin(): PluginScope {
  const scope = use(PluginContext);

  if (scope === undefined) {
    throw new Error(
      "usePlugin() found no plugin. A plugin's code renders in its plugin's scope, which the host and Slot provide.",
    );
  }

  return scope;
}
