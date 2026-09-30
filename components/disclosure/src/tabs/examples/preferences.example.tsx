import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Tabs from "#tabs/index.ts";

const SECTIONS = ["profile", "security", "billing", "notifications"];

export function Preferences(): ReactElement {
  const { t } = useWords("tabs");

  return (
    <Tabs.Root defaultValue="profile" orientation="vertical">
      <Tabs.List aria-label={t("preferences.label")}>
        {SECTIONS.map((section) => (
          <Tabs.Trigger key={section} value={section}>
            {t(`preferences.names.${section}`)}
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
      {SECTIONS.map((section) => (
        <Tabs.Content key={section} value={section}>
          {t(`preferences.bodies.${section}`)}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
