/**
 * Reads what the host gives as it is: the product it started from, its toaster and its actions.
 */

import { type ResolvedProduct, type Toaster } from "@stealthscale/sdk-core";

import { type RenderTarget } from "#host/report.ts";
import { useHost } from "#host/use-host.ts";

/**
 * Lists what a component may ask of the host.
 */
export interface HostActions {
  /**
   * Lifts a target's quarantine and forgets its failures.
   */
  readonly retry: (target: RenderTarget) => void;
}

/**
 * Returns the resolved product the host started from, without the manifests' code.
 */
export function useResolvedProduct(): ResolvedProduct {
  const { manifests: _code, ...resolved } = useHost("useResolvedProduct").product;

  return resolved;
}

/**
 * Returns the product's toaster, so every toast of the product stacks in one region.
 */
export function useToaster(): Toaster {
  return useHost("useToaster").toaster;
}

/**
 * Returns the actions a component may ask of the host.
 */
export function useHostActions(): HostActions {
  const { quarantine } = useHost("useHostActions").stores;

  return {
    retry: (target) => {
      quarantine.retry(target);
    },
  };
}
