/**
 * Locates a plugin's scratch directory for one package, outside the workspace.
 *
 * @remarks
 *   A task runner fingerprints what a build reads and writes inside the workspace, and refuses to
 *   cache a build that did both to the same file. A rendered configuration, a lock or a stamp that
 *   a plugin writes for itself and reads back is neither an input nor an output of the build, so
 *   it belongs outside the workspace entirely: under the system's temporary directory, in a
 *   directory keyed by the plugin and the package root.
 */

import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Returns the scratch directory for one plugin and one package.
 *
 * @remarks
 *   The package root is hashed rather than used as a path, so two checkouts of the same repository
 *   get separate scratch directories and neither path length nor path characters can break.
 * @param plugin - The name the plugin's scratch goes under, such as `stealth-theme`.
 * @param root - The package's directory, absolute.
 * @returns A path under the system's temporary directory. The directory is not created here.
 */
export function scratchDir(plugin: string, root: string): string {
  return join(tmpdir(), plugin, createHash("sha256").update(root).digest("hex").slice(0, 16));
}
