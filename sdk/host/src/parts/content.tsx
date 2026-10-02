/**
 * Renders the page a person is on inside the `content` region.
 */

import { type ReactNode } from "react";

import { Outlet } from "@stealthscale/provider-router";
import { hostContract } from "@stealthscale/sdk-core";
import { Slot } from "@stealthscale/sdk-plugin";

/**
 * Renders the root route's outlet inside the `content` region, so the region's extensions decorate
 * every page.
 *
 * @remarks
 *   The frame renders it where the page belongs. A frame that renders `Outlet` in its place renders
 *   pages without the region, and the extension statuses read the region as not mounted.
 */
export function HostContent(): ReactNode {
  return (
    <Slot slot={hostContract.slots.content}>
      <Outlet />
    </Slot>
  );
}
