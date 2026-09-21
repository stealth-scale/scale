/**
 * Shows the command palette: every size, each holding the same six actions under two headings.
 *
 * @remarks
 *   The axis is read off the recipe, so a size added to the theme reaches the page without this
 *   file changing. The actions go in as data, with a keystroke on two of them and one that cannot
 *   be run, so the list shows every kind of row. The words are keys under `command` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/command.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { type CommandAction } from "#command/action.ts";
import * as Command from "#command/index.ts";
import { recipe } from "#command/recipe.ts";

/**
 * Builds the six actions in the reader's language.
 */
function useActions(): readonly CommandAction[] {
  const { t } = useWords("command");

  return [
    { group: t("invoices"), label: t("new"), shortcut: "⌘N", value: "new" },
    { group: t("invoices"), label: t("duplicate"), value: "duplicate" },
    { disabled: true, group: t("invoices"), label: t("archive"), value: "archive" },
    { group: t("navigation"), label: t("overview"), shortcut: "G O", value: "overview" },
    { group: t("navigation"), label: t("settings"), shortcut: "G S", value: "settings" },
  ];
}

/**
 * Draws the palette at every size.
 */
function Sizes(): ReactElement {
  const { t } = useWords("command");
  const actions = useActions();

  return (
    <Matrix knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <Command.Root actions={actions} aria-label={t("commands")} size={size}>
          <Command.Input placeholder={t("type")} />
          <Command.List />
          <Command.Empty>{t("none")}</Command.Empty>
        </Command.Root>
      )}
    </Matrix>
  );
}

/**
 * Every size.
 */
export const sizes: Scene = {
  about: "command.sizes.about",
  draw: Sizes,
  title: "command.sizes.title",
};

export default specimen({
  about: "command.about",
  group: "Modals",
  id: "modals/command",
  imports: 'import { Command } from "@stealthscale/component-modals";',
  scenes: [sizes],
  title: "command.title",
});
