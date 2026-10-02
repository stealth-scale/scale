/**
 * The Vite plugin that composes a product from its plugins while the product builds, serves the
 * result as `virtual:product`, and writes the catalogues the product's services read. Under the
 * `standalone` option it serves a plugin's standalone page as well.
 */

import { relative, resolve } from "node:path";
import {
  type EnvironmentModuleNode,
  type HotUpdateOptions,
  normalizePath,
  type Plugin,
  type ResolvedConfig,
  type UserConfig,
} from "vite";

import { lineOf, type PluginPackage, type ResolvedProduct } from "@stealthscale/sdk-core";
import { importer, type Importer } from "@stealthscale/vite-plugin-base";
import { type CataloguesApi, cataloguesOf } from "@stealthscale/vite-plugin-i18n";

import { cataloguesFor } from "#catalogues.ts";
import { pluginChunkOf } from "#chunks.ts";
import { compose, type Composition } from "#compose.ts";
import { ID, moduleOf, RESOLVED } from "#module.ts";
import {
  generate,
  GENERATED,
  pageIdOf,
  pageSourceOf,
  PRODUCT,
  type StandalonePage,
} from "#standalone.ts";

export { ID };
export type { StandalonePage };

/**
 * Directory of the build's output the catalogues are written to.
 */
const CATALOGUES = ".product";

/**
 * Path of the definition module where the options state none.
 */
const DEFINITION = "src/product.ts";

/**
 * Priority of the plugin chunks' group: above the shared chunk's 3, below the vendor chunk's 5.
 */
const PRIORITY = 4;

/**
 * Lists the options of the product plugin.
 */
export interface ProductOptions {
  /**
   * Path of the module whose default export is the product's definition, from the project root.
   * `src/product.ts` by default, and the generated definition under `standalone`.
   */
  readonly definition?: string | undefined;

  /**
   * The standalone page of a plugin, which the plugin serves at every address without a file. No
   * page where left out.
   */
  readonly standalone?: StandalonePage | undefined;
}

/**
 * Describes what the plugin keeps between its hooks.
 */
interface State {
  /**
   * Every file that changed since the last composition started, normalized. The next composition
   * transforms each again.
   */
  changed: Set<string>;

  /**
   * The number of changes a dev server followed. A change whose number is not the last was
   * superseded.
   */
  changes: number;

  /**
   * The command the bundler runs under.
   */
  command: ResolvedConfig["command"];

  /**
   * The composition of the product, started by the first `buildStart`.
   */
  composing?: Promise<Composition> | undefined;

  /**
   * The conditions the product's packages resolve under.
   */
  conditions?: readonly string[] | undefined;

  /**
   * Why the product did not resolve, where it did not.
   */
  failure?: string | undefined;

  /**
   * Every file the last composition read, normalized. A change to one composes the product again.
   */
  files: ReadonlySet<string>;

  /**
   * The compositions a dev server runs after changes, one at a time in the order of the changes.
   */
  following: Promise<void>;

  /**
   * Each installed plugin's web package, by plugin id, which the plugin chunks are named after.
   */
  packages: Readonly<Record<string, PluginPackage>>;

  /**
   * The resolved product, where it resolved.
   */
  product?: ResolvedProduct | undefined;

  /**
   * The project root.
   */
  root: string;

  /**
   * The importer every composition imports the definition through, opened by the first
   * composition and closed when the bundle closes.
   */
  through?: Promise<Importer> | undefined;

  /**
   * The catalogue plugin's api, where the configuration has the catalogue plugin.
   */
  words?: CataloguesApi | undefined;
}

/**
 * Describes the payload that reloads every page a dev server serves.
 */
interface Reload {
  /**
   * The pages to reload, which is every page.
   */
  readonly path: "*";

  /**
   * The kind of payload the page's client acts on.
   */
  readonly type: "full-reload";
}

/**
 * Describes the payload that shows the problems in a dev server's error overlay.
 */
interface Overlay {
  /**
   * The error the overlay shows.
   */
  readonly err: {
    /**
     * Every problem, one per line.
     */
    readonly message: string;

    /**
     * The stack, empty because the problems name their paths.
     */
    readonly stack: string;
  };

  /**
   * The kind of payload the page's client acts on.
   */
  readonly type: "error";
}

/**
 * Lists what a page receives after a change: a reload, or the problems in the error overlay.
 */
type Notice = Overlay | Reload;

/**
 * Describes an environment's channel to the page.
 */
