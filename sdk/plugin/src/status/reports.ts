/**
 * Reads what the build and the host reported, for a plugin that shows the host's state, such as the
 * inspector.
 */

import { type Problem } from "@stealthscale/sdk-core";

import { type HostReport } from "#host/report.ts";
import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";

/**
 * Describes what the build and the host reported.
 */
export interface HostReports {
  /**
   * The last runtime entries the host reported, oldest first.
   */
  readonly entries: readonly HostReport[];

  /**
   * The build's warnings, which did not fail it.
   */
  readonly warnings: readonly Problem[];
}

/**
 * Returns the build's warnings and the host's last runtime entries, and renders again when the host
 * reports an entry.
 */
export function useHostReports(): HostReports {
  const { product, stores } = useHost("useHostReports");
  const entries = useSelector([stores.reports], () => stores.reports.get());

  return { entries, warnings: product.warnings };
}
