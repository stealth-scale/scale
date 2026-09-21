/**
 * Generates the runtime the design-system package publishes, out of the preset that package
 * publishes.
 *
 * @remarks
 *   Exactly one package in a workspace generates this runtime. It declares the tokens as types, so
 *   a second copy would be a second vocabulary, and a component would bind to whichever one it
 *   happened to import. Two plugins share a single generation service: the Vite plugin generates
 *   when the config resolves and again on a hot update, and the packer's plugin generates when a
 *   file behind the preset changes under a watching pack build, which runs no Vite hook at all.
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
 * The file the rendered config is written to, under the package's scratch directory.
 */
const CONFIG = "runtime.config.mjs";

/**
 * The shape of the module a package publishes its preset as.
 */
interface Module {
  /**
   * The preset. Absent when the module has no default export.
   */
  default?: object | undefined;
}

/**
 * The generation service: one runtime generation per call, taken under the package's lock.
 */
export interface Generator {
  /**
   * Loads the package's own preset, renders the config, and runs codegen into the generated
   * directory, holding the package's lock from the first read through to the last write.
   *
   * @throws {@link Error} When the package publishes no preset under `./theme`, the preset exports
   *   no default, or another process holds the lock for longer than the wait.
   */
  generate: () => Promise<void>;

  /**
   * Where the package is and which conditions it resolves under. Set before the first generation.
   */
  loading: Loading;

  /**
   * The files the last generation read. Empty before the first generation.
   */
  readonly watching: readonly string[];
}

/**
 * The state a generator carries between generations.
 */
interface Generating {
  /**
   * Where the package is and which conditions it resolves under.
   */
  loading: Loading;

  /**
   * The files the last generation read.
   */
  watching: readonly string[];
}

/**
 * Runs one generation, start to finish, under the package's lock.
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
 * Builds the generation service both plugins share.
 *
 * @remarks
 *   The lock is held from loading the preset through to publishing the runtime, so a second process
 *   in the same checkout waits instead of reading a config this one is midway through writing, or
 *   deleting files this one is publishing. Files whose content did not change keep their mtimes, so
 *   a regeneration only wakes the watcher for the files a change actually reached.
 */
export function generator(options: RuntimeOptions = {}): Generator {
  const { layers } = resolveOptions(options);
  const state: Generating = { loading: { root: process.cwd() }, watching: [] };

  return {
    generate: () => generated(state, layers),

    /**
     * Reads where the package is and which conditions it resolves under.
     */
    get loading(): Loading {
      return state.loading;
    },

    /**
     * Records where the package is and which conditions it resolves under.
     */
    set loading(value: Loading) {
      state.loading = value;
    },

    /**
     * Lists the files the last generation read.
     */
    get watching(): readonly string[] {
      return state.watching;
    },
  };
}

/**
 * Builds the plugin that generates the design-system package's runtime, and regenerates it when the
 * preset changes.
 *
 * @remarks
 *   Generation happens as soon as the package's root is known rather than at the start of a build,
 *   because the package's own source imports what this writes, and both the packer and the test
 *   runner resolve those imports without ever starting a build. A type check resolves no plugin at
 *   all, so it reads whatever the last build or test run left behind.
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
     * Records where the package is and which conditions it resolves under, then generates.
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
     * Regenerates when a file behind the preset changes, and leaves every other change to Vite.
     */
    async hotUpdate(context) {
      if (!shared.watching.includes(context.file)) return context.modules;

      await shared.generate();

      return context.modules;
    },
  };
}

/**
 * Builds the plugin the packer runs: it generates the runtime before the packer resolves an import,
 * and regenerates it when a file behind the preset changes under a watching pack build.
 *
 * @remarks
 *   The packer takes its plugins from `pack.plugins` and runs no hook belonging to a top-level Vite
 *   plugin, neither the resolution that generates for a dev server and a test runner nor the hot
 *   update that regenerates. Packing a checkout nothing has generated in would resolve the runtime
 *   imports to nothing and publish a package importing files it does not ship. So the first build
 *   of a pack generates, ahead of any resolution, and later builds under a watching pack read what
 *   that generation wrote.
 * @param shared - The generation service the Vite plugin generates with.
 * @param loading - Where the package is and which conditions it resolves under, passed here because
 *   the packer runs no hook that would tell the service. The service's own record stands where this
 *   is absent.
 */
export function packed(shared: Generator, loading?: Loading): Plugin {
  return {
    name: "stealth:theme.runtime(pack)",

    /**
     * Generates where nothing has generated yet, then watches every file the preset was loaded
     * from.
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