interface Channel {
  /**
   * Sends a payload of the dev server's own to the page.
   */
  readonly send: (payload: Notice) => void;
}

/**
 * Describes the part of the watch hook's context the plugin reads.
 */
interface Watching {
  /**
   * The environment the change was reported in.
   */
  readonly environment: {
    /**
     * The resolved configuration, narrowed to the one flag read here.
     */
    readonly config: {
      /**
       * True under a server that bundles, false under one that serves one module per file.
       */
      readonly isBundled: boolean;
    };

    /**
     * The channel to the page, absent under a build.
     */
    readonly hot?: Channel | undefined;
  };

  /**
   * Prints a warning through the bundler.
   */
  readonly warn: (message: string) => void;
}

/**
 * Describes the part of the hot update hook's context the plugin reads.
 */
interface Updating {
  /**
   * The environment the change was reported in.
   */
  readonly environment: {
    /**
     * The channel to the environment's pages.
     */
    readonly hot: Channel;

    /**
     * The environment's module graph.
     */
    readonly moduleGraph: {
      /**
       * Returns a module by its resolved id, or undefined where nothing imported it.
       */
      readonly getModuleById: (id: string) => EnvironmentModuleNode | undefined;

      /**
       * Invalidates a module, so the next import loads it again.
       */
      readonly invalidateModule: (node: EnvironmentModuleNode) => void;
    };

    /**
     * Name of the environment: `client` for the page's.
     */
    readonly name: string;
  };
}

/**
 * Describes the part of the load hook's context the plugin reads.
 */
interface Loading {
  /**
   * Declares a file the loaded module depends on, so a change to it loads the module again.
   */
  readonly addWatchFile: (file: string) => void;
}

/**
 * Returns the message a product that does not resolve fails with: every problem, then the hints.
 */
function failureOf({ hints, resolution }: Composition): string {
  return ["The product does not resolve:", ...resolution.problems.map(lineOf), ...hints].join("\n");
}

/**
 * Composes the product through the plugin's importer, after dropping the transforms of every file
 * that changed since the composition before.
 *
 * @remarks
 *   The first composition opens the importer, and every later one reuses its environment. Vite
 *   keeps a closed environment reachable, so an environment per composition would leave every
 *   module it transformed on the heap.
 */
async function composedThrough(
  state: State,
  definition: string,
  words: CataloguesApi,
): Promise<Composition> {
  state.through ??= importer({ conditions: state.conditions, root: state.root });

  const through = await state.through;

  through.invalidate([...state.changed]);
  state.changed.clear();

  return compose({ definition, root: state.root, through, words });
}

/**
 * Starts the product's composition once, and returns the one started before on a later call.
 *
 * @throws {@link Error} When the configuration has no catalogue plugin, whose words the
 *   composition checks.
 */
function composed(state: State, definition: string): Promise<Composition> {
  const { words } = state;

  if (words === undefined) {
    throw new Error(
      "The configuration has no stealth:i18n plugin, whose catalogues the product plugin checks. Add the layers of @stealthscale/vite-config-i18n.",
    );
  }

  state.composing ??= composedThrough(state, definition, words);

  return state.composing;
}

/**
 * Closes the importer the compositions share and forgets it, so a later composition opens a new
 * one.
 */
async function closed(state: State): Promise<void> {
  const { through } = state;

  state.through = undefined;
  await (await through)?.close();
}

/**
 * Returns the configuration whose group builds each installed plugin's lazy modules into a chunk
 * of its own.
 *
 * @remarks
 *   The group names a chunk from the web packages the composition found. A build start records
 *   them before the bundler forms its chunks.
 */
function chunked(state: State): Omit<UserConfig, "plugins"> {
  return {
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                debugName: "plugins",
                name: (id, chunking) => pluginChunkOf(id, chunking, state.packages),
                priority: PRIORITY,
              },
            ],
          },
        },
      },
    },
  };
}

/**
 * Describes one file the plugin emits into the build's output.
 */
interface Emitted {
  /**
   * Path of the file in the build's output.
   */
  readonly fileName: string;

  /**
   * The file's content.
   */
  readonly source: string;

  /**
   * The kind of file rolldown emits: an asset, which no module imports.
   */
  readonly type: "asset";
}

/**
 * Returns the catalogue files of a client build, and none under a dev server or for another
 * environment.
 *
 * @param state - The command, the resolved product and the catalogue plugin's api.
 * @param consumer - The consumer of the environment whose bundle is written.
 * @throws {@link Error} When a catalogue cannot be read for a description.
 */
