/**
 * Catalogue entry for the command palette, rendering the same five actions at each size.
 *
 * @remarks
 *   The scene is generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The actions are passed as data and chosen to exercise every kind of row: two
 *   groups, shortcuts on three, and one that is disabled. Copy comes from the `command` namespace
 *   in `locales/en/specimen/command.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { type CommandAction } from "#command/action.ts";
import * as Command from "#command/index.ts";
import { recipe } from "#command/recipe.ts";

/**
 * The call site the scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    '<Command.Input placeholder="Type a command" />',
    "<Command.List />",
    "<Command.Empty>Nothing matches</Command.Empty>",
  ].join("\n"),
  imports: 'import { Command } from "@stealthscale/component-modals";',
  name: "Command.Root",
};

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
 * Draws the palette in whatever the scene hands over.
 */
function Palette(props: Command.RootProps): ReactElement {
  const { t } = useWords("command");
  const actions = useActions();

  return (
    <Command.Root {...props} actions={actions} aria-label={t("commands")}>
      <Command.Input placeholder={t("type")} />
      <Command.List />
      <Command.Empty>{t("none")}</Command.Empty>
    </Command.Root>
  );
}

export default specimen({
  about: "command.about",
  id: "components/modals/command",
  imports: 'import { Command } from "@stealthscale/component-modals";',
  scenes: scenesOf<Command.RootProps>(recipe, {
    draw: (props) => <Palette {...props} />,
    namespace: "command",
    sample: SAMPLE,
  }),
  title: "command.title",
});
