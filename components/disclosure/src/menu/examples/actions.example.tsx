import { type ReactElement, useState } from "react";

import { CheckIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";

const FORMATS = ["csv", "json", "pdf"] as const;

export function Actions(props: Menu.RootProps): ReactElement {
  const { t } = useWords("menu");
  const [notified, setNotified] = useState(true);

  return (
    <Menu.Root {...props}>
      <Menu.Trigger as={Button}>
        {t("actions")}
        <Menu.Indicator>
          <ChevronDownIcon size="1em" />
        </Menu.Indicator>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.ItemGroup value="payout">
            <Menu.ItemGroupLabel value="payout">{t("payout")}</Menu.ItemGroupLabel>
            <Menu.Item value="release">{t("release")}</Menu.Item>
            <Menu.Item value="hold">{t("hold")}</Menu.Item>
            <Menu.Item tone="critical" value="void">
              {t("void")}
            </Menu.Item>
          </Menu.ItemGroup>
          <Menu.Separator />
          <Menu.OptionItem
            checked={notified}
            onCheckedChange={setNotified}
            type="checkbox"
            value="notify"
          >
            <Menu.ItemText>{t("notify")}</Menu.ItemText>
            <Menu.ItemIndicator>
              <CheckIcon size="1em" />
            </Menu.ItemIndicator>
          </Menu.OptionItem>
          <Menu.Separator />
          <Menu.Root>
            <Menu.TriggerItem>
              {t("export")}
              <Menu.Indicator>
                <ChevronRightIcon size="1em" />
              </Menu.Indicator>
            </Menu.TriggerItem>
            <Menu.Positioner>
              <Menu.Content>
                {FORMATS.map((format) => (
                  <Menu.Item key={format} value={format}>
                    {t(format)}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
