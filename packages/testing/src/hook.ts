/**
 * Calls a plugin's hooks the way a bundler would, so a specification runs a plugin without a
 * build.
 *
 * @remarks
 *   A plugin is mostly hooks, and a hook reads `this` for the context the bundler binds. Each
 *   driver here binds the part of that context the house plugins read and returns what the hook
 *   produced, so a specification asserts on the stylesheet a plugin served or the file it asked to
 *   watch rather than on the shape of the plugin object. Every driver throws when the plugin has no
 *   such hook.
 */

import { type Plugin } from "vite";

/**
 * Fixes the signature every hook has once its object form is unwrapped.
 */
type Handler = (...args: readonly unknown[]) => unknown;

/**
 * A module as a module graph hands one back, cut down to the field a plugin reads.
 */
export interface Graphed {
  /**
   * The id the module was requested under, which is what a plugin invalidates it by.
   */
  id: string;
}

/**
 * The kinds of change a bundler reports about a file.
 */
export type Change = "create" | "delete" | "update";

/**
 * The commands a bundler runs under, which a plugin reads off its environment.
 */
export type Command = "build" | "serve";

/**
 * Carries what a hook reads off `this`, and records what the hook asked the bundler for.
 */
export interface HookContext {
  /**
   * Records a file the plugin asked to have watched.
   */
  addWatchFile: (file: string) => void;

  /**
   * The environment a hook reads its module graph and its command from.
   */
  environment: {
    /**
     * The part of the environment's configuration a plugin reads to tell a build from a server,
     * and a server that bundles from one that serves a module per file.
     */
    config: {
      /**
       * The command the context was built for.
       */
      command: Command;

      /**
       * Whether the environment produces a bundled output, which a build does and a dev server
       * that bundles does.
       */
      isBundled: boolean;
    };

    /**
     * The graph, answering for the ids the context was built with and for nothing else.
     */
    moduleGraph: {
      /**
       * Returns the module under an id the graph holds, and undefined for any other id.
       */
      getModuleById: (id: string) => Graphed | undefined;

      /**
       * Records a module the plugin asked to have invalidated.
       */
      invalidateModule: (module: Graphed) => void;
    };
  };

  /**
   * Every module id the plugin asked to have invalidated, in order.
   */
  invalidated: string[];

  /**
   * Records a message the plugin reported.
   */
  warn: (message: string) => void;

  /**
   * Every message the plugin reported, in order.
   */
  warned: string[];

  /**
   * Every file the plugin asked to have watched, in order.
   */
  watched: string[];
}

/**
 * The fields a resolved configuration carries to a plugin driven here.
 *
 * @remarks
 *   The root is the one field every house plugin reads. Any further field the plugin under test
 *   reads is handed to the hook as given.
 */
export interface Configured {
  /**
   * Any further field of a resolved configuration, handed to the hook as given.
   */
  [field: string]: unknown;

  /**
   * The project directory the bundler resolved, absolute.
   */
  root: string;
}

/**
 * Builds the context a hook reads `this` from.
 *
 * @remarks
 *   The module graph answers for the ids in `graphed` and for nothing else, which is what a real
 *   graph answers for a file nothing has requested yet. The command is `serve` unless a
 *   specification states `build`, and the environment bundles under a build unless a
 *   specification says otherwise, as Vite's own does.
 * @param graphed - The module ids the graph holds.
 * @param command - The command the context is built for.
 * @param bundled - Whether the environment produces a bundled output.
 */
export function hookContext(
  graphed: readonly string[] = [],
  command: Command = "serve",
  bundled: boolean = command === "build",
): HookContext {
  const invalidated: string[] = [];
  const warned: string[] = [];
  const watched: string[] = [];

  return {
    addWatchFile: (file) => void watched.push(file),
    environment: {
      config: { command, isBundled: bundled },
      moduleGraph: {
        getModuleById: (id) => (graphed.includes(id) ? { id } : undefined),
        invalidateModule: (module) => void invalidated.push(module.id),
      },
    },
    invalidated,
    warn: (message) => void warned.push(message),
    warned,
    watched,
  };
}

/**
 * Reports whether a value can be called.
 */
function callable(value: unknown): value is Handler {
  return typeof value === "function";
}

/**
 * Finds the function behind a hook, whether the plugin wrote it as a function or as an object with
 * a `handler`.
 *
 * @throws {@link Error} When the plugin has no such hook.
 */
function handlerOf(plugin: Plugin, name: keyof Plugin): Handler {
  const hook: unknown = plugin[name];
  const handler: unknown =
    typeof hook === "object" && hook !== null ? Reflect.get(hook, "handler") : hook;

  if (!callable(handler)) throw new Error(`${plugin.name} has no ${name} hook`);

  return handler;
}

/**
 * Reads the text a hook returned, either as the whole result or as one field of an object.
 *
 * @remarks
 *   A resolve hook may return an id or an object carrying one, and a load or transform hook may
 *   return code or an object carrying it, so both spellings read the same.
 * @returns The text, or undefined when the hook returned nothing usable.
 */
function textOf(result: unknown, field: string): string | undefined {
  if (typeof result === "string") return result;

  const value: unknown =
    typeof result === "object" && result !== null ? Reflect.get(result, field) : undefined;

  return typeof value === "string" ? value : undefined;
}

/**
 * Tells the plugin what the bundler resolved, the way `configResolved` would.
 *
 * @throws {@link Error} When the plugin has no `configResolved` hook.
 */
export async function configured(plugin: Plugin, config: Configured): Promise<void> {
  await Reflect.apply(handlerOf(plugin, "configResolved"), undefined, [config]);
}

