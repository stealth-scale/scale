import { type ReactElement, useState } from "react";

import {
  CheckIcon,
  ChevronRightIcon,
  CopyIcon,
  FolderInputIcon,
  PinIcon,
  TrashIcon,
} from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";

export function Card(props: Menu.RootProps): ReactElement {
  const { t } = useWords("menu");
  const [pinned, setPinned] = useState(true);

  return (
    <Menu.Root {...props}>
      <ButtonPropsProvider value={{ size: "lg", variant: "subtle" }}>
        <Menu.ContextTrigger as={Button}>{t("rightClickCard")}</Menu.ContextTrigger>
      </ButtonPropsProvider>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="copy">
              <CopyIcon size="1em" />
              {t("copy")}
              <Menu.ItemCommand>⌘C</Menu.ItemCommand>
            </Menu.Item>
            <Menu.OptionItem
              checked={pinned}
              onCheckedChange={setPinned}
              type="checkbox"
              value="pin"
            >
              <PinIcon size="1em" />
              <Menu.ItemText>{t("keepTop")}</Menu.ItemText>
              <Menu.ItemIndicator>
                <CheckIcon size="1em" />
              </Menu.ItemIndicator>
            </Menu.OptionItem>
            <Menu.Root>
              <Menu.TriggerItem>
                <FolderInputIcon size="1em" />
                {t("moveTo")}
                <Menu.Indicator>
                  <ChevronRightIcon size="1em" />
                </Menu.Indicator>
              </Menu.TriggerItem>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="archive">{t("archive")}</Menu.Item>
                    <Menu.Item value="drafts">{t("drafts")}</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            <Menu.Separator />
            <Menu.Item tone="critical" value="delete">
              <TrashIcon size="1em" />
              {t("delete")}
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
