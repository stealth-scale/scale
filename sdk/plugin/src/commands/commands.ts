/**
 * Reads commands in a component: their translated labels, their keys, whether they may run, and
 * the function that runs them.
 *
 * @remarks
 *   A command's label, keys and condition are data in the resolved product, so a control renders
 *   its state before the command's module loads. The host checks the condition again when the
 *   command runs, so a control rendered before a permission was revoked cannot run it.
 */

import { formatForDisplay } from "@stealthscale/provider-hotkeys";
import { useTranslation } from "@stealthscale/provider-i18n";
import {
  type CommandArguments,
  type CommandReference,
  type CommandResult,
  evaluateWhen,
  pluginOf,
  type ResolvedCommand,
} from "@stealthscale/sdk-core";

import { conditionContextOf } from "#conditions/context.ts";
import { useMatched } from "#conditions/matched.ts";
import { type HostStores } from "#host/stores.ts";
import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";

/**
 * Describes one command as a component reads it.
 */
export interface Command<R extends CommandReference = CommandReference> {
  /**
   * True where the command's plugin is on and its condition is true now.
   */
  readonly enabled: boolean;

  /**
   * Keys formatted for the person's operating system, `⌘ ⇧ R` or `Ctrl+Shift+R`. Absent where the
   * command binds none.
   */
  readonly keys?: string | undefined;

  /**
   * The command's text, translated.
   */
  readonly label: string;

  /**
   * Runs the command with its arguments, and resolves with its result. Rejects where the command's
   * condition is false or no installed plugin declares it.
   */
  readonly run: (...args: CommandArguments<R>) => Promise<CommandResult<R>>;
}

/**
 * Describes one command of an installed plugin, for a menu or a toolbar that lists them.
 */
export interface CommandStatus extends Omit<Command, "run"> {
  /**
   * The command as the build resolved it.
   */
  readonly command: ResolvedCommand;

  /**
   * Runs the command, with its arguments where it takes some, and resolves with its result.
   */
  readonly run: (args?: unknown) => Promise<unknown>;
}

/**
 * Returns true where a command may run: its plugin is on and its condition is true for the stores
 * and the matched routes.
 *
 * @param command - The command as the build resolved it.
 * @param stores - The stores of the host that runs the command.
 * @param matched - Qualified ids of the matched routes, outermost first.
 */
export function isCommandEnabled(
  command: ResolvedCommand,
  stores: Pick<HostStores, "availability" | "flags" | "session">,
  matched: ReadonlySet<string> | undefined,
): boolean {
  return (
    stores.availability.get()[command.plugin]?.on === true &&
    evaluateWhen(command.when, conditionContextOf(stores, { matched }))
  );
}

/**
 * Returns keys in TanStack Hotkeys notation formatted for the person's operating system.
 */
function displayed(keys: string | undefined): string | undefined {
  return keys === undefined ? keys : formatForDisplay(keys);
}

/**
 * Returns the command a reference names, and renders again when `enabled` changes.
 *
 * @remarks
 *   A command no installed plugin declares, such as an optional plugin's, is disabled. Its label is
 *   the reference's own, translated in its plugin's catalogue, and the command's qualified id where
 *   the reference states none.
 * @param reference - The command, by reference.
 */
export function useCommand<R extends CommandReference>(reference: R): Command<R> {
  const { product, run, stores } = useHost("useCommand");
  const command = product.commands.find(({ id }) => id === reference.id);
  const { t } = useTranslation(command?.plugin ?? pluginOf(reference.id));
  const matched = useMatched();
  const enabled = useSelector(
    [stores.availability, stores.flags, stores.session],
    () => command !== undefined && isCommandEnabled(command, stores, matched),
  );
  const label = command?.label ?? reference.label;

  return {
    enabled,
    keys: displayed(command?.keys),
    label: label === undefined ? reference.id : t(label),
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the host resolves with the command's result, which the reference types
    run: (...args) => run(reference.id, args[0]) as Promise<CommandResult<R>>,
  };
}

/**
 * Returns every command of the installed plugins, in install order, and renders again when one
 * turns enabled or disabled.
 *
 * @remarks
 *   The selector returns one character per command, `1` where it is enabled, because React compares
 *   a string by its value.
 */
export function useCommands(): readonly CommandStatus[] {
  const { product, run, stores } = useHost("useCommands");
  const { t } = useTranslation(product.plugins.map(({ id }) => id));
  const matched = useMatched();
  const enabled = useSelector([stores.availability, stores.flags, stores.session], () =>
    product.commands
      .map((command) => (isCommandEnabled(command, stores, matched) ? "1" : "0"))
      .join(""),
  );

  return product.commands.map((command, index) => ({
    command,
    enabled: enabled[index] === "1",
    keys: displayed(command.keys),
    label: t(command.label, { ns: command.plugin }),
    run: (args) => run(command.id, args),
  }));
}
