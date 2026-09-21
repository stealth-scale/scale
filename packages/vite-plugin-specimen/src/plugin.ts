/**
 * Implements the plugin: it finds the specimen files, serves the modules a catalogue imports, and
 * invalidates them when a file changes.
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
 * The resolved identifier of the index.
 *
 * @remarks
 *   The specifier itself rather than the specifier behind a NUL, which is the convention that
 *   keeps other plugins off a generated module. A server that bundles loads a page's props
 *   through a dynamic import, and its runtime looks a loaded module up by an identifier it
 *   registered without the NUL, so a module behind one loads as nothing. No other plugin reads a
 *   module with no extension, so the convention protects nothing here.
 */
const RESOLVED = ID;

/**
 * The resolved identifier prefix of a page's props. The page's identifier follows it.
 */
const RESOLVED_PROPS = PROPS;

/**
 * The build output the watcher ignores.
 *
 * @remarks
 *   The watched directories are whole package trees, so a coverage report would be watched too, and
 *   a changed HTML file the server holds no module for triggers a full reload.
 */
const OUTPUTS: readonly string[] = ["**/coverage/**"];

/**
 * The directory the plugin's scratch goes under, outside the workspace.
 */
const SCRATCH = "stealth-specimen";

/**
 * The file under the scratch that the plugin rewrites whenever the index would list something
 * else: a page appearing or disappearing, or one changing the metadata it declares.
 *
 * @remarks
 *   The index lists it as a file to watch. A server that bundles runs no hot update hook and
 *   rebuilds a module when a file it listed changes, and a directory handed to its watcher tells it
 *   nothing about a file appearing there, so a change to the listing is turned into a change to
 *   this file.
 */
const STAMP = "index";

/**
 * Describes the part of a dev server the plugin reads.
 *
 * @remarks
 *   Narrower than Vite's own type, so a specification supplies a watcher instead of a whole server.
 */
interface Watcher {
  /**
   * The file watcher the plugin adds directories to.
   */
  readonly watcher: {
    /**
     * Watches each directory for a file appearing under it.
     */
    readonly add: (paths: readonly string[]) => void;
  };
}

/**
 * Describes the part of a hot update the plugin reads.
 *
 * @remarks
 *   Narrower than Vite's own type, which also carries the dev server. A specification therefore
 *   builds an update without one.
 */
interface Updated extends Changed {
  /**
   * The modules the bundler already resolved for the change.
   */
  readonly modules: readonly EnvironmentModuleNode[];
}

/**
 * Describes the part of an environment the update hook reads.
 */
interface Watching {
  /**
   * The environment a file changed in.
   */
  readonly environment: {
    /**
     * The module graph, which reports whether a module was ever loaded.
     */
    readonly moduleGraph: Pick<EnvironmentModuleGraph, "getModuleById">;
  };
}

/**
 * Describes the part of an environment the watch change hook reads.
 */
interface Bundling {
  /**
   * The environment a file changed in, where the bundler binds one.
   */
  readonly environment?: {
    /**
     * The part of the configuration that says whether the environment produces a bundled output.
     */
    readonly config: {
      /**
       * Whether the environment produces a bundled output, as a build and a server that bundles
       * do.
       */
      readonly isBundled: boolean;
    };
  };
}

/**
 * Describes a generated module and the absence of a source map for it.
 */
interface Written {
  /**
   * The generated source.
   */
  readonly code: string;

  /**
   * Null, because the module was generated rather than transformed.
   */
  readonly map: null;
}

/**
 * Describes the state one plugin instance carries between hooks.
 */
interface State {
  /**
   * Each file's listing and identifier, as the index was last generated.
   */
  last: ReadonlyMap<string, Listed>;

  /**
   * The compiler, from the moment a page's props were first asked for.
   */
  opening: Promise<Compiler> | undefined;

  /**
   * The reading a repository stated, or undefined where it reads no props.
   */
  reading: Settled | undefined;

  /**
   * The root and command the bundler resolved.
   */
  resolved: Resolved;

  /**
   * The absolute directories the patterns start searching in.
   */
  watched: readonly string[];
}

/**
 * Describes the part of a watch change the plugin reads beside the file.
 */
