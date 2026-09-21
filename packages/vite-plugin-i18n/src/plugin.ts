/**
 * Vite plugin for translation catalogues: finds them, serves the modules an application loads them
 * from, writes their types, and pushes a changed string to a running page.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
  type EnvironmentModuleNode,
  type HotUpdateOptions,
  normalizePath,
  type Plugin,
  type ViteDevServer,
} from "vite";

import { scratchDir, writeIfChanged } from "@stealthscale/vite-plugin-base";

import { problems } from "#check.ts";
import {
  type CatalogueIndex,
  cataloguesModule,
  filesOf,
  ID,
  indexed,
  mergedWords,
  ofLanguage,
  type Pair,
  pairId,
  pairModule,
  pairOfId,
} from "#emit.ts";
import { type Catalogue, EXTENSION, found, LOCALES, namespaceOf } from "#find.ts";
import { declared } from "#typegen.ts";

export { ID };

/**
 * Resolved id of the catalogues module, with the leading NUL that marks it as generated.
 */
const RESOLVED = `\0${ID}`;

/**
 * Name of the custom event a changed catalogue is sent to the page under.
 *
 * @remarks
 *   The foundation listens for the same string. Neither package imports the other, so the name is a
 *   contract between them and not a shared constant.
 */
export const EVENT = "i18n:catalogue";

/**
 * Default for {@link Options.fallback}: the language every key is defined in.
 */
const FALLBACK = "en";

/**
 * Default for {@link Options.types}, resolved against the project root.
 */
const TYPES = "src/i18n.gen.d.ts";

/**
 * Directory name the plugin's scratch space takes under the system temporary directory.
 */
const SCRATCH = "stealth-i18n";

/**
 * File under the scratch that the plugin rewrites whenever the set of languages and namespaces
 * changes.
 *
 * @remarks
 *   The catalogues module lists the stamp as a file to watch, so the bundler rebuilds the module
 *   when the stamp changes. A watcher reports nothing for a file appearing in a watched directory,
 *   so the plugin turns that into a change to the stamp.
 */
const STAMP = "topology";

/**
 * The payload sent to the page under {@link EVENT}.
 */
export interface Changed {
  /**
   * The BCP 47 tag of the language that changed.
   */
  readonly language: string;

  /**
   * The namespace that changed.
   */
  readonly namespace: string;

  /**
   * Every file of the pair merged, so an override survives a change to the package it overrides.
   */
  readonly words: Readonly<Record<string, unknown>>;
}

/**
 * The settings a repository configures the plugin with. Every member has a default.
 */
export interface Options {
  /**
   * Inlines every language, not the fallback alone, so the page fetches nothing. Off by default.
   */
  readonly eager?: boolean | undefined;

  /**
   * The language every key is defined in, which is inlined for the first paint. `en` by default.
   */
  readonly fallback?: string | undefined;

  /**
   * Decides which namespaces to keep, given each name. Keeps every one by default.
   */
  readonly namespaces?: ((namespace: string) => boolean) | undefined;

  /**
   * The scopes whose packages are searched. The application's own scope by default.
   */
  readonly scopes?: readonly string[] | undefined;

  /**
   * Where to write the types, against the project root, or false to write none.
   * `src/i18n.gen.d.ts` by default, which the house treats as generated and excludes from coverage.
   */
  readonly types?: false | string | undefined;
}

/**
 * The two fields the plugin reads from a resolved configuration.
 */
interface Resolved {
  /**
   * Whether the bundler is building or serving.
   */
  readonly command: "build" | "serve";

  /**
   * The project root the search starts from.
   */
  readonly root: string;
}

/**
 * The environment's channel to the page.
 */
interface Channel {
  /**
   * Sends a custom event to the page.
   */
  readonly send: (event: string, payload: Changed) => void;
}

/**
 * The part of a module graph the update hook uses.
 */
interface Graph {
  /**
   * Returns a module by its resolved identifier, or undefined when nothing imported it.
   */
  readonly getModuleById: (id: string) => EnvironmentModuleNode | undefined;

  /**
   * Invalidates a module, so the next import reloads it. Every call site guards against its
   * absence.
   */
  readonly invalidateModule?: ((node: EnvironmentModuleNode) => void) | undefined;
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
     * The channel the new strings are pushed down.
     */
    readonly hot: Channel;

