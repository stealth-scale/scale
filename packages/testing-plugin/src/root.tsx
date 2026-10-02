/**
 * Renders the root of a render's router: the frame, then the element in the plugin's scope, or a
 * product's frame alone.
 */

import {
  type ComponentType,
  type FunctionComponent,
  type ReactElement,
  type ReactNode,
  Suspense,
} from "react";

import { PluginProvider } from "@stealthscale/sdk-plugin";

/**
 * Returns the root route's component: the frame, then the element in the plugin's scope, inside a
 * `Suspense` boundary.
 *
 * @param frame - The frame the pages render in.
 * @param pluginId - Id of the plugin whose scope the element renders in. Where left out, the root
 *   renders the frame alone, as a product's root does.
 * @param ui - The element.
 */
export function rootOf(
  frame: ComponentType,
  pluginId?: string,
  ui: ReactNode = null,
): FunctionComponent {
  const Frame = frame;

  /**
   * Renders the frame, and the element where a plugin's scope is given.
   */
  return function Root(): ReactElement {
    return (
      <>
        <Frame />
        {pluginId === undefined ? null : (
          <PluginProvider pluginId={pluginId}>
            <Suspense fallback={null}>{ui}</Suspense>
          </PluginProvider>
        )}
      </>
    );
  };
}
