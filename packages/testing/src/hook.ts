/**
 * Calls one Vite plugin hook at a time, so a specification needs neither a build nor a server.
 *
 * @remarks
 *   A hook reads the bundler's context off `this`, and a plugin may declare it as a function or as
 *   an object with a `handler`. Every driver here unwraps that object form, binds a context, and
 *   throws when the plugin declares no hook under the name.
 */

import { type Plugin } from "vite";

/**
 * The loosest signature every unwrapped hook satisfies.
 *
 * @remarks
 *   A driver passes the arguments the bundler would pass and inspects the result afterwards, so
 *   narrowing either side here would only make each driver cast.
 */
type Handler = (...args: readonly unknown[]) => unknown;

/**
 * A module graph entry reduced to the one field a plugin reads off it.
 */
export interface Graphed {
  /**
   * The resolved id the module was requested under, and the id a plugin invalidates it by.
   */
  id: string;
}

/**
 * The kinds of change a bundler reports for a file.
 */
export type Change = "create" | "delete" | "update";

/**
 * The commands a bundler runs under.
 */
export type Command = "build" | "serve";

/**
 * The `this` a hook reads, recording every call the plugin makes back through it.
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
     * The two resolved configuration fields that tell a plugin which environment it runs in.
     */
    config: {
      /**
       * The command the context was built for.
       */
      command: Command;

      /**
       * Whether the environment produces a bundled output, which a build and a dev server in full
       * bundle mode both do.
       */
      isBundled: boolean;
    };

    /**
     * The module graph, limited to the ids the context was built with.
     */
    moduleGraph: {
      /**
       * Returns the module for an id the graph was built with, and undefined for any other id.
       */
      getModuleById: (id: string) => Graphed | undefined;

      /**
       * Records a module the plugin asked to have invalidated.
       */
      invalidateModule: (module: Graphed) => void;
    };
  };

  /**
   * Every module id the plugin asked to have invalidated, in call order.
   */
  invalidated: string[];

  /**
   * Records a message the plugin reported.
   */
  warn: (message: string) => void;

  /**
   * Every message the plugin reported, in call order.
   */
  warned: string[];

  /**
   * Every file the plugin asked to have watched, in call order.
   */
  watched: string[];
}

/**
 * The resolved configuration a driven plugin is given.
 *
 * @remarks
 *   Every plugin in this repository reads `root`, so it is required. Any further field is passed
 *   to the hook unchanged.
 */
export interface Configured {
  /**
   * Any further resolved configuration field, passed to the hook unchanged.
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
 *   The module graph returns a module for the ids in `graphed` and undefined for every other id,
 *   which is what a real graph returns for a file nothing has requested yet. Vite reports
 *   `isBundled` true under a build, so `bundled` defaults to whether the command is `build`.
 * @param graphed - The module ids the graph returns a module for.
 * @param command - The command the context is built for.
 * @param bundled - Whether the environment produces a bundled output. Pass it to build a serving
 *   context in full bundle mode.
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
 * Narrows a value to a hook function when it can be called.
 */
function callable(value: unknown): value is Handler {
  return typeof value === "function";
}

/**
 * Returns the function behind a hook, declared either as a function or as an object with a
 * `handler`.
 *
 * @throws {@link Error} When the plugin declares no hook under the name, or declares one that
 *   cannot be called.
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
 *   `resolveId` returns an id or an object carrying one, and `load` and `transform` return code or
 *   an object carrying it. Both forms are read the same way here.
 * @returns The text, or undefined when the hook returned neither a string nor an object with a
 *   string under that field.
 */
function textOf(result: unknown, field: string): string | undefined {
  if (typeof result === "string") return result;

  const value: unknown =
    typeof result === "object" && result !== null ? Reflect.get(result, field) : undefined;

  return typeof value === "string" ? value : undefined;
}

/**
 * Calls the plugin's `configResolved` hook with a resolved configuration and no bound context.
 *
 * @throws {@link Error} When the plugin declares no `configResolved` hook.
 */
export async function configured(plugin: Plugin, config: Configured): Promise<void> {
  await Reflect.apply(handlerOf(plugin, "configResolved"), undefined, [config]);
}

/**
 * Calls the plugin's `buildStart` hook with the context bound as `this` and empty options.
 *
 * @throws {@link Error} When the plugin declares no `buildStart` hook.
 */
export async function started(plugin: Plugin, context: HookContext): Promise<void> {
  await Reflect.apply(handlerOf(plugin, "buildStart"), context, [{}]);
}

/**
 * Calls the plugin's `resolveId` hook with a specifier and its importer, and no bound context.
 *
 * @remarks
 *   The importer is the file containing the import. An entry has none, so it defaults to
 *   undefined.
 * @returns The id the plugin resolved the specifier to, or undefined where it declined.
 * @throws {@link Error} When the plugin declares no `resolveId` hook.
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
 * Calls the plugin's `load` hook for one module id, with the context bound as `this`.
 *
 * @param plugin - The plugin under test.
 * @param id - The resolved identifier of the module.
 * @param context - The context bound as `this`. A fresh serving context is bound where none is
 *   given, so a plugin that calls `addWatchFile` loads under a specification that asserts nothing
 *   about the watching.
 * @returns The module's code, or undefined where the plugin declined.
 * @throws {@link Error} When the plugin declares no `load` hook.
 */
export async function loaded(
  plugin: Plugin,
  id: string,
  context: HookContext = hookContext(),
): Promise<string | undefined> {
  const result: unknown = await Reflect.apply(handlerOf(plugin, "load"), context, [id, {}]);

  return textOf(result, "code");
}

/**
 * Calls the plugin's `transform` hook with a module's code and its id, and the context bound as
 * `this`.
 *
 * @returns The transformed code, or undefined where the plugin returned nothing.
 * @throws {@link Error} When the plugin declares no `transform` hook.
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
 * The two fields of a hot update that differ by the kind of change.
 */
interface Update {
  /**
   * Resolves to the file's content, or rejects where there is no file to read.
   */
  readonly read: () => Promise<string>;

