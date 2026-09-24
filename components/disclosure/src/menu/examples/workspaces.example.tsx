import { type ReactElement, useState } from "react";

import { CheckIcon, ChevronsUpDownIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";

const WORKSPACES = [
  ["acme", "acmePlan"],
  ["globex", "globexPlan"],
  ["initech", "initechPlan"],
] as const;

export function Workspaces(props: Menu.RootProps): ReactElement {
  const { t } = useWords("menu");
  const [current, setCurrent] = useState<string>("acme");

  return (
    <Menu.Root {...props}>
      <Menu.Trigger as={Button}>
        {t("switchWorkspace")}
        <Menu.Indicator>
          <ChevronsUpDownIcon size="1em" />
        </Menu.Indicator>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup value="workspaces">
              <Menu.ItemGroupLabel value="workspaces">{t("workspaces")}</Menu.ItemGroupLabel>
              {WORKSPACES.map(([name, plan]) => (
                <Menu.OptionItem
                  checked={current === name}
                  key={name}
                  onCheckedChange={() => {
                    setCurrent(name);
                  }}
                  type="radio"
                  value={name}
                >
                  <Menu.ItemMark>{t(name).slice(0, 1)}</Menu.ItemMark>
                  <Menu.ItemLines>
                    <Menu.ItemText>{t(name)}</Menu.ItemText>
                    <Menu.ItemDescription>{t(plan)}</Menu.ItemDescription>
                  </Menu.ItemLines>
                  <Menu.ItemIndicator>
                    <CheckIcon size="1em" />
                  </Menu.ItemIndicator>
                </Menu.OptionItem>
              ))}
            </Menu.ItemGroup>
            <Menu.Separator />
            <Menu.Item value="create">
              <Menu.ItemMark>
                <PlusIcon size="1em" />
              </Menu.ItemMark>
              {t("createWorkspace")}
            </Menu.Item>
            <Menu.Item value="settings">
              <Menu.ItemMark>
                <SettingsIcon size="1em" />
              </Menu.ItemMark>
              {t("settings")}
              <Menu.ItemCommand>⌘,</Menu.ItemCommand>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
