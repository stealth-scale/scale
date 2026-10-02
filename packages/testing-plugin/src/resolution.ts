/**
 * Resolves a plugin's standalone product, and reads what the build reports on one path of it.
 */

import { type Problem, type ResolveOptions, resolveProduct } from "@stealthscale/sdk-core";
import { standaloneProduct } from "@stealthscale/sdk-host/standalone";

import { packagesOf } from "#product.ts";
import { type Subject } from "#subject.ts";

/**
 * Describes the faults the build reports on a product.
 */
export interface Reports {
  /**
   * Faults that fail the build.
   */
  readonly problems: readonly Problem[];

  /**
   * Faults that do not fail the build.
   */
  readonly warnings: readonly Problem[];
}

/**
 * Resolves the standalone product of a plugin and the plugins beside it, and returns what the
 * build reports.
 *
 * @param subject - The plugin and the plugins beside it.
 * @param options - The catalogues the words checks read, where the case checks words.
 */
export function reportsOf(subject: Subject, options: ResolveOptions = {}): Reports {
  const definition = standaloneProduct(subject);
  const { problems, warnings } = resolveProduct(definition, packagesOf(definition), options);

  return { problems, warnings };
}

/**
 * Returns each fault at a path or under it, as the path and the reason.
 *
 * @param faults - The faults the build reported.
 * @param path - The path, such as `time-off.code` or `time-off.requires.0`.
 */
export function faultsAt(faults: readonly Problem[], path: string): readonly string[] {
  return faults
    .filter((one) => one.path === path || one.path.startsWith(`${path}.`))
    .map((one) => `${one.path} ${one.reason}`);
}

/**
 * Throws an error that lists the faults, where there is one.
 *
 * @throws {@link Error} Listing every fault, one per line.
 */
export function validateEmpty(faults: readonly string[]): void {
  if (faults.length > 0) throw new Error(faults.join("\n"));
}

/**
 * Runs a case's synchronous work, so a throw rejects the case's promise.
 *
 * @param work - The checks, which throw on a fault.
 */
export function checking(work: () => void): Promise<void> {
  return new Promise((resolve) => {
    work();
    resolve();
  });
}
