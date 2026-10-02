import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Switch from "#switch/index.ts";

export function Setting(props: Switch.RootProps): ReactElement {
  const { t } = useWords("switch");

  return (
    <Switch.Root {...props}>
      <Switch.Label>{t("weekly")}</Switch.Label>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch.Root>
  );
}
