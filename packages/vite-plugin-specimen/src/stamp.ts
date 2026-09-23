/**
 * Stamp file that invalidates the plugin's generated modules in a bundled dev server.
 *
 * @remarks
 *   A bundled dev server has no `hotUpdate` hook and reloads a module only when one of its watch
 *   files changes. The set of indexed pages is not a file, so every generated module watches the
 *   stamp, and the plugin rewrites the stamp when the listing changes.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { scratchDir } from "@stealthscale/vite-plugin-base";

/**
 * Scratch directory name under the system temp directory.
 */
const SCRATCH = "stealth-specimen";

/**
 * Stamp file name.
 */
const STAMP = "index";

/**
 * Minimal `this` context of the `load` hook.
 */
export interface Loading {
  /**
   * Registers a file whose changes reload the module.
   */
  readonly addWatchFile: (file: string) => void;
}

/**
 * Returns the stamp file path for a project root.
 *
 * @param root - Project root from the resolved config.
 */
function stampOf(root: string): string {
  return join(scratchDir(SCRATCH, root), STAMP);
}

/**
 * Writes a new timestamp to the stamp file, creating its directory if needed.
 *
 * @remarks
 *   `process.hrtime.bigint()` has nanosecond resolution, so consecutive writes always differ.
 * @param root - Project root from the resolved config.
 */
export function stamped(root: string): void {
  const stamp = stampOf(root);

  mkdirSync(dirname(stamp), { recursive: true });
  writeFileSync(stamp, `${process.hrtime.bigint()}\n`);
}

/**
 * Registers the stamp as a watch file of the loading module, creating the stamp if needed.
 *
 * @remarks
 *   `watchChange` receives no module graph and cannot invalidate a module directly. Rewriting the
 *   stamp makes the bundler reload the modules that watch it.
 * @param root - Project root from the resolved config.
 * @param loading - `this` context of the `load` hook.
 */
export function stamps(root: string, loading: Loading): void {
  if (!existsSync(stampOf(root))) stamped(root);

  loading.addWatchFile(stampOf(root));
}
