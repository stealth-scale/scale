/**
 * Finds the directory a plugin's scratch for one package goes under, outside the workspace.
 *
 * @remarks
 *   A task runner fingerprints what a build reads and writes inside the workspace, and refuses to
 *   cache a build that did both to one file. A file a plugin writes for itself and reads back, a
 *   rendered configuration, a lock or a stamp, is neither an input nor an output of the build, so
 *   it goes under the system's temporary directory, in a directory named for the plugin and for the
 *   package's root.
 */

import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Finds the directory a plugin's scratch for one package goes under.
 *
 * @param plugin - The name the plugin's scratch goes under, such as `stealth-theme`.
 * @param root - The package's directory, absolute.
 * @returns A directory under the system's temporary directory, the same for the same root and
 *   another for another root, which nothing here creates.
 */
export function scratchDir(plugin: string, root: string): string {
  return join(tmpdir(), plugin, createHash("sha256").update(root).digest("hex").slice(0, 16));
}
