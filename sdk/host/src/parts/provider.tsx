/**
 * Renders the host's contexts around a product's router: the runtime the hooks of `sdk-plugin`
 * read, the data client, the `root` region and the last boundary.
 */

import { type ReactNode, useLayoutEffect } from "react";

import { DataProvider } from "@stealthscale/provider-data";
import { type AnyRouter, RouterContextProvider } from "@stealthscale/provider-router";
import { hostContract } from "@stealthscale/sdk-core";
import { HostContext, Slot } from "@stealthscale/sdk-plugin";

import { internalsOf } from "#host/internals.ts";
import { type Host } from "#host/options.ts";
import { useProductName } from "#host/words.ts";
import { useConnected } from "#parts/connect.ts";
import { LastBoundary } from "#parts/last-boundary.ts";

/**
 * Describes the props of `HostProvider`.
 */
export interface HostProviderProps {
  /**
   * The product's tree, which renders the router through `RouterProvider`.
   */
  readonly children?: ReactNode;

  /**
   * The host the router's context contains.
   */
  readonly host: Host;

  /**
   * The router whose context contains the host.
   */
  readonly router: AnyRouter;
}

/**
 * Provides a host to the product's tree, once per render tree.
 *
 * @remarks
 *   The `root` region renders around the router, so its extensions render outside every route and
 *   read the router's matches through the router's context. The provider connects the host to the
 *   router (`useConnected`) and titles the document with the product's name as it mounts and as
 *   the language changes, before any page titles it. It renders the failure page in place of a
 *   tree that throws outside the router.
 */
export function HostProvider({ children, host, router }: HostProviderProps): ReactNode {
  const { runtime } = internalsOf(host);
  const name = useProductName(runtime.product);

  useConnected(host, router);

  useLayoutEffect(() => {
    document.title = name;
  }, [name]);

  return (
    <LastBoundary runtime={runtime}>
      <HostContext value={runtime}>
        <DataProvider client={host.data}>
          <RouterContextProvider router={router}>
            <Slot slot={hostContract.slots.root}>{children}</Slot>
          </RouterContextProvider>
        </DataProvider>
      </HostContext>
    </LastBoundary>
  );
}
