/**
 * Vite plugin that indexes specimen files and serves the catalogue's virtual modules.
 *
 * @remarks
 *   The plugin serves `virtual:specimen-index` and one `virtual:specimen-props/<id>` module per
 *   page. It appends a self-accepting HMR handler to each specimen module and a `source` export to
 *   each example module. It invalidates its generated modules when a watched file changes.
 */

import { readFileSync } from "node:fs";
import {
  type EnvironmentModuleGraph,
  type EnvironmentModuleNode,
  type Plugin,
  type UserConfig,
} from "vite";

import { type Settled, settled } from "#anatomy/reading.ts";
import { type Anatomy, type Compiler, type Store } from "#anatomy/types.ts";
import { type Changed, type Indexing, pageOf, pathOf, reindexes, retyped } from "#changed.ts";
import { accepting, anatomised, type Listed, listings, type Resolved, written } from "#emit.ts";
import { exampleModule } from "#example.ts";
import { found, roots } from "#found.ts";
import { ID, type Options, PROPS } from "#options.ts";
import { type Loading, stamped, stamps } from "#stamp.ts";

/**
 * Resolved ID of the index module, identical to its import specifier.
 *
 * @remarks
 *   Vite's convention prefixes virtual module IDs with `\0` so other plugins skip them. A bundled
 *   dev server registers a dynamically imported module under the unprefixed ID, so a prefixed ID
 *   resolves to nothing at runtime. No other plugin claims an extensionless specifier, which makes
 *   the unprefixed ID safe.
 */
const RESOLVED = ID;

/**
 * Resolved ID prefix of a page's props module. The page ID follows the prefix.
 */
const RESOLVED_PROPS = PROPS;

/**
 * Globs excluded from the dev server's file watcher.
 *
 * @remarks
 *   The plugin watches entire package trees, and test runs write coverage reports into them. Vite
 *   performs a full reload when a watched HTML file maps to no module. Without the exclusion, every
 *   test run reloads the catalogue.
 */
const OUTPUTS: readonly string[] = ["**/coverage/**"];

/**
 * Minimal dev server interface the plugin depends on.
 */
interface Watcher {
  /**
   * The dev server's file watcher.
   */
  readonly watcher: {
    /**
     * Adds paths to the watch set.
     */
    readonly add: (paths: readonly string[]) => void;
  };
}

/**
 * Minimal hot update payload the plugin depends on.
 */
interface Updated extends Changed {
  /**
   * Modules Vite resolved for the changed file.
   */
  readonly modules: readonly EnvironmentModuleNode[];
}

/**
 * Minimal `this` context of the `hotUpdate` hook.
 */
interface Watching {
  /**
   * Environment that reported the change.
   */
  readonly environment: {
    /**
     * Module graph used to look up generated modules by ID.
     */
    readonly moduleGraph: Pick<EnvironmentModuleGraph, "getModuleById">;
  };
}

/**
 * Minimal `this` context of the `watchChange` hook.
 */
interface Bundling {
  /**
   * Environment that reported the change, or undefined when Vite binds none.
   */
  readonly environment?: {
    /**
     * Resolved environment config.
     */
    readonly config: {
      /**
       * True for a build and for a dev server in full bundle mode.
       */
      readonly isBundled: boolean;
    };
  };
}

/**
 * Hook result with module code and no source map.
 */
interface Written {
  /**
   * Module code.
   */
  readonly code: string;

  /**
   * Always null. Generated code has no original source, and appended code leaves existing
   * positions unchanged.
   */
  readonly map: null;
}

/**
 * Mutable per-instance plugin state.
 */
interface State {
  /**
   * Vite's cache directory, under which the compiler writes the configurations of its programs.
   */
  cache: string;

  /**
   * Timer that stops the compiler once a dev server has read no props for {@link IDLE}
   * milliseconds, or undefined when none is pending.
   */
  idle: ReturnType<typeof setTimeout> | undefined;

  /**
   * Store of page anatomies, opened on the first props request.
   */
  keeping: Store | undefined;

  /**
   * Listing and page ID per file from the last index generation.
   */
  last: ReadonlyMap<string, Listed>;

  /**
   * Compiler, created on the first props request the store cannot serve.
   */
  opening: Promise<Compiler> | undefined;

