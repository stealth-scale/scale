import { type ReactElement, useState } from "react";

import {
  ArrowDownWideNarrowIcon,
  ArrowUpNarrowWideIcon,
  CheckIcon,
  ChevronDownIcon,
  EyeOffIcon,
} from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";

export function Column(props: Menu.RootProps): ReactElement {
  const { t } = useWords("menu");
  const [wrapped, setWrapped] = useState(false);

  return (
    <Menu.Root {...props}>
      <Menu.Trigger as={Button}>
        {t("amount")}
        <Menu.Indicator>
          <ChevronDownIcon size="1em" />
        </Menu.Indicator>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="ascending">
              <ArrowUpNarrowWideIcon aria-hidden />
              {t("sortAscending")}
            </Menu.Item>
            <Menu.Item value="descending">
              <ArrowDownWideNarrowIcon aria-hidden />
              {t("sortDescending")}
            </Menu.Item>
            <Menu.Separator />
            <Menu.OptionItem
              checked={wrapped}
              onCheckedChange={setWrapped}
              type="checkbox"
              value="wrap"
            >
              <Menu.ItemText>{t("wrapText")}</Menu.ItemText>
              <Menu.ItemIndicator>
                <CheckIcon size="1em" />
              </Menu.ItemIndicator>
            </Menu.OptionItem>
            <Menu.Separator />
            <Menu.Item value="hide">
              <EyeOffIcon aria-hidden />
              {t("hideColumn")}
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
