/**
 * Shows the command palette: every size, what it draws while nothing matches, and the controls
 * inside the query bar.
 *
 * @remarks
 *   The size scene is generated from the recipe, so an axis added to it reaches the page without
 *   this file changing. The actions are passed as data and chosen to exercise every kind of row:
 *   two groups, shortcuts on three, and one that is disabled. The message for an empty list goes
 *   inside `Command.List`, which draws its children in place of the rows when nothing matches.
 *   Written beside the list it was a paragraph the palette always drew, so every palette on the
 *   page said no command matched under a list of five that did. The empty scene opens the palette
 *   holding a query rather than describing what one would do. The message and the control that
 *   empties the query are both things a palette draws only once there is a query, and neither can
 *   be read off a palette that holds none. Copy comes from the `command` namespace in
 *   `locales/en/specimen/command.json`.
 */

import { type ReactElement } from "react";

import { type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { type CommandAction } from "#command/action.ts";
import * as Command from "#command/index.ts";
import { recipe } from "#command/recipe.ts";

/**
 * The path of the glass that says what the query bar is for, in a 24 unit box.
 */
const GLASS = "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M16 16l4 4";

/**
 * The path of the cross that empties the query, in the same box.
 */
const CROSS = "M6 6l12 12M18 6L6 18";

/**
 * The call site the scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    '<Command.Input indicator={<Mark d={GLASS} />} placeholder="Type a command">',
    '  <Command.Clear aria-label="Clear the query">',
    "    <Mark d={CROSS} />",
    "  </Command.Clear>",
    "</Command.Input>",
    "<Command.List>",
    "  <Command.Empty>No command matches</Command.Empty>",
    "</Command.List>",
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
 * Draws one mark at the box the slot sizes it to.
 *
 * @remarks
 *   Written out rather than taken from an icon set. The package ships none and depends on none, and
 *   a palette needs exactly two marks: the glass that says what the bar is for and the cross that
 *   empties it.
 */
function Mark({ d }: { readonly d: string }): ReactElement {
  return (
    <svg fill="none" height="100%" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d={d} strokeLinecap="round" />
    </svg>
  );
}

/**
 * Draws the query bar every palette holds: the glyph, the field and the way out of what was typed.
 */
function Bar(): ReactElement {
  const { t } = useWords("command");

  return (
    <Command.Input indicator={<Mark d={GLASS} />} placeholder={t("type")}>
      <Command.Clear aria-label={t("clear")}>
        <Mark d={CROSS} />
      </Command.Clear>
    </Command.Input>
  );
}

/**
 * Draws the palette in whatever the scene hands over.
 */
function Palette(props: Command.RootProps): ReactElement {
  const { t } = useWords("command");
  const actions = useActions();

  return (
    <Command.Root {...props} actions={actions} aria-label={t("commands")}>
      <Bar />
      <Command.List>
        <Command.Empty>{t("none")}</Command.Empty>
      </Command.List>
    </Command.Root>
  );
}

/**
 * Draws a palette holding a query nothing matches.
 */
function Narrowed(): ReactElement {
  const { t } = useWords("command");
  const actions = useActions();

  return (
    <Command.Root actions={actions} aria-label={t("commands")} query={t("missing")}>
      <Bar />
      <Command.List>
        <Command.Empty>{t("none")}</Command.Empty>
      </Command.List>
    </Command.Root>
  );
}

/**
 * The hand-written scene for what a palette draws once a query matches nothing.
 */
export const empty: Scene = {
  about: "command.empty.about",
  draw: Narrowed,
  source: [
    'import { Command } from "@stealthscale/component-modals";',
    "",
    '<Command.Root actions={actions} aria-label="Commands" query="zzz">',
    '  <Command.Input indicator={<Mark d={GLASS} />} placeholder="Type a command">',
    '    <Command.Clear aria-label="Clear the query">',
    "      <Mark d={CROSS} />",
    "    </Command.Clear>",
    "  </Command.Input>",
    "  <Command.List>",
    "    <Command.Empty>No command matches</Command.Empty>",
    "  </Command.List>",
    "</Command.Root>",
  ].join("\n"),
  title: "command.empty.title",
};

export default specimen({
  about: "command.about",
  id: "components/modals/command",
  imports: 'import { Command } from "@stealthscale/component-modals";',
  scenes: [
    ...scenesOf<Command.RootProps>(recipe, {
      draw: (props) => <Palette {...props} />,
      namespace: "command",
      sample: SAMPLE,
    }),
    empty,
  ],
  title: "command.title",
});
