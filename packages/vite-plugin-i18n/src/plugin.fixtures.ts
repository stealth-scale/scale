/**
 * Builds the plugin over the fixture workspace and calls its hooks with the contexts a bundler
 * would pass.
 */

import { join } from "node:path";
import { type EnvironmentModuleNode, type HotUpdateOptions } from "vite";

import {
  type Change,
  type Command,
  type HookContext,
  hookContext,
  type ScratchWorkspace,
} from "@stealthscale/testing";

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
 * The environment an update hook is called on.
 */
export interface Watching {
  /**
   * The environment a file changed in.
   */
  readonly environment: {
    /**
     * The environment's channel to the page.
     */
    readonly hot: { readonly send: (event: string, payload: Changed) => void };

    /**
     * The environment's module graph.
     */
    readonly moduleGraph: {
      /**
       * Finds a module by its resolved identifier.
       */
      readonly getModuleById: (id: string) => EnvironmentModuleNode | undefined;

      /**
       * Invalidates a module, so the next import reloads it.
       */
      readonly invalidateModule?: ((node: EnvironmentModuleNode) => void) | undefined;
    };
  };
}

/**
 * The plugin's hooks, typed as plain functions.
 */
export interface Hooks {
  /**
   * Warns on an invalid catalogue, or throws during a build.
   */
  readonly buildStart: (this: { readonly warn: (message: string) => void }) => void;

  /**
   * Receives the resolved configuration.
   */
  readonly configResolved: (config: Resolved) => void;

  /**
   * Adds every `locales` directory to the watcher.
   */
  readonly configureServer: (server: {
    readonly watcher: { readonly add: (paths: readonly string[]) => void };
  }) => void;

  /**
   * Handles a catalogue change under a dev server.
   */
  readonly hotUpdate: (
    this: Watching,
    options: HotUpdateOptions,
  ) => EnvironmentModuleNode[] | undefined;

  /**
   * Serves the catalogues module and each pair module, and lists the files each one read as files
   * to watch.
   */
  readonly load: (this: HookContext, id: string) => string | undefined;

  /**
   * Claims this plugin's identifiers.
   */
  readonly resolveId: (id: string) => string | undefined;

  /**
   * Handles a change under a watching build or a server that bundles.
   */
  readonly watchChange: (
    this: HookContext,
    id: string,
    change?: { readonly event: Change },
  ) => void;
}

/**
 * A context in full bundle mode whose channel records every payload the plugin sends to the page.
 */
export interface Sending extends HookContext {
  /**
   * The environment, with its channel to the page.
   */
  readonly environment: HookContext["environment"] & {
    /**
     * Records the arguments of each call.
     */
    readonly hot: { readonly send: (...payload: readonly unknown[]) => void };
  };

  /**
   * The arguments of every call to the channel, in call order.
   */
  readonly sent: ReadonlyArray<readonly unknown[]>;
}

/**
 * Builds a context in full bundle mode whose channel records what the plugin sends.
 *
 * @param command - The command the context is built for. Serving by default.
 */
export function sending(command: Command = "serve"): Sending {
  const context = hookContext([], command, true);
  const sent: Array<readonly unknown[]> = [];

  return {
    ...context,
    environment: {
      ...context.environment,
      hot: {
        send: (...payload) => {
          sent.push(payload);
        },
      },
    },
    sent,
  };
}

/**
 * The catalogues module's node, with the identifier the plugin reads it by.
 */
// A graph node has more on it than a fixture needs, and the plugin reads the id alone.
// eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
export const MODULE = { id: `\0${ID}` } as EnvironmentModuleNode;

/**
 * Builds the plugin over the fixture workspace and resolves its configuration.
 *
 * @param scratch - The scratch workspace that contains the fixture application.
 * @param command - Whether the bundler is building or serving. Serving by default.
 * @param options - The plugin options. None by default.
 * @returns The hooks.
 */
export function configured(
  scratch: ScratchWorkspace,
  command: Resolved["command"] = "serve",
  options: Options = {},
): Hooks {
  // Vite types a plugin's hooks as object hooks, and this fixture calls them as functions.
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  const plugin = i18n(options) as unknown as Hooks;

  plugin.configResolved({ command, root: join(scratch.root, APP) });

  return plugin;
}

/**
 * Calls the load hook over a context that records the files watched.
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
 * Calls the watch change hook over a context that declares whether the environment bundles.
 *
 * @param plugin - The hooks.
 * @param file - The file that changed.
 * @param context - The context the hook reads `this` from. A serving one that bundles and records
 *   what it sends by default.
 * @param event - The kind of change the bundler reports, or undefined to report none.
 */
export function watched(
  plugin: Hooks,
  file: string,
  context: HookContext = sending(),
  event?: Change,
): void {
  plugin.watchChange.call(context, file, event === undefined ? undefined : { event });
}

/**
 * The result of one call to the update hook.
 */
export interface Updated {
  /**
   * The hook's return value.
   */
  readonly answered: EnvironmentModuleNode[] | undefined;

  /**
   * Every module the hook invalidated.
   */
  readonly invalidated: readonly EnvironmentModuleNode[];

  /**
   * Every event the hook sent, with its payload.
   */
  readonly sent: ReadonlyArray<readonly [string, Changed]>;
}

/**
 * Runs the update hook for a file, over a graph containing the catalogues module and the pair
 * modules named.
 *
 * @param plugin - The hooks.
 * @param file - The file that changed.
 * @param type - Whether the file was updated, created or deleted. An update by default.
 * @param loaded - The resolved identifiers of the pair modules already in the graph.
 * @returns The events sent, the modules invalidated and the hook's return value.
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
      // The plugin reads a pair module's node by its id alone.
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
    // A hot update includes the server, which no hook of this plugin reads.
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
    server: {} as HotUpdateOptions["server"],
    timestamp: 0,
    type,
  });

  return { answered, invalidated, sent };
}
