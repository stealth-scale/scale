import { type ReactElement, useState } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Portal } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";
import * as Menubar from "#menubar/index.ts";

const MENUS = [
  ["file", ["new", "open", "save"]],
  ["edit", ["undo", "redo"]],
  ["view", ["zoomIn", "zoomOut"]],
] as const;

export function Controlled(): ReactElement {
  const { t } = useWords("menubar");
  const [value, setValue] = useState("");
  const open = MENUS.find(([menu]) => menu === value);

  return (
    <Stack align="flex-start" gap="md">
      <Menubar.Root
        aria-label={t("label")}
        onValueChange={(details) => {
          setValue(details.value);
        }}
        value={value}
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
      <Text as="output">
        {open === undefined ? t("closed") : t("opened", { menu: t(open[0]) })}
      </Text>
    </Stack>
  );
}
