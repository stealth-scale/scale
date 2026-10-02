/**
 * Imports a module through Vite, under the export conditions the application resolves with.
 *
 * @remarks
 *   A plugin that reads a workspace package at build time cannot import it through Node. Node
 *   resolves the package's `default` condition, which points at built output a fresh checkout has
 *   not produced yet. Vite resolves the conditions the application declares instead, and an import
 *   through a running dev server joins that server's module graph, so an edit to any file behind
 *   the module comes back to the plugin as a hot update.
 */

import { isAbsolute } from "node:path";
import {
  createRunnableDevEnvironment,
  isRunnableDevEnvironment,
  resolveConfig,
  type RunnableDevEnvironment,
  type ViteDevServer,
} from "vite";

/**
 * The name for the environment this module creates when no dev server is running.
 */
const NAME = "stealth";

/**
 * Where an import resolves from, and under which conditions.
 */
export interface Loading {
  /**
   * The export conditions to try, in order. Vite's server conditions apply when this is absent.
   */
  conditions?: readonly string[] | undefined;

  /**
   * The directory imports resolve from.
   */
  root: string;
}

/**
 * Describes one module an import loaded, with the namespace its evaluation produced.
 */
export interface Loaded {
  /**
   * The module's namespace object.
   */
  exports: Readonly<Record<string, unknown>>;

  /**
   * Absolute path of the module's file.
   */
  file: string;
}

/**
 * An imported module together with the files its evaluation read.
 */
export interface Imported<Module> {
  /**
   * Every file the module's evaluation read, its own first, as absolute paths. A module Vite
   * externalised is missing, because Node evaluated it and Vite read no file for it.
   */
  files: readonly string[];

  /**
   * Every module the import loaded, with its namespace, in the order the runner evaluates them:
   * each after every module it imports, the imported module last. A built-in is left out, because
   * its file is not a path.
   */
  loaded: readonly Loaded[];

  /**
   * The module's namespace object.
   */
  module: Module;
}

/**
 * Imports modules through one environment, so a caller loading several of them pays for the
 * environment once.
 *
 * @remarks
 *   Over a dev server's runner, `close` is a no-op, because the server created that environment and
 *   keeps it running. Over an environment this module built, `close` releases it, and nothing can
 *   be imported afterwards.
 */
export interface Importer {
  /**
   * Releases the environment the importer built, and leaves a server's own environment alone.
   */
  close: () => Promise<void>;

  /**
   * Imports one module and returns it with the files and the modules behind it.
   *
   * @throws {@link Error} When the specifier does not resolve or the module fails to evaluate.
   */
  import: <Module>(id: string) => Promise<Imported<Module>>;

  /**
   * Drops the transforms of the files given and every module the runner evaluated, so the next
   * import evaluates every module again and transforms the files given again.
   *
   * @remarks
   *   Over a dev server's runner it drops nothing, because the server invalidates its own modules.
   */
  invalidate: (files: readonly string[]) => void;
}

/**
 * The runner's evaluated-module registry, typed through the environment type so nothing here
 * imports a Vite subpath for it.
 */
type Evaluated = RunnableDevEnvironment["runner"]["evaluatedModules"];

/**
 * One module the runner evaluated.
 */
type Evaluation = NonNullable<ReturnType<Evaluated["getModuleById"]>>;

/**
 * Walks an evaluated module's imports and returns every module behind it, its own first.
 *
 * @remarks
 *   The walk follows the runner's own import records. A module imported along two paths is listed
 *   once.
 */
function modulesOf(evaluated: Evaluated, id: string): readonly Evaluation[] {
  const modules: Evaluation[] = [];
  const seen = new Set<string>();
  const queue = [id];

  for (let next = queue.shift(); next !== undefined; next = queue.shift()) {
    if (seen.has(next)) continue;

    seen.add(next);

    const node = evaluated.getModuleById(next);

    if (node === undefined) continue;

    modules.push(node);
    queue.push(...node.imports);
  }

  return modules;
}

/**
 * Returns every module behind an evaluated module in the order the runner evaluates them: each
 * after every module it imports, the module itself last.
 *
 * @remarks
 *   The walk is a depth-first search over the runner's import records, in the order each module
 *   imports. A module imported along two paths is listed once, where the first path finishes it.
 */
function evaluationOf(evaluated: Evaluated, id: string): readonly Evaluation[] {
  const order: Evaluation[] = [];
  const seen = new Set<string>();

  /**
   * Lists the modules behind one module, then the module itself.
   */
  const visit = (next: string): void => {
    const node = seen.has(next) ? undefined : evaluated.getModuleById(next);

    seen.add(next);

    if (node === undefined) return;

    for (const dependency of node.imports) visit(dependency);

    order.push(node);
  };

  visit(id);

  return order;
}

