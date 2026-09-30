import { type ReactElement } from "react";

import { ArrowUpIcon } from "lucide-react";

import { Stat } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Sparkline } from "#sparkline/index.ts";

const DAYS = [5980, 6420, 6110, 7030, 6890, 7560, 8130];

export function Revenue(): ReactElement {
  const { t } = useWords("sparkline");

  return (
    <Stack align="flex-end" direction="row" justify="between">
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
      <Sparkline size="lg" values={DAYS} />
    </Stack>
  );
}
