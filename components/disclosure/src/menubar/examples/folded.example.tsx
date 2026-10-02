import { type ReactElement } from "react";

import { ChevronRightIcon, MenuIcon } from "lucide-react";

import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";
import * as Menubar from "#menubar/index.ts";

const MENUS = [
  ["file", ["new", "open", "save"]],
  ["edit", ["undo", "redo"]],
  ["selection", ["selectAll", "expand"]],
  ["view", ["zoomIn", "zoomOut"]],
  ["go", ["goFile", "goLine"]],
  ["run", ["debug", "plain"]],
  ["terminal", ["newTerminal", "split"]],
  ["help", ["docs", "shortcuts"]],
] as const;

export function Folded(): ReactElement {
  const { t } = useWords("menubar");

  return (
    <Menubar.Root
      aria-label={t("label")}
      fold={t("fold")}
      foldIcon={<MenuIcon aria-hidden />}
      foldIndicator={<ChevronRightIcon />}
    >
      {MENUS.map(([menu, rows]) => (
        <Menubar.Menu key={menu} value={menu}>
          <Menubar.Trigger>{t(menu)}</Menubar.Trigger>
          <Portal>
            <Menubar.Content>
              {rows.map((row) => (
                <Menu.Item key={row} value={row}>
                  {t(row)}
                </Menu.Item>
              ))}
            </Menubar.Content>
          </Portal>
        </Menubar.Menu>
      ))}
    </Menubar.Root>
  );
}
