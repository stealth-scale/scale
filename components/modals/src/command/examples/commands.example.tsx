import { type ReactElement } from "react";

import {
  ArchiveIcon,
  CopyIcon,
  FilePlusIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Command from "#command/index.ts";

export function Commands(props: Omit<Command.RootProps, "actions" | "aria-label">): ReactElement {
  const { t } = useWords("command");
  const actions: Command.CommandAction[] = [
    {
      group: t("invoices"),
      icon: <FilePlusIcon size="1em" />,
      keywords: t("newKeywords"),
      label: t("new"),
      shortcut: "⌘N",
      value: "new",
    },
    {
      group: t("invoices"),
      icon: <CopyIcon size="1em" />,
      label: t("duplicate"),
      value: "duplicate",
    },
    {
      disabled: true,
      group: t("invoices"),
      icon: <ArchiveIcon size="1em" />,
      label: t("archive"),
      value: "archive",
    },
    {
      group: t("navigation"),
      icon: <LayoutDashboardIcon size="1em" />,
      label: t("overview"),
      shortcut: "G O",
      value: "overview",
    },
    {
      group: t("navigation"),
      icon: <SettingsIcon size="1em" />,
      label: t("settings"),
      shortcut: "G S",
      value: "settings",
    },
  ];

  return (
    <Command.Root {...props} actions={actions} aria-label={t("commands")}>
      <Command.Input indicator={<SearchIcon size="100%" />} placeholder={t("type")}>
        <Command.Clear aria-label={t("clear")}>
          <XIcon size="100%" />
        </Command.Clear>
      </Command.Input>
      <Command.List>
        <Command.Empty>{t("none")}</Command.Empty>
      </Command.List>
    </Command.Root>
  );
}
