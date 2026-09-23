import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Stat from "#stat/index.ts";

export function Settled(props: Stat.RootProps): ReactElement {
  const { t } = useWords("stat");

  return (
    <Stat.Root {...props}>
      <Stat.Label>{t("settled.label")}</Stat.Label>
      <Stat.ValueText>{t("settled.value")}</Stat.ValueText>
      <Stat.HelpText>{t("settled.help")}</Stat.HelpText>
    </Stat.Root>
  );
}