    /**
     * The module graph the stale modules are invalidated through.
     */
    readonly moduleGraph: Graph;
  };
}

/**
 * The part of the environment the watch change hook reads off `this`.
 */
interface Bundling {
  /**
   * The environment the change was reported in, absent where the bundler binds none.
   */
  readonly environment?: {
    /**
     * The resolved configuration, narrowed to the one flag read here.
     */
    readonly config: {
      /**
       * True under a build and under a server that bundles, false when the server serves one
       * module per file.
       */
      readonly isBundled: boolean;
    };
  };
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
 * The mutable state the plugin carries across hook calls.
 */
interface State {
  /**
   * Every catalogue found, filtered by the namespaces option.
   */
  catalogues: readonly Catalogue[];

  /**
   * The same catalogues indexed by language and namespace.
   */
  index: CatalogueIndex;

  /**
   * The resolved configuration, replaced before any other hook runs.
   */
  resolved: Resolved;

  /**
   * Every language and namespace pair the last search found, one per line, sorted.
   */
  shape: string;

  /**
   * Absolute path of the file rewritten when the shape changes, under the scratch for the root.
   */
  stamp: string;
}

/**
 * Renders every language and namespace pair an index contains as sorted lines, for comparing one
 * search against the last.
 *
 * @remarks
 *   The catalogues module's exports and loader table depend on the shape as well as on the words. A
 *   page that already imported the module cannot pick up a shape change from a pushed event, so the
 *   plugin hands the module back for a reload.
 */
function shapeOf(index: CatalogueIndex): string {
  return [...index.entries()]
    .flatMap(([language, byNamespace]) =>
      [...byNamespace.keys()].map((namespace) => `${language}/${namespace}`),
    )
    .toSorted()
    .join("\n");
}

/**
 * Searches for the catalogues again and indexes them, keeping the namespaces the options accept.
 *
 * @param state - The state whose catalogues, index and shape are replaced.
 * @param options - Where to search and which namespaces to keep.
 * @returns True when the set of languages and namespaces differs from the last search's.
 */
function refound(state: State, options: Options): boolean {
  const wanted = options.namespaces ?? ((): boolean => true);

  state.catalogues = found(state.resolved.root, options.scopes).filter((one) =>
    wanted(one.namespace),
  );
  state.index = indexed(state.catalogues);

  const shape = shapeOf(state.index);
  const reshaped = shape !== state.shape;

  state.shape = shape;

  return reshaped;
}

/**
 * Writes the generated types, unless the options turn them off.
 *
 * @param state - The catalogues found.
 * @param options - Where to write and which language types the keys.
 * @returns True when the file's content changed, false when it matched or types are off.
 */
function retyped(state: State, options: Options): boolean {
  if (options.types === false) return false;

  return writeIfChanged(
    resolve(state.resolved.root, options.types ?? TYPES),
    declared(state.index, options.fallback ?? FALLBACK),
  );
}

/**
 * Rewrites the stamp with a new timestamp, so a bundler watching it rebuilds the catalogues
 * module.
 *
 * @remarks
 *   `process.hrtime.bigint` has nanosecond resolution, so two writes within the same millisecond
 *   still produce different content.
 * @param state - The state carrying the stamp's path.
 */
function stamped(state: State): void {
  mkdirSync(dirname(state.stamp), { recursive: true });
  writeFileSync(state.stamp, `${process.hrtime.bigint()}\n`);
}

/**
 * Formats each fault in the catalogues as one line naming the file, the key where the fault has
 * one, and what is wrong.
 *
 * @param state - The catalogues found.
 * @param options - Which language defines the keys.
 * @returns One line per fault, empty when every catalogue is valid.
 */
function wrong(state: State, options: Options): readonly string[] {
  return problems(state.index, options.fallback ?? FALLBACK).map(
    ({ file: at, key, says }) => `${at}${key === "" ? "" : `: ${key}`} ${says}`,
  );
}

/**
 * Reads the language and namespace a catalogue file belongs to out of its path.
 *
 * @param path - A normalised path under a `locales` directory.
 * @returns The pair, or undefined when no language directory sits under `locales`.
 */
function pairOf(path: string): Pair | undefined {
  const rest = path.slice(path.lastIndexOf(`/${LOCALES}/`) + LOCALES.length + 2);
  const at = rest.indexOf("/");

  if (at === -1) return undefined;

  return { language: rest.slice(0, at), namespace: namespaceOf(rest.slice(at + 1)) };
}

/**
 * Returns true for a path carrying a catalogue extension under a `locales` directory.
 *
 * @param path - A normalised path.
 */
function catalogued(path: string): boolean {
  return EXTENSION.test(path) && path.includes(`/${LOCALES}/`);
}

/**
 * Invalidates a module the graph contains, and does nothing for one nothing imported.
 *
 * @param graph - The module graph to look the module up in and invalidate through.
 * @param id - The module's resolved identifier.
 */
function stale(graph: Graph, id: string): void {
  const node = graph.getModuleById(id);

  if (node !== undefined) graph.invalidateModule?.(node);
}

/**
 * Pushes a changed pair to a running page, invalidates the modules holding the old strings, and
 * warns about any fault the change introduced.
 *
 * @remarks
 *   The catalogues module is invalidated as well as the pair's own, because the fallback language
 *   is inlined in it, so a page loaded after the change gets the current strings.
 * @param state - The catalogues found.
 * @param options - Which language defines the keys, for the validation that follows.
 * @param pair - The language and namespace that changed.
 * @param watching - The environment the file changed in.
 */
function resent(state: State, options: Options, pair: Pair, watching: Watching): void {
  stale(watching.environment.moduleGraph, `\0${pairId(pair.language, pair.namespace)}`);
  stale(watching.environment.moduleGraph, RESOLVED);
  watching.environment.hot.send(EVENT, {
    language: pair.language,
    namespace: pair.namespace,
    words: mergedWords(filesOf(state.index, pair.language, pair.namespace)),
  });

  for (const line of wrong(state, options)) globalThis.console.warn(line);
}

/**
 * Handles a catalogue file that was added or deleted.
 *
 * @remarks
 *   The search and the types run again, because the set of languages and namespaces may have
 *   changed. Where it did, the catalogues module goes back to the server for a reload, because a
 *   running page imported the old set and no pushed event replaces it. Where only the words of a
 *   pair changed, the pair is pushed to the page and the page keeps its state.
 * @param state - The catalogues found, searched again here.
 * @param options - Where to search.
 * @param path - The file that appeared or disappeared.
 * @param watching - The environment the file changed in.
 * @returns The catalogues module where the server has to reload it, and an empty array otherwise.
 */
function refollowed(
  state: State,
  options: Options,
  path: string,
  watching: Watching,
): EnvironmentModuleNode[] {
  const reshaped = refound(state, options);

  retyped(state, options);

  if (reshaped) {
    stamped(state);

    const node = watching.environment.moduleGraph.getModuleById(RESOLVED);

    return node === undefined ? [] : [node];
  }

  const pair = pairOf(path);

  if (pair === undefined) stale(watching.environment.moduleGraph, RESOLVED);
  else resent(state, options, pair, watching);

  return [];
}

/**
 * Selects the files whose words the catalogues module inlines: every catalogue when eager, and the
 * fallback language's alone otherwise.
 *
 * @param state - The catalogues found.
 * @param options - Whether every language is inlined, and which one is otherwise.
 * @returns The catalogues to inline, which are also the files the module watches.
 */
function inlinedFiles(state: State, options: Options): readonly Catalogue[] {
  if (options.eager === true) return state.catalogues;

  return [...ofLanguage(state.index, options.fallback ?? FALLBACK).values()].flat();
}

/**
 * Creates the plugin that finds the catalogues, types their keys, and serves `virtual:i18n`.
 *
 * @remarks
 *   On a dev server a catalogue change reaches the page as an event and not as a reload, so the
 *   page keeps its state. A build throws on an invalid catalogue. Every module lists the files it
 *   read as files to watch, so a bundler that rebuilds on a change rebuilds the module.
 * @param options - Where to search and what to write. {@link Options} Documents every member, and
 *   every one has a default.
 * @returns The plugin, with its state already holding the working directory until
 *   `configResolved` replaces it.
 */
export function i18n(options: Options = {}): Plugin {
  const state: State = {
    catalogues: [],
    index: new Map(),
    resolved: { command: "serve", root: process.cwd() },
    shape: "",
    stamp: join(scratchDir(SCRATCH, process.cwd()), STAMP),
  };

  return {
    /**
     * Throws on an invalid catalogue during a build, and warns through the bundler on a dev server
     * run.
     *
     * @throws {@link Error} When the command is `build` and a catalogue defines an unknown key or
     *   drops a placeholder. The message carries every fault, one per line.
     */
    buildStart(): void {
      const lines = wrong(state, options);

      if (lines.length === 0) return;
      if (state.resolved.command === "build") throw new Error(lines.join("\n"));

      for (const line of lines) this.warn(line);
    },

    /**
     * Records the resolved configuration and the stamp's path for that root, then runs the first
     * search and writes the types.
     *
     * @param config - The resolved configuration.
     */
    configResolved(config: Resolved): void {
      state.resolved = config;
      state.stamp = join(scratchDir(SCRATCH, config.root), STAMP);
      refound(state, options);
      retyped(state, options);
    },

    /**
     * Registers every `locales` directory with the watcher, including those outside the project
     * root.
     *
     * @param server - The dev server whose watcher the directories are added to.
     */
    configureServer(server: ViteDevServer): void {
      server.watcher.add([...new Set(state.catalogues.map((one) => dirname(dirname(one.file))))]);
    },

    /**
     * Handles a catalogue change on a dev server by pushing the new strings to the page.
     *
     * @remarks
     *   The types are written again on an edit too, because a key or a placeholder added to the
     *   fallback language changes what the page may ask for.
     * @param changed - The file, what happened to it, and the modules the change reached.
     * @returns The catalogues module where the page has to reload it, an empty array for a
     *   catalogue pushed to the page, or undefined for a file this plugin does not own, which
     *   leaves the change to the bundler.
     */
    hotUpdate(this: Watching, changed: HotUpdateOptions): EnvironmentModuleNode[] | undefined {
      const path = normalizePath(changed.file);

      if (!catalogued(path)) return undefined;
      if (changed.type !== "update") return refollowed(state, options, path, this);

      const catalogue = state.catalogues.find((one) => one.file === path);

      if (catalogue === undefined) return undefined;

      retyped(state, options);
      resent(state, options, catalogue, this);

      return [];
    },

    /**
     * Serves the catalogues module, or the module one pair is fetched as, declaring the files each
     * one read as files to watch.
     *
     * @param id - The resolved identifier of the module being loaded.
     * @returns The generated source, or undefined when the module is not this plugin's.
     */
    load(this: Loading, id: string): string | undefined {
      if (id === RESOLVED) {
        if (!existsSync(state.stamp)) stamped(state);

        this.addWatchFile(state.stamp);

        for (const one of inlinedFiles(state, options)) this.addWatchFile(one.file);

        return cataloguesModule(state.index, options.fallback ?? FALLBACK, options.eager ?? false);
      }

      const pair = pairOfId(id);

      if (pair === undefined) return undefined;

      const files = filesOf(state.index, pair.language, pair.namespace);

      for (const one of files) this.addWatchFile(one.file);

      return pairModule(files);
    },

    name: "stealth:i18n",

    /**
     * Claims the catalogues specifier and every pair specifier, leaving every other import alone.
     *
     * @param id - The specifier being resolved.
     * @returns The specifier behind a NUL, or undefined for any other import.
     */
    resolveId(id: string): string | undefined {
      return id === ID || pairOfId(id) !== undefined ? `\0${id}` : undefined;
    },

    /**
     * Runs the search and the types again during a watching build or under a server that bundles,
     * and rewrites the stamp when the set of languages and namespaces changed.
     *
     * @remarks
     *   A server that serves a module per file reports the same change to `hotUpdate`, which pushes
     *   the strings to the page, so this hook ignores a change under that server. A watching build
     *   has no page, and a server that bundles runs no hot update hook, so both are followed here.
     * @param id - The path of the file that changed.
     */
    watchChange(this: Bundling, id: string): void {
      if (!catalogued(normalizePath(id))) return;
      if (state.resolved.command !== "build" && this.environment?.config.isBundled !== true) return;

      const reshaped = refound(state, options);

      retyped(state, options);

      if (reshaped) stamped(state);
    },
  };
}
