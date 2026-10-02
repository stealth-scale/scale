/**
 * Renders the root route's component: the `layout` region around the product's frame, and the
 * `overlay` region after it with the palette and the toast region.
 */

import { type ReactNode } from "react";

import { useRouteContext } from "@stealthscale/provider-router";
import { hostContract } from "@stealthscale/sdk-core";
import { Slot } from "@stealthscale/sdk-plugin";

import { CommandKeys } from "#commands/keys.ts";
import { CommandPalette } from "#commands/palette.tsx";
import { internalsOf } from "#host/internals.ts";
import { LastBoundary } from "#parts/last-boundary.ts";
import { HostToasts } from "#parts/toasts.tsx";
import { type HostRouterContext } from "#routes/context.ts";

/**
 * Describes the props of `HostRoot`.
 */
export interface HostRootProps {
  /**
   * The product's frame.
   */
  readonly children?: ReactNode;
}

/**
 * Renders the product's frame inside the `layout` region, the `overlay` region after it, and the
 * keys of the product's commands.
 *
 * @remarks
 *   The router renders the root route's component inside a catch boundary of its own, so the
 *   component renders the host's last boundary around the frame, and an error in the frame
 *   renders the failure page and is reported with the target `host`.
 */
export function HostRoot({ children }: HostRootProps): ReactNode {
  const { host }: HostRouterContext = useRouteContext({ strict: false });

  return (
    <LastBoundary runtime={internalsOf(host).runtime}>
      <Slot slot={hostContract.slots.layout}>{children}</Slot>
      <Slot slot={hostContract.slots.overlay}>
        <CommandPalette />
        <HostToasts />
      </Slot>
      <CommandKeys />
    </LastBoundary>
  );
}
