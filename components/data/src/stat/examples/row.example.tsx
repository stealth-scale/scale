import { type ReactElement } from "react";

import { ArrowDownIcon } from "lucide-react";

import { Grid } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Stat from "#stat/index.ts";

export function Row(): ReactElement {
  const { t } = useWords("stat");

  return (
    <Grid.Root columns="3">
      <Stat.Root>
        <Stat.Label>{t("row.raised")}</Stat.Label>
        <Stat.ValueText>240</Stat.ValueText>
      </Stat.Root>
      <Stat.Root>
        <Stat.Label>{t("row.settled")}</Stat.Label>
        <Stat.ValueText>228</Stat.ValueText>
      </Stat.Root>
      <Stat.Root palette="success">
        <Stat.Label>{t("row.held")}</Stat.Label>
        <Stat.ValueText>12</Stat.ValueText>
        <Stat.HelpText>
          <Stat.Indicator>
            <ArrowDownIcon aria-hidden />
          </Stat.Indicator>
          {t("row.help")}
        </Stat.HelpText>
      </Stat.Root>
    </Grid.Root>
  );
}