  /**
   * The kind of change the dev server reports.
   */
  readonly type: Change;
}

/**
 * Calls the plugin's `hotUpdate` hook with an update built around the file, with no modules
 * already resolved and the current time as its timestamp.
 *
 * @throws {@link Error} When the plugin declares no `hotUpdate` hook.
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
 * Calls the plugin's `hotUpdate` hook with an update of type `update`, reporting an edited file.
 *
 * @remarks
 *   The update's `read` resolves to `content`, which defaults to the empty string for a plugin
 *   that never reads it.
 * @throws {@link Error} When the plugin declares no `hotUpdate` hook.
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
 * Calls the plugin's `hotUpdate` hook with an update of type `create`, reporting a new file.
 *
 * @remarks
 *   The update's `read` resolves to `content`, which defaults to the empty string for a plugin
 *   that never reads it.
 * @throws {@link Error} When the plugin declares no `hotUpdate` hook.
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
 * Calls the plugin's `hotUpdate` hook with an update of type `delete`, reporting a removed file.
 *
 * @remarks
 *   The update's `read` rejects with ENOENT, as the dev server's does for a file that is gone, so
 *   a plugin that reads a deleted file fails here the way it would in production.
 * @throws {@link Error} When the plugin declares no `hotUpdate` hook.
 */
export async function removed(plugin: Plugin, context: HookContext, file: string): Promise<void> {
  await hotUpdated(plugin, context, file, {
    read: (): Promise<string> =>
      Promise.reject(new Error(`ENOENT: no such file or directory, open '${file}'`)),
    type: "delete",
  });
}

/**
 * Calls the plugin's `watchChange` hook with a file and the event reported for it, with the
 * context bound as `this`.
 *
 * @remarks
 *   A plugin reads the command off `context.environment.config` to distinguish a build from a dev
 *   server, so build the context with the command the case is about.
 * @throws {@link Error} When the plugin declares no `watchChange` hook.
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
 * Calls the plugin's `generateBundle` hook with `bundling` bound as `this`, empty options, an
 * empty bundle, and `isWrite` false.
 *
 * @remarks
 *   The context is the caller's own object rather than a {@link HookContext}, because a plugin
 *   emitting files reads members no other driver needs. Only the members the plugin under test
 *   calls need to be on it.
 * @throws {@link Error} When the plugin declares no `generateBundle` hook.
 */
export async function generated(plugin: Plugin, bundling: object): Promise<void> {
  await Reflect.apply(handlerOf(plugin, "generateBundle"), bundling, [{}, {}, false]);
}