function catalogueFiles(state: State, consumer: string): readonly Emitted[] {
  const { command, product: resolved, words } = state;

  if (
    consumer !== "client" ||
    command !== "build" ||
    resolved === undefined ||
    words === undefined
  ) {
    return [];
  }

  return Object.entries(cataloguesFor(resolved, words)).map(([name, catalogue]) => ({
    fileName: `${CATALOGUES}/${name}.json`,
    source: `${JSON.stringify(catalogue, null, 2)}\n`,
    type: "asset",
  }));
}

/**
 * Records a composition: its files, its web packages, its problems, and its product where it
 * resolved, so a composition with problems keeps the last product that resolved.
 *
 * @param state - The plugin's state, which the composition replaces.
 * @param composition - The files read, the web packages found and the resolution.
 * @param warn - Prints one warning of the resolution.
 */
function applied(state: State, composition: Composition, warn: (message: string) => void): void {
  const { problems, product: resolved, warnings } = composition.resolution;

  for (const warning of warnings) warn(lineOf(warning));

  state.files = new Set(composition.files.map((file) => normalizePath(file)));
  state.packages = composition.discovery.packages;
  state.product = resolved ?? state.product;
  state.failure = problems.length === 0 ? undefined : failureOf(composition);
}

/**
 * Returns what the page receives after a change: a reload where the product resolved, and the
 * problems in the error overlay where it did not.
 */
function noticeOf(state: State): Notice {
  return state.failure === undefined
    ? { path: "*", type: "full-reload" }
    : { err: { message: state.failure, stack: "" }, type: "error" };
}

/**
 * Composes the product again and records the composition, or its load error as the failure, unless
 * a later change superseded the change.
 *
 * @param state - The plugin's state.
 * @param definition - The definition's path from the project root.
 * @param context - The watch hook's context, whose bundler prints the warnings.
 * @param change - The number of the change the composition is for.
 */
async function recorded(
  state: State,
  definition: string,
  context: Watching,
  change: number,
): Promise<void> {
  if (change !== state.changes) return;

  try {
    applied(state, await composed(state, definition), (message) => {
      context.warn(message);
    });
  } catch (error) {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a composition rejects with an Error alone
    state.failure = (error as Error).message;
  }
}

/**
 * Follows a change to a file the last composition read.
 *
 * @remarks
 *   A watching build composes again at its next build start. A dev server runs one composition at
 *   a time, in the order of the changes. It skips the composition of a change that a later change
 *   superseded before its turn. The composition recorded last starts after the last change. A
 *   composition that fails to load records its error as the failure and keeps the last product. A
 *   server that bundles runs no hot update, so the page receives the notice here.
 * @param state - The plugin's state.
 * @param definition - The definition's path from the project root.
 * @param context - The watch hook's context.
 */
async function followed(state: State, definition: string, context: Watching): Promise<void> {
  state.composing = undefined;

  if (state.command === "build") return;

  state.changes += 1;

  const change = state.changes;

  state.following = state.following.then(() => recorded(state, definition, context, change));
  await state.following;

  const { config, hot } = context.environment;

  if (config.isBundled && hot !== undefined) hot.send(noticeOf(state));
}

/**
 * Brings a page served one module per file up to date after a change to a file the last
 * composition read: invalidates `virtual:product` in the environment, and sends the client's
 * page a notice.
 *
 * @returns An empty list, so the server handles the change no further.
 */
function updated(state: State, context: Updating): [] {
  const { hot, moduleGraph, name } = context.environment;
  const node = moduleGraph.getModuleById(RESOLVED);

  if (node !== undefined) moduleGraph.invalidateModule(node);
  if (name === "client") hot.send(noticeOf(state));

  return [];
}

/**
 * Returns the specifier `virtual:product` imports the definition by: `virtual:standalone-product`
 * for a definition the plugin generates, and the definition's path from the project root for any
 * other.
 *
 * @param state - The project root.
 * @param definition - The definition's path from the project root.
 * @param generated - Whether the plugin generates the definition of a standalone page.
 */
function importedOf(state: State, definition: string, generated: boolean): string {
  return generated
    ? PRODUCT
    : `/${normalizePath(relative(state.root, resolve(state.root, definition)))}`;
}

/**
 * Returns the source of `virtual:product`, which depends on every file the composition read.
 *
 * @param state - The resolved product and the files the composition read.
 * @param imported - The specifier the module imports the definition by.
 * @param context - The load hook's context, which watches the files.
 * @throws {@link Error} When the product did not resolve, with every problem.
 */
