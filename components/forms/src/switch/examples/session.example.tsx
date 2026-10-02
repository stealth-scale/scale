import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Switch from "#switch/index.ts";

export function Session(props: Switch.RootProps): ReactElement {
  const { t } = useWords("switch");

  return (
    <Switch.Root {...props}>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label>{t("long")}</Switch.Label>
    </Switch.Root>
  );
}
