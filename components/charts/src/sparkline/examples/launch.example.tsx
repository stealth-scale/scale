import { type ReactElement } from "react";

import { Stat } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Sparkline } from "#sparkline/index.ts";

const MONTHS = [0, 40, 95, 180, 260, 410, 590, 720, 940, 1240];

export function Launch(): ReactElement {
  const { t } = useWords("sparkline");

  return (
    <Stack align="flex-end" direction="row" justify="between">
      <Stat.Root>
        <Stat.Label>{t("launch.label")}</Stat.Label>
        <Stat.ValueText>{t("launch.value")}</Stat.ValueText>
        <Stat.HelpText>{t("launch.help")}</Stat.HelpText>
      </Stat.Root>
      <Sparkline area size="lg" values={MONTHS} />
    </Stack>
  );
}
