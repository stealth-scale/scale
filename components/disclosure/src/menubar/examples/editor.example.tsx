import { type ReactElement, type ReactNode } from "react";

import { ChevronRightIcon } from "lucide-react";

import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";
import * as Menubar from "#menubar/index.ts";

interface Command {
  readonly keys?: string;
  readonly label: string;
  readonly value: string;
}

function commands(list: readonly Command[]): ReactNode {
  return list.map(({ keys, label, value }) => (
    <Menu.Item key={value} value={value}>
      <Menu.ItemText>{label}</Menu.ItemText>
      {keys === undefined ? null : <Menu.ItemCommand>{keys}</Menu.ItemCommand>}
    </Menu.Item>
  ));
}

function menu(value: string, label: string, rows: ReactNode): ReactElement {
  return (
    <Menubar.Menu value={value}>
      <Menubar.Trigger>{label}</Menubar.Trigger>
      <Portal>
        <Menubar.Content>{rows}</Menubar.Content>
      </Portal>
    </Menubar.Menu>
  );
}

export function Editor(props: Omit<Menubar.RootProps, "aria-label">): ReactElement {
  const { t } = useWords("menubar");
  const share = (
    <Menu.Root>
      <Menu.TriggerItem>
        {t("share")}
        <Menu.Indicator>
          <ChevronRightIcon />
        </Menu.Indicator>
      </Menu.TriggerItem>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {commands([
              { label: t("link"), value: "link" },
              { label: t("mail"), value: "mail" },
            ])}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );

  return (
    <Menubar.Root aria-label={t("label")} foldIndicator={<ChevronRightIcon />} {...props}>
      {menu(
        "file",
        t("file"),
        <>
          {commands([
            { keys: "⌘N", label: t("new"), value: "new" },
            { keys: "⌘O", label: t("open"), value: "open" },
            { keys: "⌘S", label: t("save"), value: "save" },
          ])}
          <Menu.Separator />
          {share}
        </>,
      )}
      {menu(
        "edit",
        t("edit"),
        <>
          {commands([
            { keys: "⌘Z", label: t("undo"), value: "undo" },
            { keys: "⇧⌘Z", label: t("redo"), value: "redo" },
          ])}
          <Menu.Separator />
          {commands([
            { keys: "⌘X", label: t("cut"), value: "cut" },
            { keys: "⌘C", label: t("copy"), value: "copy" },
            { keys: "⌘V", label: t("paste"), value: "paste" },
          ])}
        </>,
      )}
      {menu(
        "view",
        t("view"),
        commands([
          { keys: "⌘+", label: t("zoomIn"), value: "zoom-in" },
          { keys: "⌘−", label: t("zoomOut"), value: "zoom-out" },
        ]),
      )}
      {menu(
        "help",
        t("help"),
        commands([
          { label: t("docs"), value: "docs" },
          { label: t("shortcuts"), value: "shortcuts" },
        ]),
      )}
    </Menubar.Root>
  );
}
