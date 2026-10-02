/**
 * Renders a plugin's components under a real host and a memory router, for a specification.
 *
 * @remarks
 *   The host is the one a product runs: `createHost` over the product `standaloneProduct` builds,
 *   resolved without the build. Each render builds its own product, host, router and setting store,
 *   so no case reads another's state.
 */

import { type ReactNode, useEffect } from "react";

import { PluginFrame } from "#frame.tsx";
import { renderOver } from "#host-render.tsx";
import { hostedOf } from "#hosted.ts";
import {
  type HookResult,
  type PluginHookRendered,
  type PluginRendered,
  type PluginRenderOptions,
} from "#options.ts";
import { rootOf } from "#root.tsx";

/**
 * Renders an element as a component of a plugin, under a host and a memory router.
 *
 * @remarks
 *   The element renders in the plugin's scope after the frame, inside a `Suspense` boundary. The
 *   host's sources start from `standaloneSources`, and the options replace their session, their
 *   decisions and their flags. The router loads the route before the render. `unmount` disposes the
 *   host.
 * @param ui - The element, which reads the host through the hooks of `sdk-plugin`.
 * @param options - The plugin, the plugins beside it, and the state the host starts from.
 * @returns The render, once the router loaded and the render settled.
 * @throws {@link Error} Where the product does not resolve, or a seed names a section no installed
 *   plugin declares.
 */
export async function renderPlugin(
  ui: ReactNode,
  options: PluginRenderOptions,
): Promise<PluginRendered> {
  const root = rootOf(options.frame ?? PluginFrame, options.contract.pluginId, ui);
  const rendered = await renderOver(hostedOf(options), root, options.route);

  return rendered;
}

/**
 * Renders a hook as a hook of a plugin, under the same host and router as `renderPlugin`.
 *
 * @param hook - The hook, called in a component in the plugin's scope.
 * @param options - The plugin, the plugins beside it, and the state the host starts from.
 * @returns The render, with what the hook returned at its last render.
 */
export async function renderPluginHook<T>(
  hook: () => T,
  options: PluginRenderOptions,
): Promise<PluginHookRendered<T>> {
  const holder: Partial<HookResult<T>> = {};

  /**
   * Calls the hook, and keeps what it returned once the render commits.
   */
  function HookProbe(): null {
    const current = hook();

    useEffect(() => {
      Object.assign(holder, { current });
    });

    return null;
  }

  const rendered = await renderPlugin(<HookProbe />, options);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the probe committed before renderPlugin resolved, so the hook has returned
  return { ...rendered, result: holder as HookResult<T> };
}
