import { type ReactElement } from "react";

import { Stat } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Sparkbar } from "#sparkbar/index.ts";

const DAYS = [6, 9, 4, 7, 11, 1, 0];

export function Deploys(): ReactElement {
  const { t } = useWords("sparkbar");

  return (
    <Stack align="flex-end" direction="row" justify="between">
      <Stat.Root>
        <Stat.Label>{t("deploys.label")}</Stat.Label>
        <Stat.ValueText>{t("deploys.value")}</Stat.ValueText>
        <Stat.HelpText>{t("deploys.help")}</Stat.HelpText>
      </Stat.Root>
      <Sparkbar size="lg" values={DAYS} />
    </Stack>
  );
}
