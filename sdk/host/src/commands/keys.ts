/**
 * Binds the keys of the product's commands: one registration per chord, which runs the first
 * enabled command of the chord.
 */

import { type ReactNode } from "react";

import { type Hotkey, normalizeHotkey, useHotkeys } from "@stealthscale/provider-hotkeys";
import { useTranslation } from "@stealthscale/provider-i18n";
import { useRouteContext } from "@stealthscale/provider-router";
import { type CommandStatus, useCommands } from "@stealthscale/sdk-plugin";

import { runReporting } from "#commands/run.ts";
import { internalsOf } from "#host/internals.ts";
import { type HostRouterContext } from "#routes/context.ts";

/**
 * Returns the commands that bind keys, grouped by chord in the form the operating system reads,
 * each group in install order.
 */
function chordsOf(
  commands: readonly CommandStatus[],
): ReadonlyMap<Hotkey, readonly CommandStatus[]> {
  const chords = new Map<Hotkey, readonly CommandStatus[]>();

  for (const status of commands) {
    const { keys } = status.command;

    if (keys === undefined) continue;

    const chord = normalizeHotkey(keys);

    chords.set(chord, [...(chords.get(chord) ?? []), status]);
  }

  return chords;
}

/**
 * Binds every chord the product's commands bind, and renders nothing.
 *
 * @remarks
 *   One registration per chord, because the hotkeys library runs every handler registered for a
 *   chord. A press runs the first command of the chord, in install order, whose `enabled` is true,
 *   without arguments, and runs nothing where none is. A chord with `Mod` runs while a text field
 *   has focus, and a single key or a `Shift` or `Alt` chord does not, the library's defaults. A
 *   command that rejects is reported as `command-failed` and raises an error toast.
 */
export function CommandKeys(): ReactNode {
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const { runtime } = internalsOf(host);
  const commands = useCommands();
  const { t } = useTranslation("host");

  useHotkeys(
    [...chordsOf(commands)].map(([hotkey, bound]) => ({
      callback: (): void => {
        const first = bound.find(({ enabled }) => enabled);

        if (first !== undefined) {
          runReporting(first, runtime, t("commands.failed", { label: first.label }));
        }
      },
      hotkey,
    })),
  );

  return null;
}
