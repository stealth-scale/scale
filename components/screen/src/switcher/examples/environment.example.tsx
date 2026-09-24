import { type ReactElement, useState } from "react";

import { CheckIcon, ChevronsUpDownIcon, RocketIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Menu } from "@stealthscale/component-disclosure";
import { useWords } from "@stealthscale/specimen";

import * as Switcher from "#switcher/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const STAGES = ["production", "staging", "preview"] as const;

export function Environment(props: Switcher.RootProps): ReactElement {
  const { t } = useWords("switcher");
  const [chosen, setChosen] = useState<(typeof STAGES)[number]>("production");

  return (
    <Toolbar.Root aria-label={t("deployments")} size="sm" variant="outline">
      <Toolbar.Start>
        <Switcher.Root placement="toolbar" size="sm" variant="outline" {...props}>
          <Toolbar.Item as={Switcher.Trigger} label={t("environment")}>
            <Switcher.Label>
              <Switcher.Name>{t(chosen)}</Switcher.Name>
            </Switcher.Label>
            <Switcher.Indicator>
              <ChevronsUpDownIcon size="1em" />
            </Switcher.Indicator>
          </Toolbar.Item>
          <Menu.Positioner>
            <Menu.Content>
              {STAGES.map((stage) => (
                <Menu.OptionItem
                  checked={stage === chosen}
                  key={stage}
                  onCheckedChange={() => {
                    setChosen(stage);
                  }}
                  type="radio"
                  value={stage}
                >
                  <Menu.ItemIndicator>
                    <CheckIcon size="1em" />
                  </Menu.ItemIndicator>
                  <Menu.ItemText>{t(stage)}</Menu.ItemText>
                </Menu.OptionItem>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Switcher.Root>
      </Toolbar.Start>
      <Toolbar.End>
        <Toolbar.Action as={Button} size="sm">
          <RocketIcon size="1em" />
          <span>{t("deploy")}</span>
        </Toolbar.Action>
      </Toolbar.End>
    </Toolbar.Root>
  );
}
