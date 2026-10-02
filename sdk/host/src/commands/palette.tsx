/**
 * Renders the command palette: the commands a key could run and the main menu's pages, in a dialog
 * `Mod+K` opens.
 */

import { type ReactNode, useState } from "react";

import { Command, Dialog } from "@stealthscale/component-modals";
import { useHotkey } from "@stealthscale/provider-hotkeys";
import { useTranslation } from "@stealthscale/provider-i18n";
import { useNavigate, useRouteContext } from "@stealthscale/provider-router";
import {
  type CommandStatus,
  type HostRuntime,
  useCommands,
  useNavigation,
} from "@stealthscale/sdk-plugin";

import { runReporting } from "#commands/run.ts";
import { internalsOf } from "#host/internals.ts";
import { pluginWordsOf } from "#host/words.ts";
import { type HostRouterContext } from "#routes/context.ts";

/**
 * The chord that opens the palette, which the build refuses to a command.
 */
const PALETTE = "Mod+K";

/**
 * Describes one row the palette lists, with what choosing it does.
 */
interface Choice {
  /**
   * The row as the palette lists it.
   */
  readonly action: Command.CommandAction;

  /**
   * Runs the command or navigates to the page.
   */
  readonly run: () => void;
}

/**
 * Returns true for a command the palette lists: it is enabled, takes no arguments and resolves
 * with no result.
 */
function isListed({ command, enabled }: CommandStatus): boolean {
  return enabled && !command.takesArguments && !command.returnsResult;
}

/**
 * Returns the rows the palette lists: each command a key could run under its plugin's name, then
 * each page of the main menu under `Go to`.
 *
 * @remarks
 *   A command matches its catalogue's `keywords.<label>` beside its label, where the catalogue
 *   states it.
 */
function useChoices(runtime: HostRuntime): readonly Choice[] {
  const commands = useCommands();
  const entries = useNavigation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation("host");
  const words = pluginWordsOf(i18n);

  return [
    ...commands
      .filter((status) => isListed(status))
      .map((status) => {
        const { id, label, plugin } = status.command;
        const keywords = `keywords.${label}`;

        return {
          action: {
            group: words.t(plugin, "plugin.name"),
            keywords: words.exists(plugin, keywords) ? words.t(plugin, keywords) : undefined,
            label: status.label,
            shortcut: status.keys,
            value: id,
          },
          run: () => {
            runReporting(status, runtime, t("commands.failed", { label: status.label }));
          },
        };
      }),
    ...entries.map(({ href, label, routeId }) => ({
      action: { group: t("palette.goTo"), label, value: `route:${routeId}` },
      run: () => {
        void navigate({ to: href });
      },
    })),
  ];
}

/**
 * Renders the palette in a dialog that `Mod+K` opens and closes.
 *
 * @remarks
 *   Choosing a row closes the dialog, then runs the command or navigates to the page. The dialog
 *   renders where the palette renders, the `overlay` region at the end of the frame, so it needs no
 *   portal and renders on a server while closed.
 */
export function CommandPalette(): ReactNode {
  const [open, setOpen] = useState(false);
  const { host }: HostRouterContext = useRouteContext({ strict: false });
  const choices = useChoices(internalsOf(host).runtime);
  const { t } = useTranslation("host");

  useHotkey(PALETTE, () => {
    setOpen((shown) => !shown);
  });

  return (
    <Dialog.Root
      aria-label={t("palette.label")}
      onOpenChange={({ open: next }) => {
        setOpen(next);
      }}
      open={open}
      placement="top"
      scrollBehavior="inside"
      size="lg"
      variant="plain"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Command.Root
            actions={choices.map(({ action }) => action)}
            aria-label={t("palette.commands")}
            count={(matches) => t("palette.count", { count: matches })}
            onRun={(value) => {
              setOpen(false);

              for (const choice of choices) {
                if (choice.action.value === value) choice.run();
              }
            }}
          >
            <Command.Input aria-label={t("palette.search")} placeholder={t("palette.search")} />
            <Command.List>
              <Command.Empty>{t("palette.none")}</Command.Empty>
            </Command.List>
          </Command.Root>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
