/**
 * Checks every command's keys, sample and needs, and resolves the commands and the events.
 *
 * @remarks
 *   A key press runs a command without arguments and hands no result to anybody, so only a command
 *   without either binds keys. The host binds `Mod+K` to the palette, which is `Meta+K` on a Mac
 *   and `Control+K` elsewhere, so the build refuses all three. Two commands may bind one chord
 *   where their conditions exclude each other, so a shared chord is a warning.
 */

import { pluginOf } from "#identifiers.ts";
import { type Declaration, pathOf, type ResolveContext } from "#resolve/context.ts";
import { declarationsOf, type Declared } from "#resolve/declared.ts";
import { type Report } from "#resolve/problem.ts";
import { type ResolvedCommand, type ResolvedEvent } from "#resolve/resolved.ts";

/**
 * Describes a declared command.
 */
type CommandDeclaration = Declaration<Declared<"command">>;

/**
 * The modifiers TanStack Hotkeys reads under another name, by the name a binding may state.
 */
const ALIASES: Readonly<Record<string, string>> = {
  cmd: "meta",
  command: "meta",
  commandorcontrol: "mod",
  ctrl: "control",
  option: "alt",
  os: "meta",
  win: "meta",
};

/**
 * The chords of the palette's binding on every platform.
 */
const PALETTE = new Set(["control+k", "meta+k", "mod+k"]);

/**
 * Writes a binding the one way two bindings compare: lowercase, aliases resolved, the modifiers
 * sorted before the key.
 *
 * @param keys - The binding in TanStack Hotkeys notation, `Mod+Shift+R`.
 */
export function chordOf(keys: string): string {
  const parts = keys.split("+").map((part) => part.trim().toLowerCase());
  const modifiers = parts.slice(0, -1).map((one) => ALIASES[one] ?? one);

  return [...modifiers.toSorted(), ...parts.slice(-1)].join("+");
}

/**
 * Checks one command's binding: readable, on a command without arguments or a result, and not the
 * palette's.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param declaration - The declared command.
 * @param keys - The binding.
 * @param report - The report the faults go into.
 */
function checkKeys(
  context: ResolveContext,
  declaration: CommandDeclaration,
  keys: string,
  report: Report,
): void {
  const { arguments: takes, result } = declaration.reference;
  const at = `${pathOf(declaration)}.keys`;
  const check = context.options.validateHotkey?.(keys);

  if (check?.valid === false) report.problem(at, `cannot be read: ${check.errors.join(", ")}`);

  if (takes === true) report.problem(at, "is refused on a command that takes arguments");

  if (result === true) report.problem(at, "is refused on a command that resolves with a result");

  if (PALETTE.has(chordOf(keys))) report.problem(at, `binds ${keys}, which opens the palette`);
}

/**
 * Checks the commands a command's code needs: each its own plugin's, or a plugin's it requires.
 *
 * @param declaration - The declared command.
 * @param report - The report the faults go into.
 */
function checkNeeds(declaration: CommandDeclaration, report: Report): void {
  const { code, contract, name, plugin } = declaration;
  const required = new Set(contract.requires.map((one) => one.pluginId));

  for (const [key, need] of Object.entries(code.commands?.[name]?.needs ?? {})) {
    const owner = pluginOf(need.id);

    if (owner !== plugin && !required.has(owner)) {
      report.problem(
        `${plugin}.code.commands.${name}.needs.${key}`,
        `names the command ${need.id}, and ${plugin} does not require ${owner}`,
      );
    }
  }
}

/**
 * Checks one command, and warns where an earlier command binds its chord.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param declaration - The declared command.
 * @param chords - The command that first bound each chord, which this command's chord joins.
 * @param report - The report the faults go into.
 */
function checkCommand(
  context: ResolveContext,
  declaration: CommandDeclaration,
  chords: Map<string, string>,
  report: Report,
): void {
  const { arguments: takes, id, keys, sample } = declaration.reference;
  const at = pathOf(declaration);

  if (takes === true && sample === undefined) {
    report.problem(`${at}.sample`, "is required on a command that takes arguments");
  }

  checkNeeds(declaration, report);

  if (keys === undefined) return;

  const other = chords.get(chordOf(keys));

  checkKeys(context, declaration, keys, report);

  if (other === undefined) chords.set(chordOf(keys), id);
  else report.warning(`${at}.keys`, `binds ${keys}, as ${other} does`);
}

/**
 * Describes the commands and the events the build resolved.
 */
export interface Commanded {
  /**
   * Every command, in install order.
   */
  readonly commands: readonly ResolvedCommand[];

  /**
   * Every event, the host's first.
   */
  readonly events: readonly ResolvedEvent[];
}

/**
 * Checks every command and the chords they share, and resolves every command and event.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function resolveCommands(context: ResolveContext, report: Report): Commanded {
  const chords = new Map<string, string>();
  const commands = declarationsOf(context, "command");

  for (const declaration of commands) checkCommand(context, declaration, chords, report);

  return {
    commands: commands.map(({ code, name, plugin, reference }) => ({
      id: reference.id,
      keys: reference.keys,
      label: reference.label,
      needs: Object.fromEntries(
        Object.entries(code.commands?.[name]?.needs ?? {}).map(([key, need]) => [key, need.id]),
      ),
      plugin,
      returnsResult: reference.result === true,
      takesArguments: reference.arguments === true,
      when: reference.when,
    })),
    events: declarationsOf(context, "event").map(({ plugin, reference }) => ({
      emit: reference.emit ?? "owner",
      id: reference.id,
      plugin,
      sticky: reference.sticky === true,
    })),
  };
}
