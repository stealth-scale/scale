/**
 * Vite plugin for specimen files: matches the configured globs, serves the index and each page's
 * props as virtual modules, and invalidates them when a file changes.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  type EnvironmentModuleGraph,
  type EnvironmentModuleNode,
  type Plugin,
  type UserConfig,
} from "vite";

import { scratchDir } from "@stealthscale/vite-plugin-base";

import { type Settled, settled } from "#anatomy/reading.ts";
import { type Compiler } from "#anatomy/types.ts";
import { type Changed, type Indexing, pageOf, pathOf, reindexes, retyped } from "#changed.ts";
import { accepting, anatomised, type Listed, listings, type Resolved, written } from "#emit.ts";
import { found, roots } from "#found.ts";
import { ID, type Options, PROPS } from "#options.ts";

/**
 * Resolved id of the index module, which is the import specifier unchanged.
 *
 * @remarks
 *   Vite's convention is to prefix a virtual module's resolved id with NUL so that other plugins
 *   skip it. That breaks under a server that bundles: it registers a dynamically imported module
 *   under the id without the NUL, and its runtime then finds nothing behind the prefixed one.
 *   Dropping the prefix is safe here because no other plugin claims a specifier with no extension.
 */
const RESOLVED = ID;

/**
 * Resolved id prefix for a page's props, with the page's identifier appended to it.
 */
const RESOLVED_PROPS = PROPS;

/**
 * Globs excluded from the dev server's file watcher.
 *
 * @remarks
 *   The plugin hands the watcher whole package trees, which contain the coverage report a test run
 *   writes. Vite reloads the page in full when a watched HTML file resolves to no module, so
 *   without this exclusion a test run reloads the catalogue.
 */
const OUTPUTS: readonly string[] = ["**/coverage/**"];

/**
 * Directory name the plugin's scratch space takes under the system temporary directory.
 */
const SCRATCH = "stealth-specimen";

/**
 * File whose modification time stands in for a change to the set of indexed pages.
 *
 * @remarks
 *   The index module declares this file as a dependency. A server that bundles runs no hot update
 *   hook and regenerates a module only when a file that module declared changes, so the plugin
 *   writes here whenever a page appears, disappears, or declares different metadata. A module can
 *   only declare real files, and the set of pages the patterns match is not one.
 */
const STAMP = "index";

/**
 * The part of a dev server the plugin uses.
 *
 * @remarks
 *   Narrower than Vite's own type, so a test can pass a watcher instead of a whole server.
 */
interface Watcher {
  /**
   * The server's file watcher, which the plugin registers extra directories on.
   */
  readonly watcher: {
    /**
     * Registers directories, so that files appearing under them are reported.
     */
    readonly add: (paths: readonly string[]) => void;
  };
}

/**
 * The part of a hot update the plugin uses, on top of the fields {@link Changed} declares.
 *
 * @remarks
 *   Narrower than Vite's own type, which also carries the dev server. Leaving it out lets a test
 *   build an update without one.
 */
interface Updated extends Changed {
  /**
   * The modules Vite already resolved for the changed file.
   */
  readonly modules: readonly EnvironmentModuleNode[];
}

/**
 * The part of the environment the update hook reads off `this`.
 */
interface Watching {
  /**
   * The environment the change was reported in.
   */
  readonly environment: {
    /**
     * The module graph, used to look up whether a module has been loaded.
     */
    readonly moduleGraph: Pick<EnvironmentModuleGraph, "getModuleById">;
  };
}

/**
 * The part of the environment the watch change hook reads off `this`.
 */
interface Bundling {
  /**
   * The environment the change was reported in, absent when Vite binds none.
   */
  readonly environment?: {
    /**
     * The resolved configuration, narrowed to the one flag read here.
     */
    readonly config: {
      /**
       * True under a build and under a dev server that bundles, false when the server serves one
       * module per file.
       */
      readonly isBundled: boolean;
    };
  };
}

/**
 * A generated module's source, with its source map suppressed.
 */
interface Written {
  /**
   * The source of the generated module.
   */
  readonly code: string;

  /**
   * Always null: the module was generated rather than transformed, so there is nothing to map.
   */
  readonly map: null;
}

/**
 * The mutable state one plugin instance carries across hook calls.
 */
interface State {
  /**
   * Listing and page identifier per file, as of the last time the index was generated.
   */
  last: ReadonlyMap<string, Listed>;

  /**
   * The compiler, started on the first request for a page's props.
   */
  opening: Promise<Compiler> | undefined;

  /**
   * The props reading settled from the options, or undefined when the repository reads no props.
   */
  reading: Settled | undefined;

  /**
   * The root and command taken from the resolved configuration.
   */
  resolved: Resolved;

  /**
   * The absolute directories the patterns start searching in.
   */
  watched: readonly string[];
}

/**
 * The second argument the watch change hook receives, beside the file.
 */
interface Change {
  /**
   * The kind of change: a creation, a deletion, or an edit.
   */
  readonly event: Changed["type"];
}

