import { type ReactElement } from "react";

import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";
import * as Menubar from "#menubar/index.ts";

const MENUS = [
  ["file", ["new", "open", "save"]],
  ["edit", ["undo", "redo"]],
  ["view", ["zoomIn", "zoomOut"]],
] as const;

export function Stop(): ReactElement {
  const { t } = useWords("menubar");

  return (
    <Stack direction="row" gap="md" wrap>
      <Button variant="ghost">
        <ArrowLeftIcon />
        {t("back")}
      </Button>
      <Menubar.Root aria-label={t("label")}>
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
      <Button>{t("publish")}</Button>
    </Stack>
  );
}