/**
 * Starts the plugin, the way a build or a dev server would at `buildStart`.
 *
 * @throws {@link Error} When the plugin has no `buildStart` hook.
 */
export async function started(plugin: Plugin, context: HookContext): Promise<void> {
  await Reflect.apply(handlerOf(plugin, "buildStart"), context, [{}]);
}

/**
 * Asks the plugin to resolve a specifier, the way a bundler would at `resolveId`.
 *
 * @remarks
 *   The importer is the file that wrote the import, and is absent for an entry.
 * @returns The id the plugin resolved the specifier to, or undefined where it declined.
 * @throws {@link Error} When the plugin has no `resolveId` hook.
 */
export async function resolved(
  plugin: Plugin,
  id: string,
  importer?: string,
): Promise<string | undefined> {
  const result: unknown = await Reflect.apply(handlerOf(plugin, "resolveId"), undefined, [
    id,
    importer,
    {},
  ]);

  return textOf(result, "id");
}

/**
 * Asks the plugin to load a module, the way a bundler would at `load`.
 *
 * @param plugin - The plugin under test.
 * @param id - The resolved identifier of the module.
 * @param context - The context the hook reads `this` from, for a plugin that watches a file
 *   while loading. Nothing is bound where it is absent.
 * @returns The module's code, or undefined where the plugin declined.
 * @throws {@link Error} When the plugin has no `load` hook.
 */
export async function loaded(
  plugin: Plugin,
  id: string,
  context?: HookContext,
): Promise<string | undefined> {
  const result: unknown = await Reflect.apply(handlerOf(plugin, "load"), context, [id, {}]);

  return textOf(result, "code");
}

/**
 * Hands the plugin a module to transform, the way a bundler would at `transform`.
 *
 * @remarks
 *   The code is the module's content before the plugin sees it.
 * @returns The code the plugin wrote back, or undefined where it passed on the module.
 * @throws {@link Error} When the plugin has no `transform` hook.
 */
export async function transformed(
  plugin: Plugin,
  context: HookContext,
  code: string,
  id: string,
): Promise<string | undefined> {
  const result: unknown = await Reflect.apply(handlerOf(plugin, "transform"), context, [
    code,
    id,
    {},
  ]);

  return textOf(result, "code");
}

/**
 * The part of a hot update that differs between a file that changed, appeared or is gone.
 */
interface Update {
  /**
   * Reads the file back the way the server would, or rejects where there is no file to read.
   */
  readonly read: () => Promise<string>;

  /**
   * The kind of change the server reports.
   */
  readonly type: Change;
}

/**
 * Calls `hotUpdate` with one update, the way a dev server would.
 *
 * @throws {@link Error} When the plugin has no `hotUpdate` hook.
 */
async function hotUpdated(
  plugin: Plugin,
  context: HookContext,
  file: string,
  update: Update,
): Promise<void> {
  await Reflect.apply(handlerOf(plugin, "hotUpdate"), context, [
    { file, modules: [], read: update.read, timestamp: Date.now(), type: update.type },
  ]);
}

/**
 * Tells the plugin a file changed, the way a dev server would at `hotUpdate`.
 *
 * @remarks
 *   The update's `read` resolves to `content`, which stands for the text the server reads back from
 *   the file.
 * @throws {@link Error} When the plugin has no `hotUpdate` hook.
 */
export async function updated(
  plugin: Plugin,
  context: HookContext,
  file: string,
  content = "",
): Promise<void> {
  await hotUpdated(plugin, context, file, {
    read: (): Promise<string> => Promise.resolve(content),
    type: "update",
  });
}

/**
 * Tells the plugin a file appeared, the way a dev server would at `hotUpdate`.
 *
 * @remarks
 *   The update's `read` resolves to `content`, which stands for the text the server reads back from
 *   the new file.
 * @throws {@link Error} When the plugin has no `hotUpdate` hook.
 */
export async function created(
  plugin: Plugin,
  context: HookContext,
  file: string,
  content = "",
): Promise<void> {
  await hotUpdated(plugin, context, file, {
    read: (): Promise<string> => Promise.resolve(content),
    type: "create",
  });
}

/**
 * Tells the plugin a file is gone, the way a dev server would at `hotUpdate`.
 *
 * @remarks
 *   The update's `read` rejects, because the server reads the file from disk and there is no file
 *   left to read. A plugin that reads a deleted file fails here the way it would under the server.
 * @throws {@link Error} When the plugin has no `hotUpdate` hook.
 */
export async function removed(plugin: Plugin, context: HookContext, file: string): Promise<void> {
  await hotUpdated(plugin, context, file, {
    read: (): Promise<string> =>
      Promise.reject(new Error(`ENOENT: no such file or directory, open '${file}'`)),
    type: "delete",
  });
}

/**
 * Tells the plugin a watched file changed, the way a bundler would at `watchChange`.
 *
 * @remarks
 *   The plugin reads the context as `this`, and reads the command off its environment to tell a
 *   build from a server.
 * @throws {@link Error} When the plugin has no `watchChange` hook.
 */
export async function changed(
  plugin: Plugin,
  context: HookContext,
  file: string,
  event: Change,
): Promise<void> {
  await Reflect.apply(handlerOf(plugin, "watchChange"), context, [file, { event }]);
}

/**
 * Hands the plugin a finished build, the way a bundler would at `generateBundle`.
 *
 * @remarks
 *   The plugin reads `bundling` as `this`, so a specification hands in a stand-in for the bundler's
 *   own context that carries the members the plugin under test calls.
 * @throws {@link Error} When the plugin has no `generateBundle` hook.
 */
export async function generated(plugin: Plugin, bundling: object): Promise<void> {
  await Reflect.apply(handlerOf(plugin, "generateBundle"), bundling, [{}, {}, false]);
}