/**
 * The part of the config hook's environment argument the plugin reads.
 *
 * @remarks
 *   Narrower than Vite's own type, so a test can pass the command alone.
 */
interface Composing {
  /**
   * The command the bundler is running. A build runs `build`.
   */
  readonly command: string;
}

/**
 * Returns the absolute path of the stamp file for the resolved root.
 */
function stampOf(state: State): string {
  return join(scratchDir(SCRATCH, state.resolved.root), STAMP);
}

/**
 * Writes a new timestamp into the stamp file, creating its directory when it is absent.
 *
 * @remarks
 *   `process.hrtime.bigint` has nanosecond resolution, so two writes within the same millisecond
 *   still produce different content.
 */
function stamped(state: State): void {
  const stamp = stampOf(state);

  mkdirSync(dirname(stamp), { recursive: true });
  writeFileSync(stamp, `${process.hrtime.bigint()}\n`);
}

/**
 * Declares the stamp as a file a generated module depends on, writing it where it is absent.
 *
 * @remarks
 *   The stamp is the only way a server that bundles reaches a module this plugin generated. That
 *   server reports a change to `watchChange`, which is handed a configuration and no module graph
 *   and so can invalidate nothing itself. It writes a new stamp instead, and the bundler loads
 *   every module that declared the stamp again.
 *   Both generated modules declare it. The index is regenerated when the listing changes, and a
 *   page's props when the compiler was restarted, which is what an edit to a file it reads does.
 */
function stamps(state: State, loading: Loading): void {
  if (!existsSync(stampOf(state))) stamped(state);

  loading.addWatchFile(stampOf(state));
}

/**
 * Brings a server that bundles up to date with one changed file.
 *
 * @remarks
 *   The watch change hook passes a path and no reader, so the change is given a reader that opens
 *   the file itself. Only an edit is ever read, which is why a deleted path never reaches the file
 *   system.
 *   A new stamp is written for either of two changes, because each leaves a generated module
 *   holding what a file no longer says. A change to the listing is the index's. A change to a file
 *   the compiler reads is a page's props: the compiler is restarted so the next read is fresh, and
 *   without a new stamp nothing ever asks for that read and the props a reader sees are the ones
 *   the server generated when it started.
 */
async function bundled(
  state: State,
  patterns: readonly string[],
  file: string,
  type: Changed["type"],
): Promise<void> {
  const reopened = await restarted(state, file);

  const changed: Changed = { file, read: () => readFileSync(file, "utf8"), type };

  if ((await reindexes(state, patterns, changed)) || reopened) stamped(state);
}

/**
 * The part of the load hook's context the plugin reads off `this`.
 */
interface Loading {
  /**
   * Declares a file the loaded module depends on, so that changing it loads the module again.
   */
  readonly addWatchFile: (file: string) => void;
}

/**
 * Generates the source for one resolved id: either the index or one page's props.
 *
 * @remarks
 *   The compiler module is imported on the first request for props and the compiler it opens is
 *   cached on the state, so a repository that states no reading never loads the TypeScript API.
 *   The index declares the stamp here because the load hook is the only place the plugin is given
 *   a context to declare it through.
 * @returns The generated source, or undefined when the identifier is not this plugin's.
 * @throws {@link Error} When the patterns match nothing, a build meets a file it cannot read, or
 *   no listed page has the requested identifier.
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

    stamps(state, loading);

    return written(state.last);
  }

  if (!id.startsWith(RESOLVED_PROPS) || state.reading === undefined) return undefined;

  const path = pathOf(state, id.slice(RESOLVED_PROPS.length));
  const { compiler } = await import("#anatomy/compiler.ts");

  stamps(state, loading);
  state.opening ??= compiler(state.resolved.root);

  return anatomised((await state.opening).anatomyOf(path, state.reading));
}

/**
 * Restarts the compiler when the changed file is one it reads.
 *
 * @remarks
 *   No compiler exists until a page's props have been asked for, so every change before that
 *   request passes through untouched.
 * @returns True when the compiler restarted, false when none was open or the file is not a typed
 *   one under a searched directory.
 */
async function restarted(state: State, file: string): Promise<boolean> {
  if (state.opening === undefined || !retyped(state.watched, file)) return false;

  (await state.opening).restart();

  return true;
}

/**
 * Collects the props modules a hot update has to reload after a type change.
 *
 * @remarks
 *   Every props module the graph has loaded is returned, whether or not the changed file reaches
 *   it. Working out which pages a type change reaches would cost more than the tens of
 *   milliseconds the compiler takes to answer a page again.
 * @returns Each loaded props module, or an empty array when the compiler did not restart.
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
 * Name of the build chunk holding every page's props.
 */
const PROPS_CHUNK = "props";

/**
 * Name of the build chunk holding every page.
 */
const PAGES_CHUNK = "pages";

/**
 * The `command` value Vite reports when it is running a build.
 */
const BUILDING = "build";