interface Change {
  /**
   * Whether the file was created, deleted, or edited.
   */
  readonly event: Changed["type"];
}

/**
 * Finds the stamp for the resolved root, under the plugin's scratch.
 */
function stampOf(state: State): string {
  return join(scratchDir(SCRATCH, state.resolved.root), STAMP);
}

/**
 * Rewrites the stamp, so a bundler watching it generates the index again.
 */
function stamped(state: State): void {
  const stamp = stampOf(state);

  mkdirSync(dirname(stamp), { recursive: true });
  writeFileSync(stamp, `${process.hrtime.bigint()}\n`);
}

/**
 * Follows a change under a server that bundles: restarts the compiler on a change to a typed file,
 * and rewrites the stamp when the change makes the index list something else.
 *
 * @remarks
 *   The change is classified the way a hot update is, with the file read from disk because the
 *   hook carries no reader. A file that is gone is not read.
 */
async function bundled(
  state: State,
  patterns: readonly string[],
  file: string,
  type: Changed["type"],
): Promise<void> {
  await restarted(state, file);

  const changed: Changed = { file, read: () => readFileSync(file, "utf8"), type };

  if (await reindexes(state, patterns, changed)) stamped(state);
}

/**
 * Describes the part of a load's context the plugin reads.
 */
interface Loading {
  /**
   * Adds a file whose change loads the module again.
   */
  readonly addWatchFile: (file: string) => void;
}

/**
 * Generates the module under one resolved identifier, and lists the stamp as a file the index
 * watches.
 *
 * @returns The generated source, or undefined when the identifier is not this plugin's.
 * @throws {@link Error} When the patterns match nothing, a build meets a file it cannot read, or
 *   the requested page belongs to no listed specimen.
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

    if (!existsSync(stampOf(state))) stamped(state);

    loading.addWatchFile(stampOf(state));

    return written(state.last);
  }

  if (!id.startsWith(RESOLVED_PROPS) || state.reading === undefined) return undefined;

  const path = pathOf(state, id.slice(RESOLVED_PROPS.length));
  const { compiler } = await import("#anatomy/compiler.ts");

  state.opening ??= compiler(state.resolved.root);

  return anatomised((await state.opening).anatomyOf(path, state.reading));
}

/**
 * Restarts the compiler on a change to a typed file.
 *
 * @remarks
 *   Nothing happens where the compiler was never started, there being nothing to read again.
 * @returns Whether the compiler was restarted.
 */
async function restarted(state: State, file: string): Promise<boolean> {
  if (state.opening === undefined || !retyped(state.watched, file)) return false;

  (await state.opening).restart();

  return true;
}

/**
 * Restarts the compiler on a change to a typed file, and returns every props module that was
 * loaded.
 *
 * @remarks
 *   Every loaded module rather than the ones the file reaches.
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
 * The chunk every page's props are written into.
 */
const PROPS_CHUNK = "props";

/**
 * The chunk every page is written into.
 */
const PAGES_CHUNK = "pages";

/**
 * Writes the configuration the plugin adds: the build output the watcher leaves alone, every page
 * in one chunk, and every page's props in another.
 *
 * @remarks
 *   The pages and what they reach beyond the entry's own graph are one chunk, fetched by the first
 *   page a reader opens and cached for every page after it. A chunk per page was the alternative,
 *   and the docs build wrote sixty of them, from one kilobyte to fifty-five, most under two
 *   kilobytes gzipped, each a request for what one page holds; a reader who opens one page opens
 *   the next. The group includes each page's dependencies, so a component only its page reaches
 *   travels with the page and no chunk re-exports a page to another. The lazy form of the index's
 *   dynamic import carries the page's path and a query, which is stripped before the page is
 *   looked up. The props of every page share a chunk of their own, because a page loads them only
 *   where somebody opens them. A build output stated as several is left alone, because a group
 *   written into every one of them would be a guess at which one is the page's.
 * @param indexing - The index as last generated, which says which file is which page.
 * @param stated - The configuration as the repository stated it.
 */