function served(state: State, imported: string, context: Loading): string {
  if (state.product === undefined) {
    throw new Error(state.failure ?? "The product has not been composed yet.");
  }

  for (const file of state.files) context.addWatchFile(file);

  return moduleOf(imported, state.product);
}

/**
 * Creates the plugin that composes a product from its plugins, serves `virtual:product`, builds
 * each plugin's lazy modules into one chunk, and writes the access, flag and operation catalogues
 * of a build.
 *
 * @remarks
 *   The product is composed when the build starts, and when a dev server starts. A build fails on
 *   a problem and prints each warning. A dev server serves no product until the definition
 *   resolves, and `virtual:product` then fails with the problems. A change to a file the
 *   composition read composes the product again: the page reloads, or shows the problems in the
 *   error overlay and keeps the last product. The client build writes the catalogues under
 *   `.product` in its output. Under `standalone`, the plugin writes the definition of the product
 *   that runs the plugin at `node_modules/.stealth/standalone/product.ts` once the configuration
 *   resolves, unless `definition` names one. It serves the page's document as `index.html`, its
 *   entry as `virtual:standalone`, and the generated definition as `virtual:standalone-product`.
 * @param options - The definition's path, and the standalone page.
 */
export function product(options: ProductOptions = {}): Plugin {
  const state: State = {
    changed: new Set(),
    changes: 0,
    command: "serve",
    files: new Set(),
    following: Promise.resolve(),
    packages: {},
    root: process.cwd(),
  };
  const page = options.standalone;
  const generated = page !== undefined && options.definition === undefined;
  const definition = options.definition ?? (generated ? GENERATED : DEFINITION);

  return {
    /**
     * Composes the product, and reports its warnings and its problems.
     *
     * @throws {@link Error} When the build's product does not resolve.
     */
    async buildStart(): Promise<void> {
      applied(state, await composed(state, definition), (message) => {
        this.warn(message);
      });

      for (const file of state.files) this.addWatchFile(file);

      if (state.failure !== undefined && state.command === "build") throw new Error(state.failure);
    },

    /**
     * Closes the importer the compositions share, at the end of a build and when a dev server
     * closes.
     */
    closeBundle(): Promise<void> {
      return closed(state);
    },

    /**
     * Adds the group that builds each installed plugin's lazy modules into a chunk of its own.
     */
    config(): Omit<UserConfig, "plugins"> {
      return chunked(state);
    },

    /**
     * Records the project root, the command, the conditions and the catalogue plugin's api, and
     * writes the generated definition of a standalone page.
     */
    configResolved(config: ResolvedConfig): void {
      state.command = config.command;
      state.conditions = config.ssr.resolve?.conditions;
      state.root = config.root;
      state.words = cataloguesOf(config.plugins);

      if (page !== undefined && options.definition === undefined) generate(config.root, page);
    },

    /**
     * Writes the access, flag and operation catalogues into the client build's output, and nothing
     * under a dev server or for another environment.
     *
     * @throws {@link Error} When a catalogue cannot be read for a description.
     */
    generateBundle(): void {
      for (const file of catalogueFiles(state, this.environment.config.consumer)) {
        this.emitFile(file);
      }
    },

    /**
     * Brings a page served one module per file up to date after a change to a file the last
     * composition read, and leaves every other change to the server.
     */
    hotUpdate(this: Updating, { file }: HotUpdateOptions): [] | undefined {
      return state.files.has(normalizePath(file)) ? updated(state, this) : undefined;
    },

    /**
     * Serves `virtual:product`, and the standalone page's document, entry and definition.
     *
     * @throws {@link Error} When the product did not resolve, with every problem.
     */
    load(this: Loading, id: string): string | undefined {
      if (id === RESOLVED) return served(state, importedOf(state, definition, generated), this);

      return page === undefined ? undefined : pageSourceOf(state.root, page, id);
    },

    name: "stealth:product",

    /**
     * Claims `virtual:product`, and the standalone page's document, entry and definition, leaving
     * every other import alone.
     */
    resolveId(id: string): string | undefined {
      if (id === ID) return RESOLVED;

      return page === undefined ? undefined : pageIdOf(state.root, id);
    },

    /**
     * Follows a change to a file the last composition read, which the next composition transforms
     * again, and leaves every other change alone.
     */
    async watchChange(this: Watching, id: string): Promise<void> {
      const file = normalizePath(id);

      if (!state.files.has(file)) return;

      state.changed.add(file);
      await followed(state, definition, this);
    },
  };
}
