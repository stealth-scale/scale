import { type ReactElement } from "react";

import { ArrowUpIcon } from "lucide-react";

import { Stat } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Sparkline } from "#sparkline/index.ts";

const HOURS = [3, 2, 4, 3, 5, 4, 6, 9, 14, 12, 16, 14];

export function Errors(): ReactElement {
  const { t } = useWords("sparkline");

  return (
    <Stack align="flex-end" direction="row" justify="between">
      <Stat.Root palette="error">
        <Stat.Label>{t("errors.label")}</Stat.Label>
        <Stat.ValueText>{t("errors.value")}</Stat.ValueText>
        <Stat.HelpText>
          <Stat.Indicator>
            <ArrowUpIcon aria-hidden />
          </Stat.Indicator>
          {t("errors.help")}
        </Stat.HelpText>
      </Stat.Root>
      <Sparkline color="error" size="lg" values={HOURS} />
    </Stack>
  );
}
