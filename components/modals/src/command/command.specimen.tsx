/**
 * Catalogue entry for the command palette, rendering the same five actions at each size.
 *
 * @remarks
 *   The size values come from the recipe, so a value added to the theme appears on the page without
 *   an edit here. The actions are passed as data and chosen to exercise every kind of row: two
 *   groups, shortcuts on three, and one that is disabled. Copy comes from the `command` namespace
 *   in `locales/en/specimen/command.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { type CommandAction } from "#command/action.ts";
import * as Command from "#command/index.ts";
import { recipe } from "#command/recipe.ts";

/**
 * Builds the scene's five actions with their labels and groups translated.
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
 * Renders one palette per size the recipe declares.
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
 * Scene covering the size variant.
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
