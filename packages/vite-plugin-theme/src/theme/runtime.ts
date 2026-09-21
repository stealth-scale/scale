/**
 * Generates the runtime the design-system package publishes, from the preset it publishes.
 *
 * @remarks
 *   Exactly one package in a workspace does this. The runtime carries the tokens as types, so a
 *   second copy would be a second vocabulary, and a component would be bound to whichever one it
 *   imported. The generation is a service the two plugins share: the Vite plugin generates when
 *   the configuration resolves and again on a hot update, and the packer's plugin generates again
 *   when a file behind the preset changes under a watching pack build, which runs no Vite hook.
 */

import { join } from "node:path";
import { type Plugin } from "vite";

import { imported, type Loading, withLock, writeIfChanged } from "@stealthscale/vite-plugin-base";

import { basePreset, generateRuntime } from "#compiler.ts";
import { renderRuntimeConfig } from "#config.ts";
import { GENERATED, LOCK, resolveOptions, type RuntimeOptions, scratchDir } from "#options.ts";
import { type StylesheetLayers } from "#pandacss.ts";
import { presetEntry } from "#statement.ts";

/**
 * Fixes the file the rendered configuration is written to, under the package's scratch.
 */
const CONFIG = "runtime.config.mjs";

/**
 * The module the package's preset turns out to be once imported.
 */
interface Module {
  /**
   * The preset, or nothing where the module exports no default.
   */
  default?: object | undefined;
}

/**
 * Generates the runtime of the design-system package, once per call and under a lock.
 */
export interface Generator {
  /**
   * Loads the package's own preset, renders the configuration, and runs codegen into the generated
   * directory, holding the package's lock from the first read to the last write.
   *
   * @throws {@link Error} When the package publishes no preset under `./theme`, the preset exports
   *   no default, or another process holds the lock for longer than the wait.
   */
  generate: () => Promise<void>;

  /**
   * Where the package is and under which conditions it resolves. Set before the first generation.
   */
  loading: Loading;

  /**
   * Every file the preset was loaded from and the configuration was bundled from, after a
   * generation, and nothing before one.
   */
  readonly watching: readonly string[];
}

/**
 * Carries what a generator holds between generations.
 */
interface Generating {
  /**
   * Where the package is and under which conditions it resolves.
   */
  loading: Loading;

  /**
   * Every file the last generation read.
   */
  watching: readonly string[];
}

/**
 * Runs one generation under the package's lock.
 *
 * @throws {@link Error} When the package publishes no preset under `./theme`, or the preset
 *   exports no default.
 */
async function generated(state: Generating, layers: StylesheetLayers): Promise<void> {
  const { root } = state.loading;
  const entry = presetEntry(root, state.loading.conditions ?? []);

  if (entry === undefined) throw new Error(`${root} publishes no preset under ./theme`);

  await withLock(join(scratchDir(root), LOCK), async () => {
    const { files, module } = await imported<Module>(entry, state.loading);

    if (module.default === undefined) throw new Error(`${entry} exports no default`);

    const configPath = join(scratchDir(root), CONFIG);

    writeIfChanged(
      configPath,
      renderRuntimeConfig({ base: basePreset(), foundation: module.default, layers }),
    );

    const compiler = await generateRuntime(root, configPath, join(root, GENERATED));

    state.watching = [...new Set([...files, ...compiler.dependencies])];
  });
}

/**
 * Builds the generation service the plugins share.
 *
 * @remarks
 *   The lock is held from loading the preset to publishing the runtime, so a second process in the
 *   same checkout waits rather than reading a configuration this one is writing or deleting the
 *   files this one is publishing. A file whose content did not change is left as it was, so a
 *   regeneration wakes the watcher for the files a change reached and no others.
 */
export function generator(options: RuntimeOptions = {}): Generator {
  const { layers } = resolveOptions(options);
  const state: Generating = { loading: { root: process.cwd() }, watching: [] };

  return {
    generate: () => generated(state, layers),

    /**
     * Reads where the package is and under which conditions it resolves.
     */
    get loading(): Loading {
      return state.loading;
    },

    /**
     * Records where the package is and under which conditions it resolves.
     */
    set loading(value: Loading) {
      state.loading = value;
    },

    /**
     * Lists every file the last generation read.
     */
    get watching(): readonly string[] {
      return state.watching;
    },
  };
}

/**
 * Builds the plugin that generates the design-system package's runtime and regenerates it when
 * the preset changes.
 *
 * @remarks
 *   The runtime is generated as soon as the package's root is known rather than at the start of a
 *   build, because the package's own source imports what this writes: a packer and a test runner
 *   both resolve those imports without starting a build. A type check resolves no plugin at all,
 *   so it reads what the last build or test run generated.
 * @param options - The layer names, where the package departs from the defaults.
 * @param shared - The generation service, where the packer's plugin shares one.
 */
export function runtime(
  options: RuntimeOptions = {},
  shared: Generator = generator(options),
): Plugin {
  return {
    name: "stealth:theme.runtime",

    /**
     * Records where the package is and under which conditions it resolves, and generates.
     */
    async configResolved(config) {
      shared.loading = { conditions: config.ssr.resolve?.conditions, root: config.root };
      await shared.generate();
    },

    /**
     * Watches every file the preset was loaded from, so a token added there reaches the runtime.
     */
    buildStart() {
      for (const file of shared.watching) this.addWatchFile(file);
    },

    /**
     * Regenerates when a file behind the preset changes, and leaves any other change to Vite.
     */
    async hotUpdate(context) {
      if (!shared.watching.includes(context.file)) return context.modules;

      await shared.generate();

      return context.modules;
    },
  };
}

/**
 * Builds the plugin the packer runs, which generates the runtime before the packer resolves an
 * import and regenerates it when a file behind the preset changes under a watching pack build.
 *
 * @remarks
 *   The packer takes its plugins from `pack.plugins` and runs no hook of a top-level Vite plugin,
 *   neither the resolution that generates for a dev server and a test runner nor the hot update
 *   that regenerates. A pack of a checkout nothing generated in would then resolve the runtime
 *   imports to nothing and write a package that imports files it does not carry. So the first
 *   build of a pack generates, before the packer resolves an import, and a later build under a
 *   watching pack reads what the last generation or a preset change wrote.
 * @param shared - The generation service the Vite plugin generates with.
 * @param loading - Where the package is and under which conditions it resolves, told here because
 *   the packer runs no hook that tells the service. The service's own record stands where absent.
 */
export function packed(shared: Generator, loading?: Loading): Plugin {
  return {
    name: "stealth:theme.runtime(pack)",

    /**
     * Generates where nothing generated yet, and watches every file the preset was loaded from.
     */
    async buildStart() {
      if (shared.watching.length === 0) {
        if (loading !== undefined) shared.loading = loading;

        await shared.generate();
      }

      for (const file of shared.watching) this.addWatchFile(file);
    },

    /**
     * Regenerates when a file behind the preset changes.
     */
    async watchChange(id) {
      if (shared.watching.includes(id)) await shared.generate();
    },
  };
}
