import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Switch from "#switch/index.ts";

export function Theme(props: Switch.RootProps): ReactElement {
  const { t } = useWords("switch");

  return (
    <Switch.Root defaultChecked {...props}>
      <Switch.Label>{t("dark")}</Switch.Label>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch.Root>
  );
}
