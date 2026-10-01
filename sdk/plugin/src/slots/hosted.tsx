/**
 * Renders one extension as it is: in its plugin's scope, loaded on its first render, and with its
 * fallback in its place after it throws.
 */

import { createElement, type ReactNode, Suspense } from "react";

import { type ExtensionEntry, type Product, type ResolvedExtension } from "@stealthscale/sdk-core";

import { type RenderTarget } from "#host/report.ts";
import { useHost } from "#host/use-host.ts";
import { PluginProvider } from "#scope/provider.tsx";
import { Boundary } from "#slots/boundary.ts";
import { lazyOf, missingOf } from "#slots/lazy.ts";

/**
 * Describes the props of `Hosted`.
 */
export interface HostedProps {
  /**
   * The content a wrapping extension renders around.
   */
  readonly children?: ReactNode;

  /**
   * The extension.
   */
  readonly extension: ResolvedExtension;

  /**
   * The props the extension renders with: its target's, and `targetId`.
   */
  readonly props: Readonly<Record<string, unknown>>;
}

/**
 * Returns the code a manifest maps an extension to, or undefined where no installed manifest maps
 * it.
 */
function entryOf(product: Product, extension: ResolvedExtension): ExtensionEntry | undefined {
  const entries = product.manifests[extension.plugin]?.code.extensions ?? {};

  return entries[extension.id.slice(extension.plugin.length + 1)];
}

/**
 * Renders an extension without decorators: in its plugin's scope, suspended while its component
 * loads, and with its manifest's fallback in its place after a render of it throws.
 *
 * @remarks
 *   Each render that throws counts one failure towards the extension's quarantine, and a render
 *   that commits returns the count to zero. A new `props` object renders a failed extension again.
 *   An extension no installed manifest maps to code throws inside its boundary, as a failure.
 */
export function Hosted({ children, extension, props }: HostedProps): ReactNode {
  const { product, stores } = useHost("Slot");
  const { quarantine } = stores;
  const target: RenderTarget = `extension:${extension.id}`;
  const entry = entryOf(product, extension);
  const component =
    entry === undefined ? missingOf(extension.id) : lazyOf(entry.component, extension.id);
  const fallback =
    entry?.fallback === undefined
      ? null
      : createElement(lazyOf(entry.fallback, extension.id), props);

  return (
    <PluginProvider pluginId={extension.plugin}>
      <Suspense fallback={null}>
        <Boundary
          fallback={fallback}
          onError={(error) => {
            quarantine.failed(target, error);
          }}
          onRendered={() => {
            quarantine.rendered(target);
          }}
          resetKey={props}
        >
          {createElement(component, props, children)}
        </Boundary>
      </Suspense>
    </PluginProvider>
  );
}
