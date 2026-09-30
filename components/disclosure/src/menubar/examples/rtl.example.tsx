import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";
import * as Menubar from "#menubar/index.ts";

const MENUS = [
  ["edit", ["undo", "redo"]],
  ["view", ["zoomIn", "zoomOut"]],
] as const;

export function Rtl(): ReactElement {
  const { t } = useWords("menubar.rtl");

  return (
    <Menubar.Root aria-label={t("label")} dir="rtl">
      <Menubar.Menu value="file">
        <Menubar.Trigger>{t("file")}</Menubar.Trigger>
        <Portal>
          <Menubar.Content>
            <Menu.Item value="new">{t("new")}</Menu.Item>
            <Menu.Item value="open">{t("open")}</Menu.Item>
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
                    <Menu.Item value="link">{t("link")}</Menu.Item>
                    <Menu.Item value="mail">{t("mail")}</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Menubar.Content>
        </Portal>
      </Menubar.Menu>
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
