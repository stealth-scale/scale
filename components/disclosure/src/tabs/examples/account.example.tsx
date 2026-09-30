import { type ReactElement } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Tabs from "#tabs/index.ts";

export function Account(props: Tabs.RootProps): ReactElement {
  const { t } = useWords("tabs");

  return (
    <Tabs.Root defaultValue="overview" {...props}>
      <ScrollArea.Root fade inset="xs" scrolls="horizontal">
        <ScrollArea.Viewport focusable={false}>
          <ScrollArea.Content>
            <Tabs.List aria-label={t("label")}>
              <Tabs.Trigger value="overview">{t("overview")}</Tabs.Trigger>
              <Tabs.Trigger value="activity">{t("activity")}</Tabs.Trigger>
              <Tabs.Trigger value="settings">{t("settings")}</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" />
      </ScrollArea.Root>
      <Tabs.Content value="overview">{t("holds")}</Tabs.Content>
      <Tabs.Content value="activity">{t("lately")}</Tabs.Content>
      <Tabs.Content value="settings">{t("tuned")}</Tabs.Content>
    </Tabs.Root>
  );
}
