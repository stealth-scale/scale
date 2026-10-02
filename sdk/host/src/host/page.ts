/**
 * Creates the host's stores of what the page renders and what went wrong: the quarantine, the
 * mounted slots, the page contributions and the reports, with the function that reports an entry.
 */

import {
  type HostReport,
  type MountedStore,
  type PageStore,
  type QuarantineStore,
} from "@stealthscale/sdk-plugin";

import { createMountedStore } from "#stores/mounted.ts";
import { createPageStore } from "#stores/pages.ts";
import { createQuarantineStore } from "#stores/quarantine.ts";
import { createReportStore, type ReportStore } from "#stores/reports.ts";

/**
 * Lists the page's stores, which the hooks of `sdk-plugin` read.
 */
export interface PageStores {
  /**
   * The slots on screen.
   */
  readonly mounted: MountedStore;

  /**
   * The contributions of the pages on screen.
   */
  readonly pages: PageStore;

  /**
   * The quarantined targets.
   */
  readonly quarantine: QuarantineStore;

  /**
   * The last entries the host reported.
   */
  readonly reports: ReportStore;
}

/**
 * Lists the page's stores and its report.
 */
export interface Page {
  /**
   * Adds an entry to the reports store and passes it to the product's receiver.
   */
  readonly report: (entry: HostReport) => void;

  /**
   * The page's stores.
   */
  readonly stores: PageStores;
}

/**
 * Lists what the page's stores are created from.
 */
export interface PageOptions {
  /**
   * Failed renders in a row after which a target is quarantined.
   */
  readonly quarantineAfter?: number | undefined;

  /**
   * Receives every entry. The console where left out.
   */
  readonly report?: ((entry: HostReport) => void) | undefined;
}

/**
 * Failed renders in a row after which a target is quarantined, where the product states none.
 */
const QUARANTINE_AFTER = 3;

/**
 * The prefix of every line the host writes to the console.
 */
const PREFIX = "[host]";

/**
 * Writes an entry to the console: as an error where the entry has an error, else as a warning.
 */
export function toConsole(entry: HostReport): void {
  if ("error" in entry) console.error(`${PREFIX} ${entry.kind}`, entry);
  else console.warn(`${PREFIX} ${entry.kind}`, entry);
}

/**
 * Returns the page's stores, empty, and the function that reports an entry into them.
 */
export function createPage({
  quarantineAfter = QUARANTINE_AFTER,
  report: receiver = toConsole,
}: PageOptions): Page {
  const reports = createReportStore();

  /**
   * Adds an entry to the reports store and passes it to the receiver.
   */
  const report = (entry: HostReport): void => {
    reports.add(entry);
    receiver(entry);
  };

  return {
    report,
    stores: {
      mounted: createMountedStore(),
      pages: createPageStore(),
      quarantine: createQuarantineStore({ after: quarantineAfter, report }),
      reports,
    },
  };
}