/**
 * Returns the configuration the plugin contributes: the watcher's exclusions always, and a build's
 * two chunk groups.
 *
 * @remarks
 *   One chunk per page produced sixty chunks in the docs build, from one kilobyte to fifty-five
 *   and most under two gzipped, each one its own request. The pages group pulls in what each page
 *   depends on, so a component a single page reaches ships with that page. Props take a second
 *   group, because a reader opens one page's props at a time. The index imports a page lazily
 *   under a query, which the test strips before it looks the page up. Only a build takes the
 *   groups: a dev server folds the React plugin's refresh preamble into the entry chunk, and a
 *   component in the pages chunk then reaches the refresh runtime before the preamble installs it
 *   and throws. An output the repository stated as an array is left alone, since writing a group
 *   into one entry of it would be a guess at which entry holds the pages.
 * @param indexing - The index as last generated, which maps a file to its page.
 * @param stated - The configuration as the repository stated it.
 * @param command - The command the bundler is running. A build runs `build`.
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
 * Creates the plugin that indexes the specimens the patterns match and serves that index as a
 * virtual module.
 *
 * @remarks
 *   The index is generated when a catalogue first imports it, and again whenever a page appears,
 *   disappears, or changes the metadata it declares. Editing a scene reloads its page and leaves
 *   the index alone.
 * @param options - Where to search, and whether to read props. {@link Options} Documents every
 *   member.
 */
export function specimens(options: Options): Plugin {
  const state: State = {
    last: new Map(),
    opening: undefined,
    reading: options.props === undefined ? undefined : settled(options.props),
    resolved: { command: "build", root: process.cwd() },
    watched: [],
  };

  return {
    /**
     * Shuts the compiler down, when one was started.
     */
    async closeBundle(): Promise<void> {
      const held = await state.opening;

      held?.close();
      state.opening = undefined;
    },

    /**
     * Contributes this plugin's configuration to the repository's.
     *
     * @param stated - The configuration as the repository stated it.
     * @param env - The command and the mode the bundler composes the configuration under.
     */
    config(stated: UserConfig, env: Composing): UserConfig {
      return configured(state, stated, env.command);
    },

    /**
     * Records the resolved root and command, and resolves the directories the patterns start in.
     *
     * @remarks
     *   The root is read from the resolved configuration and not from the process, because under a
     *   task runner the working directory is the workspace root.
     */
    configResolved(config: Resolved): void {
      state.resolved = config;
      state.watched = roots(config.root, options.patterns);
    },

    /**
     * Registers the directories the patterns start in with the dev server's watcher, including
     * any that sit outside the project root.
     */
    configureServer(server: Watcher): void {
      server.watcher.add([...state.watched]);
    },

    /**
     * Adds this plugin's modules to the ones a change reloads.
     *
     * @remarks
     *   Returning undefined hands the change back to the bundler's own handling. An update
     *   carrying no environment gets that, because without a module graph the plugin can reach
     *   none of its modules, and `watchChange` has already followed the change.
     * @returns Every module to reload, or undefined when the change reaches none of this plugin's.
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
     * Serves the index or one page's props.
     *
     * @remarks
     *   The null map is deliberate. Nothing here was transformed out of a source file, and the
     *   bundler generates a map of its own unless the hook returns one. Those maps came to four
     *   fifths of the payload: 232 kB of map on a 289 kB index, and 4.3 MB on the 5 MB of props
     *   one compound produced.
     * @returns The generated source and a null map, or undefined when the module is not this
     *   plugin's.
     */
    async load(this: Loading, id: string): Promise<undefined | Written> {
      const code = await generated(state, options.patterns, id, this);

      return code === undefined ? undefined : { code, map: null };
    },

    name: "stealth:specimens",

    /**
     * Claims the index specifier and every props specifier, leaving every other import alone.
     *
     * @returns The resolved identifier, or undefined for any other import.
     */
    resolveId(id: string): string | undefined {
      if (id === ID) return RESOLVED;

      return id.startsWith(PROPS) ? id : undefined;
    },

    /**
     * Appends the statement that makes a listed specimen accept its hot update and report the
     * module that replaced it.
     *
     * @remarks
     *   Nothing imports a specimen except through a loader the index handed out, so the index has
     *   listed the file by the time the bundler transforms it. A request carrying a query asks for
     *   the file's text rather than its module, and gets no statement appended.
     * @returns The source with the statement appended, or undefined for any other module.
     */
    transform(code: string, id: string): undefined | Written {
      const page = id.includes("?") ? undefined : pageOf(state, id);

      return page === undefined ? undefined : { code: code + accepting(page, "module"), map: null };
    },

    /**
     * Follows a change reported by an environment that bundles.
     *
     * @remarks
     *   A server that bundles runs no hot update hook and reports every change here instead.
     *   Invalidation stays the bundler's: it regenerates the index when the stamp that module
     *   declared changes, and leaves the index alone for an edited scene. A server that serves one
     *   module per file reports to `hotUpdate`, and this hook returns at once.
     * @param id - The absolute path of the file that changed.
     * @param change - Whether the file was created, deleted or edited.
     */
    async watchChange(this: Bundling, id: string, change: Change): Promise<void> {
      if (this.environment?.config.isBundled !== true) return;

      await bundled(state, options.patterns, id, change.event);
    },
  };
}
