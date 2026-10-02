/**
 * Runs commands by qualified id: checks each command's plugin and condition at the moment of the
 * run, imports its module once, resolves its needs, and calls it with the host's API.
 */

import {
  type CommandRun,
  type HostApi,
  type LazyCommand,
  type Product,
  type ResolvedCommand,
} from "@stealthscale/sdk-core";
import { type HostStores, isCommandEnabled } from "@stealthscale/sdk-plugin";

/**
 * Lists what the registry is created from.
 */
export interface RegistryOptions {
  /**
   * Returns the host's API as a command of a plugin sees it at the time of a run.
   */
  readonly hostOf: (pluginId: string) => HostApi;

  /**
   * Returns the qualified ids of the matched routes, outermost first, or undefined where no route
   * matches.
   */
  readonly matched: () => ReadonlySet<string> | undefined;

  /**
   * The commands, and the manifests whose importers load each command's module.
   */
  readonly product: Pick<Product, "commands" | "manifests">;

  /**
   * The stores a command's condition reads.
   */
  readonly stores: Pick<HostStores, "availability" | "flags" | "session">;
}

/**
 * Runs a command by its qualified id with its arguments, and resolves with its result.
 */
export type RunCommand = (commandId: string, args?: unknown) => Promise<unknown>;

/**
 * Types a command's function as the registry calls it, with what the caller gave.
 */
type Run = CommandRun<unknown, unknown, unknown>;

/**
 * Returns the one function a command's module exports.
 *
 * @throws {@link Error} Where the module exports no function or more than one.
 */
function functionOf(module: Readonly<Record<string, unknown>>, commandId: string): Run {
  const found = Object.values(module).filter((value) => typeof value === "function");

  if (found.length !== 1) {
    throw new Error(
      `The module of ${commandId} exports ${String(found.length)} functions, and a command's module exports one.`,
    );
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the manifest's types make the module's one function the command
  return found[0] as Run;
}

/**
 * Returns the function that runs a command by its qualified id with its arguments.
 *
 * @remarks
 *   A run rejects where no installed plugin declares the command, and where its plugin is off or
 *   its condition is false at the moment of the run, so a control rendered before a permission was
 *   revoked cannot run it. The module of each importer is imported once. An import that fails is
 *   forgotten, so the next run imports again. Each need is a function that runs the needed command
 *   through the same checks. The call runs inside the `stealth:command:<id>` performance measure.
 *   A run that is in progress when its plugin turns off completes.
 */
export function createCommandRegistry({
  hostOf,
  matched,
  product,
  stores,
}: RegistryOptions): RunCommand {
  const imports = new Map<LazyCommand, Promise<Run>>();

  /**
   * Returns the function of a command's module, imported once per importer.
   */
  const imported = (command: ResolvedCommand): Promise<Run> => {
    const entries = product.manifests[command.plugin]?.code.commands ?? {};
    const entry = entries[command.id.slice(command.plugin.length + 1)];

    if (entry === undefined) {
      return Promise.reject(new Error(`No manifest maps the command ${command.id} to code.`));
    }

    const known = imports.get(entry.run);

    if (known !== undefined) return known;

    const loading = entry.run().then((module) => functionOf(module, command.id));

    imports.set(entry.run, loading);
    loading.catch(() => {
      imports.delete(entry.run);
    });

    return loading;
  };

  /**
   * Runs a command by its qualified id, and resolves with its result.
   */
  const run = async (commandId: string, args?: unknown): Promise<unknown> => {
    const command = product.commands.find(({ id }) => id === commandId);

    if (command === undefined) {
      throw new Error(`No installed plugin declares the command ${commandId}.`);
    }

    if (!isCommandEnabled(command, stores, matched())) {
      throw new Error(`The command ${commandId} cannot run: its condition is false.`);
    }

    const call = await imported(command);
    const needs = Object.fromEntries(
      Object.entries(command.needs).map(([name, needed]) => [
        name,
        (given?: unknown): Promise<unknown> => run(needed, given),
      ]),
    );
    const start = performance.now();

    try {
      return await call(args, needs, hostOf(command.plugin));
    } finally {
      performance.measure(`stealth:command:${commandId}`, { start });
    }
  };

  return run;
}