  /**
   * Props reading settings, or undefined when props reading is disabled.
   */
  reading: Settled | undefined;

  /**
   * Root and command from the resolved config.
   */
  resolved: Resolved;

  /**
   * Absolute directories where the glob patterns start.
   */
  watched: readonly string[];
}

/**
 * Second argument of the `watchChange` hook.
 */
interface Change {
  /**
   * Change kind: `create`, `delete` or `update`.
   */
  readonly event: Changed["type"];
}

/**
 * Fields the plugin reads from the resolved config.
 */
interface Configured extends Resolved {
  /**
   * The directory Vite writes its caches under.
   */
  readonly cacheDir: string;
}

/**
 * Minimal environment argument of the `config` hook.
 */
interface Composing {
  /**
   * Bundler command. A build reports `build`.
   */
  readonly command: string;
}

/**
 * Invalidates generated modules after a file change in a bundled environment.
 *
 * @remarks
 *   `watchChange` provides a path without a reader, so the function reads updated files from disk.
 *   It rewrites the stamp when the change alters the listing or restarts the compiler. The bundler
 *   then reloads every module that watches the stamp.
 * @param state - Plugin state.
 * @param patterns - Glob patterns from the options.
 * @param file - Absolute path of the changed file.
 * @param type - Change kind.
 */
async function bundled(
  state: State,
  patterns: readonly string[],
  file: string,
  type: Changed["type"],
): Promise<void> {
  const reopened = await restarted(state, file);

  const changed: Changed = { file, read: () => readFileSync(file, "utf8"), type };

  if ((await reindexes(state, patterns, changed)) || reopened) stamped(state.resolved.root);
}

/**
 * Generates the index module, or the props module of one page.
 *
 * @remarks
 *   The store serves a page whose key is unchanged, and the compiler reads the rest. Both modules
 *   load on the first props request, so a repository without props reading never loads the
 *   TypeScript API, and one whose pages are all kept never starts it. Both generated modules
 *   register the stamp as a watch file.
 * @returns Module code, or undefined when the ID belongs to another plugin.
 * @throws {@link Error} When the patterns match no file, when a build cannot read a file, or when
 *   no listed page has the requested ID.
 */
async function generated(
  state: State,
  patterns: readonly string[],
  id: string,
  loading: Loading,
): Promise<string | undefined> {
  if (id === RESOLVED) {
    const files = found(state.resolved.root, patterns);

    state.last = listings(state.resolved, files, state.reading !== undefined);

    stamps(state.resolved.root, loading);

    return written(state.last);
  }

  if (!id.startsWith(RESOLVED_PROPS) || state.reading === undefined) return undefined;

  const page = id.slice(RESOLVED_PROPS.length);
  const path = pathOf(state, page);
  const reading = state.reading;
  const { store } = await import("#anatomy/cache.ts");

  stamps(state.resolved.root, loading);
  state.keeping ??= store(state.cache, reading);

  return anatomised(await state.keeping.anatomyOf(page, path, () => read(state, path, reading)));
}

/**
 * How long a dev server keeps the compiler after its last read, in milliseconds.
 *
 * @remarks
 *   The compiler keeps every program in memory, 1.4 GB for the catalogue, and a dev server spends
 *   most of its life on pages the store serves. Opening the programs again costs about 300 ms.
 */
const IDLE = 60_000;

/**
 * `command` value Vite reports for a dev server.
 */
const SERVING = "serve";

/**
 * Reads a page's anatomy through the compiler, and starts the compiler on the first read.
 *
 * @remarks
 *   In a dev server each read restarts the idle timer. A build keeps the compiler until the bundle
 *   closes.
 */
async function read(state: State, path: string, reading: Settled): Promise<Anatomy> {
  const { compiler } = await import("#anatomy/compiler.ts");

  state.opening ??= compiler(state.resolved.root, {
    cache: state.cache,
    specimens: () => listedPaths(state),
  });

  const anatomy = (await state.opening).anatomyOf(path, reading);

  if (state.resolved.command === SERVING) {
    clearTimeout(state.idle);
    state.idle = setTimeout(() => {
      void closed(state);
    }, IDLE).unref();
  }

  return anatomy;
}

/**
 * Stops the compiler, if one is running, and cancels the idle timer.
 */
async function closed(state: State): Promise<void> {
  clearTimeout(state.idle);
  state.idle = undefined;

  const held = await state.opening;

  held?.close();
  state.opening = undefined;
}

