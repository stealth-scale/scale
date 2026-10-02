import { type ReactElement } from "react";

import { Stat } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Sparkbar } from "#sparkbar/index.ts";

const DAYS = [214, 238, 221, null, 241, 233, 226];

export function Outage(): ReactElement {
  const { t } = useWords("sparkbar");

  return (
    <Stack align="flex-end" direction="row" justify="between">
      <Stat.Root>
        <Stat.Label>{t("outage.label")}</Stat.Label>
        <Stat.ValueText>{t("outage.value")}</Stat.ValueText>
        <Stat.HelpText>{t("outage.help")}</Stat.HelpText>
      </Stat.Root>
      <Sparkbar size="lg" values={DAYS} />
    </Stack>
  );
}
