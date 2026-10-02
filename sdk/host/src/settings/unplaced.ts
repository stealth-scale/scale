/**
 * Reports the settings sections that render on no settings page.
 */

import { useEffect, useRef } from "react";

import { useRouteContext } from "@stealthscale/provider-router";
import { useResolvedProduct } from "@stealthscale/sdk-plugin";

import { internalsOf } from "#host/internals.ts";
import { type HostRouterContext } from "#routes/context.ts";
import { unplacedOf } from "#settings/placement.ts";
import { useSections } from "#settings/use-sections.ts";

/**
 * Reports each section that renders on no page as `unplaced`, with its target page as the slot,
 * once while the caller is mounted.
 *
 * @remarks
 *   A section is unplaced where its plugin is on, its condition is true, its target page is not
 *   listed and its plugin has no listed page. A section that becomes unplaced after a change is
 *   reported then.
 */
export function useUnplacedReports(): void {
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const { report } = internalsOf(host).runtime;
  const { settings } = useResolvedProduct();
  const { listed, shown } = useSections();
  const unplaced = unplacedOf(shown, listed, settings.pages);
  const reported = useRef(new Set<string>());

  useEffect(() => {
    for (const { id, target } of unplaced) {
      if (!reported.current.has(id)) {
        reported.current.add(id);
        report({ kind: "unplaced", slot: target, target: id });
      }
    }
  });
}