/**
 * Returns every page the last index listed, as absolute paths.
 */
function listedPaths(state: State): readonly string[] {
  return [...state.last].flatMap(([path, entry]) => (entry.id === undefined ? [] : [path]));
}

/**
 * Drops the store's hashes and restarts the compiler when the changed file is a typed file under a
 * watched directory.
 *
 * @returns True when a props module was served and the file is a typed file under a watched
 *   directory. False otherwise.
 */
async function restarted(state: State, file: string): Promise<boolean> {
  if (state.keeping === undefined || !retyped(state.watched, file)) return false;

  state.keeping.forget();
  (await state.opening)?.restart();

  return true;
}

/**
 * Returns the props modules to reload after a type change.
 *
 * @remarks
 *   The function returns every loaded props module instead of computing the affected pages. That
 *   analysis would cost more than the tens of milliseconds the compiler needs to regenerate the
 *   props of a page.
 * @returns Every loaded props module, or an empty array when the compiler did not restart.
 */
async function reread(
  state: State,
  file: string,
  graph: Watching["environment"]["moduleGraph"],
): Promise<EnvironmentModuleNode[]> {
  if (!(await restarted(state, file))) return [];

  return [...state.last.values()].flatMap((listed) => {
    const node =
      listed.id === undefined ? undefined : graph.getModuleById(`${RESOLVED_PROPS}${listed.id}`);

    return node === undefined ? [] : [node];
  });
}

/**
 * Build chunk that contains every props module.
 */
const PROPS_CHUNK = "props";

/**
 * Build chunk that contains every specimen page.
 */
const PAGES_CHUNK = "pages";

/**
 * `command` value Vite reports for a build.
 */
const BUILDING = "build";

/**
 * Returns the plugin's config contribution.
 *
 * @remarks
 *   Every command gets the watcher exclusions. A build also gets two code-splitting groups. One
 *   chunk per page produced 60 chunks in the docs build, from 1 kB to 55 kB and mostly under 2 kB
 *   gzipped. The `pages` group pulls in the dependencies of each page recursively. The `props`
 *   group holds the props modules, which the catalogue loads one page at a time. The group test
 *   strips the query that the lazy imports of the index add. A dev server gets no groups, because
 *   the React refresh preamble is in the entry chunk and a component in the pages chunk would call
 *   the refresh runtime before the preamble installs it. An array-valued `output` is returned
 *   unchanged, since the function cannot tell which entry holds the pages.
 * @param indexing - Latest index, which maps a file to its page.
 * @param stated - Config as declared by the repository.
 * @param command - Bundler command.
 */
function configured(indexing: Indexing, stated: UserConfig, command: string): UserConfig {
  const watched: UserConfig = { server: { watch: { ignored: [...OUTPUTS] } } };

  if (Array.isArray(stated.build?.rolldownOptions?.output) || command !== BUILDING) return watched;

  return {
    ...watched,
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              { name: PROPS_CHUNK, test: (id) => id.startsWith(RESOLVED_PROPS) },
              {
                includeDependenciesRecursively: true,
                name: PAGES_CHUNK,
                test: (id) => pageOf(indexing, id.replace(/\?.*$/su, "")) !== undefined,
              },
            ],
          },
        },
      },
    },
  };
}

/**
 * Appends generated code to specimen and example modules.
 *
 * @remarks
 *   A specimen module gets a self-accepting HMR handler that dispatches the new module to the
 *   catalogue. The index lists every specimen before the bundler transforms it, because the loaders
 *   in the index are its only importers. An example module gets its rewritten source as a `source`
 *   export. A request with a query targets the file's text, not its module, and passes through
 *   unchanged.
 * @param state - Plugin state, which maps a file to its page.
 * @param code - Module code from the preceding plugins.
 * @param id - Module ID, possibly with a query.
 * @returns The transformed code, or undefined for any other module.
 */
function appendedTo(state: State, code: string, id: string): undefined | Written {
  if (id.includes("?")) return undefined;

  const example = exampleModule(code, id);

  if (example !== undefined) return { code: example, map: null };

  const page = pageOf(state, id);

  return page === undefined ? undefined : { code: code + accepting(page, "module"), map: null };
}

