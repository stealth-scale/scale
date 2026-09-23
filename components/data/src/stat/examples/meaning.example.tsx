import { type ReactElement } from "react";

import { ArrowUpIcon } from "lucide-react";

import { Grid } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Stat from "#stat/index.ts";

export function Meaning(): ReactElement {
  const { t } = useWords("stat");

  return (
    <Grid.Root columns="2">
      <Stat.Root palette="success">
        <Stat.Label>{t("revenue.label")}</Stat.Label>
        <Stat.ValueText>{t("revenue.value")}</Stat.ValueText>
        <Stat.HelpText>
          <Stat.Indicator>
            <ArrowUpIcon aria-hidden />
          </Stat.Indicator>
          {t("revenue.help")}
        </Stat.HelpText>
      </Stat.Root>
      <Stat.Root palette="error">
        <Stat.Label>{t("tickets.label")}</Stat.Label>
        <Stat.ValueText>{t("tickets.value")}</Stat.ValueText>
        <Stat.HelpText>
          <Stat.Indicator>
            <ArrowUpIcon aria-hidden />
          </Stat.Indicator>
          {t("tickets.help")}
        </Stat.HelpText>
      </Stat.Root>
    </Grid.Root>
  );
}
