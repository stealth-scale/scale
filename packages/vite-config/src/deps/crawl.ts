/**
 * Adds files to Vite's dependency scan that it would not otherwise walk.
 *
 * @remarks
 *   Vite scans from the HTML entries it discovers, so it never reaches a module loaded some other
 *   way, such as a story or a preview harness, nor that module's imports.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

/**
 * Gives the configuration path of the entry list Vite's dependency scan walks before serving.
 */
const AT = "optimizeDeps.entries";

/**
 * Declares the files to add to the dependency scan and why Vite misses them.
 */
export interface Crawled {
  /**
   * Gives the reason Vite's scan does not reach these files, for the contribution record.
   */
  because: string;

  /**
   * Lists the files by path or glob. Vite resolves each one against the project root, and the
   * value reaches it as written.
   */
  files: readonly string[];
}

/**
 * Adds each file to the entry list the dependency scan walks before the server starts.
 *
 * @remarks
 *   A dependency Vite first reaches mid-session forces a second optimise pass and a full page
 *   reload. A file listed here moves that discovery into startup.
 * @returns One contribution per file, in the order they were given.
 */
export function crawl(stated: Crawled): readonly Contribution[] {
  return stated.files.map((held) =>
    contribute({ at: AT, because: stated.because, item: held, name: `deps.crawl(${held})` }),
  );
}
