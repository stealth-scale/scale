/**
 * Implements the plugin: it finds the specimen files, serves the modules a catalogue imports, and
 * invalidates them when a file changes.
 */

import { readFileSync } from "node:fs";
import {
  type EnvironmentModuleGraph,
  type EnvironmentModuleNode,
  type Plugin,
  type UserConfig,
} from "vite";

import { type Compiler } from "#anatomy/compiler.ts";
import { type Settled, settled } from "#anatomy/reading.ts";
import { type Changed, type Indexing, pageOf, pathOf, reindexes, retyped } from "#changed.ts";
import {
  accepting,
  anatomised,
  fragmented,
  type Listed,
  listings,
  type Resolved,
  written,
} from "#emit.ts";
import { found, roots } from "#found.ts";
import { components, fragments } from "#fragments.ts";
import { FRAGMENTS, ID, type Options, PROPS } from "#options.ts";

/**
 * The resolved identifier of the index.
 *
 * @remarks
 *   The specifier itself rather than the specifier behind a NUL, which is the convention that
 *   keeps other plugins off a generated module. A server that bundles loads a page's fragments
 *   through a dynamic import, and its runtime looks a loaded module up by an identifier it
 *   registered without the NUL, so a module behind one loads as nothing. No other plugin reads a
 *   module with no extension, so the convention protects nothing here.
 */
const RESOLVED = ID;

/**
 * The resolved identifier prefix of a page's fragments. The page's identifier follows it.
 */
const RESOLVED_FRAGMENTS = FRAGMENTS;

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
 * Describes the part of a load's context the plugin reads.
 */
interface Loading {
  /**
   * Adds a file whose change loads the module again.
   */
  readonly addWatchFile: (file: string) => void;
}

/**
 * Generates the module under one resolved identifier.
 *
 * @remarks
 *   A page's fragments are cut from the page's file, so the file is added to the module's watch
 *   list: a server that bundles loads the fragments again when the file changes, where a
 *   middleware server is told which module to reload by the hot update.
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

    return written(state.last);
  }

  if (id.startsWith(RESOLVED_FRAGMENTS)) {
    const page = id.slice(RESOLVED_FRAGMENTS.length);
    const path = pathOf(state, page);
    const file = { path, text: readFileSync(path, "utf8") };

    loading.addWatchFile(path);

    return fragmented(fragments(file), components(file), page);
  }

  if (!id.startsWith(RESOLVED_PROPS) || state.reading === undefined) return undefined;

  const path = pathOf(state, id.slice(RESOLVED_PROPS.length));
  const { compiler } = await import("#anatomy/compiler.ts");

  state.opening ??= compiler(state.resolved.root);

  return anatomised((await state.opening).anatomyOf(path, state.reading));
}

/**
 * Returns the fragments module of a changed page.
 *
 * @returns The module node, and an empty array when nothing imported it.
 */
function refragmented(
  indexing: Indexing,
  file: string,
  graph: Watching["environment"]["moduleGraph"],
): EnvironmentModuleNode[] {
  const page = pageOf(indexing, file);
  const node = page === undefined ? undefined : graph.getModuleById(`${RESOLVED_FRAGMENTS}${page}`);

  return node === undefined ? [] : [node];
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
     * Excludes build output from the watcher, because the watched directories are whole trees.
     */
    config(): UserConfig {
      return { server: { watch: { ignored: [...OUTPUTS] } } };
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
     *   A server that bundles hands the hook no environment and no module graph. The compiler is
     *   restarted all the same, and the modules are left to the bundler: a page's fragments watch
     *   the page's file, and the index is generated again when the server starts.
     * @returns The modules to reload, or undefined when the change reaches none of this plugin's.
     */
    async hotUpdate(
      this: Watching,
      changed: Updated,
    ): Promise<EnvironmentModuleNode[] | undefined> {
      const environment: undefined | Watching["environment"] = this.environment;

      if (environment === undefined) {
        await restarted(state, changed.file);

        return undefined;
      }

      const graph = environment.moduleGraph;
      const reloaded = [
        ...changed.modules,
        ...refragmented(state, changed.file, graph),
        ...(await reread(state, changed.file, graph)),
      ];
      const index = (await reindexes(state, options.patterns, changed))
        ? graph.getModuleById(RESOLVED)
        : undefined;

      if (index !== undefined) reloaded.push(index);

      return reloaded.length === changed.modules.length ? undefined : reloaded;
    },

    /**
     * Serves the index, one page's fragments, or one page's props.
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
     * Claims the index specifier and every fragments and props specifier.
     *
     * @returns The resolved identifier, or undefined for any other import.
     */
    resolveId(id: string): string | undefined {
      if (id === ID) return RESOLVED;

      return id.startsWith(FRAGMENTS) || id.startsWith(PROPS) ? id : undefined;
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
  };
}
