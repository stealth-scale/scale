/**
 * Adds the specimens to the entries the dependency scan walks before a server starts serving.
 */

import { deps } from "@stealthscale/vite-config";
import { type Contribution } from "@stealthscale/vite-config-core";

import { renamed } from "#specimens.ts";

/**
 * Appends every specimen, and the application's own HTML, to the dependency scan's entries.
 *
 * @remarks
 *   A specimen is reached from the index through a dynamic import of a file outside the project
 *   root, and the scan follows neither. Left out, the first page a reader opens discovers its
 *   dependencies, re-optimises, and reloads the whole catalogue. Naming the entries disables Vite's
 *   own inference, which is why the HTML is named again beside them.
 * @param patterns - Where the specimens are, as the plugin's options state them.
 */
export function crawled(patterns: readonly string[]): readonly Contribution[] {
  return deps
    .crawl({
      because:
        "a specimen is reached through a dynamic import the dependency scan does not follow, so " +
        "its dependencies would be discovered by the first page opened and cost a reload",
      files: ["**/*.html", ...patterns],
    })
    .map((contribution) => renamed(contribution, "deps.crawl", "specimen.crawled"));
}
