import { type ReactElement, useState } from "react";

import { CheckIcon, ChevronsUpDownIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { Menu } from "@stealthscale/component-disclosure";
import { useWords } from "@stealthscale/specimen";

import * as Switcher from "#switcher/index.ts";

const WORKSPACES = [
  ["acme", "pro"],
  ["fathom", "trial"],
  ["globex", "enterprise"],
  ["oldBooks", "suspended"],
] as const;

type Workspace = (typeof WORKSPACES)[number];

export function Workspaces(props: Switcher.RootProps): ReactElement {
  const { t } = useWords("switcher");
  const [[name, plan], setChosen] = useState<Workspace>(WORKSPACES[0]);

  return (
    <Switcher.Root {...props}>
      <Switcher.Trigger label={t("workspace")}>
        <Switcher.Mark>{t(name).charAt(0)}</Switcher.Mark>
        <Switcher.Label>
          <Switcher.Name>{t(name)}</Switcher.Name>
          <Switcher.Detail>{t(plan)}</Switcher.Detail>
        </Switcher.Label>
        <Switcher.Indicator>
          <ChevronsUpDownIcon size="1em" />
        </Switcher.Indicator>
      </Switcher.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          {WORKSPACES.map((workspace) => (
            <Menu.OptionItem
              checked={workspace[0] === name}
              disabled={workspace[1] === "suspended"}
              key={workspace[0]}
              onCheckedChange={() => {
                setChosen(workspace);
              }}
              type="radio"
              value={workspace[0]}
            >
              <Menu.ItemIndicator>
                <CheckIcon size="1em" />
              </Menu.ItemIndicator>
              <Menu.ItemMark>{t(workspace[0]).charAt(0)}</Menu.ItemMark>
              <Menu.ItemLines>
                <Menu.ItemText>{t(workspace[0])}</Menu.ItemText>
                <Menu.ItemDescription>{t(workspace[1])}</Menu.ItemDescription>
              </Menu.ItemLines>
            </Menu.OptionItem>
          ))}
          <Menu.Separator />
          <Menu.Item value="new">
            <PlusIcon size="1em" />
            {t("new")}
          </Menu.Item>
          <Menu.Item value="settings">
            <SettingsIcon size="1em" />
            {t("settings")}
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Switcher.Root>
  );
}