/**
 * Returns the files of the modules Vite transformed, leaving out every module it externalised.
 */
function filesOf(modules: readonly Evaluation[]): string[] {
  return modules.flatMap((node) =>
    node.meta === undefined || !("externalize" in node.meta) ? [node.file] : [],
  );
}

/**
 * Returns each module whose file is a path, with the namespace its evaluation produced.
 */
function loadedOf(modules: readonly Evaluation[]): Loaded[] {
  return modules.flatMap((node) => {
    if (!isAbsolute(node.file)) return [];

    const namespace: unknown = node.exports;
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the runner sets a namespace object on every module an import evaluated
    const exports = namespace as Readonly<Record<string, unknown>>;

    return [{ exports, file: node.file }];
  });
}

/**
 * Imports one module through an environment's runner.
 *
 * @remarks
 *   The specifier is resolved before the import because the runner records its modules under
 *   resolved ids, and {@link modulesOf} has to find the module again afterwards.
 */
async function through<Module>(
  environment: RunnableDevEnvironment,
  id: string,
): Promise<Imported<Module>> {
  const resolved = await environment.pluginContainer.resolveId(id);
  const target = resolved?.id ?? id;
  const module = await environment.runner.import<Module>(target);
  const { evaluatedModules } = environment.runner;

  return {
    files: filesOf(modulesOf(evaluatedModules, target)),
    loaded: loadedOf(evaluationOf(evaluatedModules, target)),
    module,
  };
}

/**
 * Builds a server environment rooted at the application and resolving under its conditions.
 *
 * @remarks
 *   `noExternal` covers everything, so a workspace package resolves through Vite under the
 *   declared conditions rather than through Node under its `default` one. The environment reads no
 *   config file and no env file, so it behaves the same wherever the plugin runs.
 */
async function environmentFor(loading: Loading): Promise<RunnableDevEnvironment> {
  const config = await resolveConfig(
    {
      configFile: false,
      envDir: false,
      environments: {
        [NAME]: {
          consumer: "server",
          dev: { moduleRunnerTransform: true },
          resolve: {
            ...(loading.conditions === undefined ? {} : { conditions: [...loading.conditions] }),
            mainFields: [],
            noExternal: true,
          },
        },
      },
      logLevel: "silent",
      root: loading.root,
    },
    "serve",
  );
  const environment = createRunnableDevEnvironment(NAME, config, {
    hot: false,
    runnerOptions: { hmr: { logger: false } },
  });

  await environment.init();

  return environment;
}

/**
 * Opens an importer over the dev server's runner when its `ssr` environment is runnable, and over
 * a fresh environment otherwise.
 *
 * @remarks
 *   Building an environment resolves a configuration and starts a module runner, which is why this
 *   is separate from {@link imported}: a plugin loading a statement and every preset behind it
 *   opens one importer for the batch and pays that cost once rather than once per module.
 *   Borrowing the server's runner also puts the modules on the server's graph, so an edit to any
 *   file behind them comes back as a hot update.
 */
export async function importer(loading: Loading, server?: ViteDevServer): Promise<Importer> {
  const running = server?.environments["ssr"];

  if (running !== undefined && isRunnableDevEnvironment(running)) {
    return {
      close: () => Promise.resolve(),
      import: <Module>(id: string): Promise<Imported<Module>> => through(running, id),
      invalidate: () => {},
    };
  }

  const environment = await environmentFor(loading);

  return {
    close: () => environment.close(),
    import: <Module>(id: string): Promise<Imported<Module>> => through(environment, id),
    invalidate: (files) => {
      for (const file of files) environment.moduleGraph.onFileChange(file);

      environment.runner.clearCache();
    },
  };
}

/**
 * Imports one module through Vite and returns it with the files behind it.
 *
 * @remarks
 *   Opens an importer for this one import and closes it afterwards. A caller with several modules
 *   to load should open one through {@link importer} instead and reuse it.
 * @param id - A file path or a bare specifier, resolved from `loading.root`.
 * @throws {@link Error} When the specifier does not resolve or the module fails to evaluate.
 */
export async function imported<Module>(
  id: string,
  loading: Loading,
  server?: ViteDevServer,
): Promise<Imported<Module>> {
  const opened = await importer(loading, server);

  try {
    return await opened.import<Module>(id);
  } finally {
    await opened.close();
  }
}
