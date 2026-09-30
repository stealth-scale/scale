import { type ReactElement } from "react";

import { Stat } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Sparkline } from "#sparkline/index.ts";

const HOURS = [182, 196, 210, 254, 318, 342, 296, 240, 205, 190];

export function Target(): ReactElement {
  const { t } = useWords("sparkline");

  return (
    <Stack align="flex-end" direction="row" justify="between">
      <Stat.Root>
        <Stat.Label>{t("target.label")}</Stat.Label>
        <Stat.ValueText>{t("target.value")}</Stat.ValueText>
        <Stat.HelpText>{t("target.help")}</Stat.HelpText>
      </Stat.Root>
      <Sparkline baseline={300} size="lg" values={HOURS} />
    </Stack>
  );
}
