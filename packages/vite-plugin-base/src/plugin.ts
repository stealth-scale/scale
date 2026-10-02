/**
 * Builds a bundler plugin from a name and a single write step.
 *
 * @remarks
 *   A plugin written here takes the build as an argument instead of as `this`,
 *   so the write step can be an arrow function, a method, or a function two
 *   plugins share.
 */

import { type Plugin } from "vite";

export { type Plugin };

/**
 * Build a bundler binds to `this` while it generates a bundle.
 *
 * @remarks
 *   The type is taken from Vite's own `generateBundle` signature, so it follows
 *   whichever rolldown Vite resolves rather than a copy of the context that
 *   drifts away from it.
 */
export type Bundling = ThisParameterType<
  Extract<NonNullable<Plugin["generateBundle"]>, (...args: never[]) => unknown>
>;

/**
 * Narrows a resolved configuration to the one field a plugin built here reads.
 *
 * @remarks
 *   Naming the one field keeps the hook assignable across Vite releases, since
 *   the published `ResolvedConfig` gains members between minor versions.
 */
interface Resolved {
  /**
   * Project directory the bundler resolved, absolute.
   */
  root: string;
}

/**
 * A plugin's name and the single step that emits its output.
 */
export interface Stated {
  /**
   * Name the bundler reports in a build trace and in an error.
   */
  name: string;

  /**
   * Emits whatever the plugin contributes to the bundle.
   *
   * @remarks
   *   The call happens at `generateBundle`, where the module graph is complete
   *   and nothing has reached disk yet, so a file emitted here still lands in
   *   the output. A returned promise is awaited before the bundle is written.
   * @param bundling - Build to read the graph from and emit files through.
   * @param at - Project directory, which under a task runner differs from the
   *   working directory.
   */
  writes: (bundling: Bundling, at: string) => Promise<void> | void;
}

/**
 * Assembles a description into a plugin Vite, rolldown and rollup all accept.
 *
 * @remarks
 *   The directory handed to the write step starts as the working directory and
 *   is replaced once the bundler resolves a configuration. A build that never
 *   resolves one leaves the write step describing wherever the process started.
 * @returns A plugin whose write step runs once, at `generateBundle`.
 */
export function plugin(stated: Stated): Plugin {
  let at = process.cwd();

  return {
    /**
     * Records the directory the bundler resolved, for the write step to use.
     */
    configResolved(config: Resolved): void {
      at = config.root;
    },

    /**
     * Passes the finished module graph and the project directory to the write step.
     *
     * @remarks
     *   The promise a write step returns is passed straight back, so the
     *   bundler waits for an asynchronous write before it closes the bundle.
     */
    generateBundle(this: Bundling): Promise<void> | void {
      return stated.writes(this, at);
    },

    name: stated.name,
  };
}
