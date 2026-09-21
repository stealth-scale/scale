/**
 * The plugin built over the fixture workspace, its hooks called the way the bundler calls them.
 */

import { join } from "node:path";
import { type EnvironmentModuleNode, type HotUpdateOptions } from "vite";

import { type HookContext, hookContext, type ScratchWorkspace } from "@stealthscale/testing";

import { APP } from "#find.fixtures.ts";
import { type Changed, i18n, ID, type Options } from "#plugin.ts";

/**
 * The two fields the plugin reads from a resolved configuration.
 */
export interface Resolved {
  /**
   * Whether the bundler is building or serving.
   */
  readonly command: "build" | "serve";

  /**
   * The project root.
   */
  readonly root: string;
}

/**
 * What the update hook is called on.
 */
export interface Watching {
  /**
   * The environment a file changed in.
   */
  readonly environment: {
    /**
     * Its channel to the page.
     */
    readonly hot: { readonly send: (event: string, payload: Changed) => void };

    /**
     * Its module graph.
     */
    readonly moduleGraph: {
      /**
       * Finds a module by its resolved identifier.
       */
      readonly getModuleById: (id: string) => EnvironmentModuleNode | undefined;

      /**
       * Marks a module stale.
       */
      readonly invalidateModule?: ((node: EnvironmentModuleNode) => void) | undefined;
    };
  };
}

/**
 * The hooks, as functions rather than as whatever an object hook allows.
 */
export interface Hooks {
  /**
   * Says what is wrong, or fails the build.
   */
  readonly buildStart: (this: { readonly warn: (message: string) => void }) => void;

  /**
   * Takes the resolved configuration.
   */
  readonly configResolved: (config: Resolved) => void;

  /**
   * Adds every `locales` directory to the watcher.
   */
  readonly configureServer: (server: {
    readonly watcher: { readonly add: (paths: readonly string[]) => void };
  }) => void;

  /**
   * Follows a change under a dev server.
   */
  readonly hotUpdate: (
    this: Watching,
    options: HotUpdateOptions,
  ) => EnvironmentModuleNode[] | undefined;

  /**
   * Answers the catalogues' module and each pair's, listing what each read as files to watch.
   */
  readonly load: (this: HookContext, id: string) => string | undefined;

  /**
   * Claims this plugin's identifiers.
   */
  readonly resolveId: (id: string) => string | undefined;

  /**
   * Follows a change under a build that watches or a server that bundles.
   */
  readonly watchChange: (this: HookContext, id: string) => void;
}

/**
 * Stands in for the module's node in a module graph.
 */
// The graph holds nodes with more on them than a fixture needs, and the plugin reads the id alone.
// eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
export const MODULE = { id: `\0${ID}` } as EnvironmentModuleNode;

/**
 * Builds the plugin over the fixture workspace and resolves its configuration.
 *
 * @param scratch - The workspace.
 * @param command - Whether the bundler is building or serving. Serving by default.
 * @param options - The plugin options. None by default.
 * @returns The hooks.
 */
export function configured(
  scratch: ScratchWorkspace,
  command: Resolved["command"] = "serve",
  options: Options = {},
): Hooks {
  // The plugin is a Vite plugin, whose hooks are typed as object hooks rather than as functions.
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  const plugin = i18n(options) as unknown as Hooks;

  plugin.configResolved({ command, root: join(scratch.root, APP) });

  return plugin;
}

/**
 * Loads a module the way the bundler would, over a context that records the files watched.
 *
 * @param plugin - The hooks.
 * @param id - The resolved identifier.
 * @param context - The context the hook reads `this` from. A serving one by default.
 * @returns The source, or undefined when the module is not the plugin's.
 */
export function loading(
  plugin: Hooks,
  id: string,
  context: HookContext = hookContext(),
): string | undefined {
  return plugin.load.call(context, id);
}

/**
 * Reports a watched file's change the way the bundler would, over a context that says whether the
 * environment bundles.
 *
 * @param plugin - The hooks.
 * @param file - The file that changed.
 * @param context - The context the hook reads `this` from. A serving one that bundles by default.
 */
export function watched(
  plugin: Hooks,
  file: string,
  context: HookContext = hookContext([], "serve", true),
): void {
  plugin.watchChange.call(context, file);
}

/**
 * Describes what one update was called with and returned.
 */
export interface Updated {
  /**
   * What the hook returned.
   */
  readonly answered: EnvironmentModuleNode[] | undefined;

  /**
   * Every module the hook marked stale.
   */
  readonly invalidated: readonly EnvironmentModuleNode[];

  /**
   * Every event the hook sent, with what it carried.
   */
  readonly sent: ReadonlyArray<readonly [string, Changed]>;
}

/**
 * Runs the update hook for a file, over a graph holding the module and whichever pair modules were
 * loaded.
 *
 * @param plugin - The hooks.
 * @param file - The file that changed.
 * @param type - Whether the file was updated, created or deleted. An update by default.
 * @param loaded - The resolved identifiers of the pair modules already in the graph.
 * @returns What was sent, marked stale and returned.
 */
export function updated(
  plugin: Hooks,
  file: string,
  type: HotUpdateOptions["type"] = "update",
  ...loaded: readonly string[]
): Updated {
  const sent: Array<readonly [string, Changed]> = [];
  const invalidated: EnvironmentModuleNode[] = [];
  const nodes = new Map(
    [
      MODULE,
      // A pair module's node is read by its id alone, as the module's own is.
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
      ...loaded.map((id) => ({ id }) as EnvironmentModuleNode),
    ].map((node) => [node.id, node]),
  );
  const watching: Watching = {
    environment: {
      hot: {
        send: (event, payload) => {
          sent.push([event, payload]);
        },
      },
      moduleGraph: {
        getModuleById: (id) => nodes.get(id),
        invalidateModule: (node) => {
          invalidated.push(node);
        },
      },
    },
  };
  const answered = plugin.hotUpdate.call(watching, {
    file,
    modules: [],
    read: () => "",
    // A hot update carries the server, which nothing this plugin does reads.
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
    server: {} as HotUpdateOptions["server"],
    timestamp: 0,
    type,
  });

  return { answered, invalidated, sent };
}
