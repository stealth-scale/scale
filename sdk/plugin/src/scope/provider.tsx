/**
 * Renders a plugin's code in the plugin's scope.
 */

import { type ReactNode } from "react";

import { PluginContext } from "#scope/context.ts";

/**
 * Describes the props of `PluginProvider`.
 */
export interface PluginProviderProps {
  /**
   * The plugin's code.
   */
  readonly children?: ReactNode | undefined;

  /**
   * Id of the plugin the code belongs to.
   */
  readonly pluginId: string;
}

/**
 * Renders its children in a plugin's scope, which `usePlugin` and every hook that acts as a plugin
 * read.
 *
 * @param props - The plugin's id and its code.
 */
export function PluginProvider({ children, pluginId }: PluginProviderProps): ReactNode {
  return <PluginContext value={{ pluginId }}>{children}</PluginContext>;
}