function configured(indexing: Indexing, stated: UserConfig): UserConfig {
  const watched: UserConfig = { server: { watch: { ignored: [...OUTPUTS] } } };

  if (Array.isArray(stated.build?.rolldownOptions?.output)) return watched;

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
 * Indexes the specimens the patterns match, and answers that index as a virtual module.
 *
 * @remarks
 *   The index is generated when a catalogue first imports it, and again whenever a page appears,
 *   disappears, or changes the metadata it declares. Editing a scene reloads its page and leaves
 *   the index alone.
 * @param options - Where to search, and whether to read props. `Options` documents every member.
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
     * Stops the compiler, where one was started.
     */
    async closeBundle(): Promise<void> {
      const held = await state.opening;

      held?.close();
      state.opening = undefined;
    },

    /**
     * Excludes build output from the watcher, puts every page in one chunk, and every page's props
     * in another.
     *
     * @param stated - The configuration as the repository stated it.
     */
    config(stated: UserConfig): UserConfig {
      return configured(state, stated);
    },

    /**
     * Records the root the patterns resolve against and the command the bundler is running.
     *
     * @remarks
     *   Read from the resolved configuration rather than from the process, because under a task
     *   runner the working directory is the workspace root.
     */
    configResolved(config: Resolved): void {
      state.resolved = config;
      state.watched = roots(config.root, options.patterns);
    },

    /**
     * Adds the directories the patterns start in to the watcher, including those outside the root.
     */
    configureServer(server: Watcher): void {
      server.watcher.add([...state.watched]);
    },

    /**
     * Adds the plugin's own modules to the ones a change invalidates.
     *
     * @remarks
     *   A bundler that calls the hook with no environment, and so no module graph, is answered
     *   nothing: the change reached `watchChange` first, and the modules are the bundler's.
     * @returns The modules to reload, or undefined when the change reaches none of this plugin's.
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
     * Serves the index or one page's props, and lists the stamp as a file the index watches.
     *
     * @remarks
     *   Served without a source map. Every module here is generated rather than transformed, and
     *   the bundler generates a map anyway unless the hook returns one explicitly. The maps were
     *   four fifths of the payload: a 289 kB index carried 232 kB of map, and one compound's props
     *   5 MB of which 4.3 MB was map.
     * @returns The generated source and a null map, or undefined when the module is not this
     *   plugin's.
     */
    async load(this: Loading, id: string): Promise<undefined | Written> {
      const code = await generated(state, options.patterns, id, this);

      return code === undefined ? undefined : { code, map: null };
    },

    name: "stealth:specimens",

    /**
     * Claims the index specifier and every props specifier.
     *
     * @returns The resolved identifier, or undefined for any other import.
     */
    resolveId(id: string): string | undefined {
      if (id === ID) return RESOLVED;

      return id.startsWith(PROPS) ? id : undefined;
    },

    /**
     * Makes a listed specimen accept its own hot update and report the module that replaced it.
     *
     * @remarks
     *   The index lists the file before anything imports it, because the file is reached through
     *   the loader the index handed out, so a file the index has not listed is left alone. So is
     *   a request for the file under a query, which is the file's text rather than the module.
     * @returns The source with the statement appended, or undefined for any other module.
     */
    transform(code: string, id: string): undefined | Written {
      const page = id.includes("?") ? undefined : pageOf(state, id);

      return page === undefined ? undefined : { code: code + accepting(page, "module"), map: null };
    },

    /**
     * Follows a change where the environment bundles: restarts the compiler on a change to a typed
     * file, and rewrites the stamp when the index would list something else.
     *
     * @remarks
     *   A server that bundles runs no hot update hook and reports a change here. The modules are
     *   left to the bundler, which generates the index again when the stamp it listed changes, and
     *   leaves the index alone when a scene changed. A server that serves one module per file
     *   reports the change to `hotUpdate`, which restarts the compiler and reloads the modules
     *   through the module graph, so the change is left to that one.
     * @param id - The file that changed.
     * @param change - Whether the file was created, deleted or edited.
     */
    async watchChange(this: Bundling, id: string, change: Change): Promise<void> {
      if (this.environment?.config.isBundled !== true) return;

      await bundled(state, options.patterns, id, change.event);
    },
  };
}