/**
 * Creates the specimen plugin.
 *
 * @remarks
 *   The index is generated on first import and regenerated when a page is created, deleted or
 *   changes its declared metadata. An edit to a scene reloads the page without regenerating the
 *   index.
 * @param options - Search patterns and props reading settings. See {@link Options}.
 */
export function specimens(options: Options): Plugin {
  const state: State = {
    cache: `${process.cwd()}/node_modules/.vite`,
    idle: undefined,
    keeping: undefined,
    last: new Map(),
    opening: undefined,
    reading: options.props === undefined ? undefined : settled(options.props),
    resolved: { command: "build", root: process.cwd() },
    watched: [],
  };

  return {
    /**
     * Closes the compiler, if one is running.
     */
    async closeBundle(): Promise<void> {
      await closed(state);
    },

    /**
     * Returns the plugin's config contribution.
     *
     * @param stated - Config as declared by the repository.
     * @param env - Command and mode of the config.
     */
    config(stated: UserConfig, env: Composing): UserConfig {
      return configured(state, stated, env.command);
    },

    /**
     * Stores the resolved root, command and cache directory, and resolves the pattern roots.
     *
     * @remarks
     *   The root comes from the resolved config, not from `process.cwd()`. Under a task runner the
     *   working directory is the workspace root.
     */
    configResolved(config: Configured): void {
      state.cache = config.cacheDir;
      state.resolved = config;
      state.watched = roots(config.root, options.patterns);
    },

    /**
     * Adds the pattern roots to the dev server's watcher, including roots outside the project.
     */
    configureServer(server: Watcher): void {
      server.watcher.add([...state.watched]);
    },

    /**
     * Adds the plugin's generated modules to a hot update.
     *
     * @remarks
     *   Returning undefined defers to Vite's default handling. An update without an environment
     *   gets the default, because the plugin cannot reach its modules without a module graph.
     *   `watchChange` has already processed such a change.
     * @returns Modules to reload, or undefined when the change affects no generated module.
     */
    async hotUpdate(
      this: Watching,
      changed: Updated,
    ): Promise<EnvironmentModuleNode[] | undefined> {
      const environment: undefined | Watching["environment"] = this.environment;

      if (environment === undefined) return undefined;

      const graph = environment.moduleGraph;
      const reloaded = [...changed.modules, ...(await reread(state, changed.file, graph))];
      const index = (await reindexes(state, options.patterns, changed))
        ? graph.getModuleById(RESOLVED)
        : undefined;

      if (index !== undefined) reloaded.push(index);

      return reloaded.length === changed.modules.length ? undefined : reloaded;
    },

    /**
     * Loads the index module or the props module of a page.
     *
     * @remarks
     *   The null map is deliberate. Without it the bundler generates a source map for the generated
     *   code. Those maps were four fifths of the payload: 232 kB of map on a 289 kB index, and 4.3
     *   MB on the 5 MB of props of one compound component.
     * @returns Generated code with a null map, or undefined for another plugin's module.
     */
    async load(this: Loading, id: string): Promise<undefined | Written> {
      const code = await generated(state, options.patterns, id, this);

      return code === undefined ? undefined : { code, map: null };
    },

    name: "stealth:specimens",

    /**
     * Resolves the index specifier and the props specifiers.
     *
     * @returns The resolved ID, or undefined for any other specifier.
     */
    resolveId(id: string): string | undefined {
      if (id === ID) return RESOLVED;

      return id.startsWith(PROPS) ? id : undefined;
    },

    /**
     * Appends generated code to specimen and example modules. See {@link appendedTo}.
     *
     * @returns The transformed code, or undefined for any other module.
     */
    transform(code: string, id: string): undefined | Written {
      return appendedTo(state, code, id);
    },

    /**
     * Handles a file change reported by a bundled environment.
     *
     * @remarks
     *   A bundled dev server skips `hotUpdate` and reports every change here. The bundler owns the
     *   invalidation and reloads the modules that watch the stamp. An unbundled dev server reports
     *   changes to `hotUpdate`, so this hook returns immediately.
     * @param id - Absolute path of the changed file.
     * @param change - Change kind.
     */
    async watchChange(this: Bundling, id: string, change: Change): Promise<void> {
      if (this.environment?.config.isBundled !== true) return;

      await bundled(state, options.patterns, id, change.event);
    },
  };
}
