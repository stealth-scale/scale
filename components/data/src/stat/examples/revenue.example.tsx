import { type ReactElement } from "react";

import { ArrowUpIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Stat from "#stat/index.ts";

export function Revenue(props: Stat.RootProps): ReactElement {
  const { t } = useWords("stat");

  return (
    <Stat.Root {...props}>
      <Stat.Label>{t("revenue.label")}</Stat.Label>
      <Stat.ValueText>{t("revenue.value")}</Stat.ValueText>
      <Stat.HelpText>
        <Stat.Indicator>
          <ArrowUpIcon aria-hidden />
        </Stat.Indicator>
        {t("revenue.help")}
      </Stat.HelpText>
    </Stat.Root>
  );
}
