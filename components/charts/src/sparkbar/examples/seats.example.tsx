import { type ReactElement } from "react";

import { Stat } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Sparkbar } from "#sparkbar/index.ts";

const DAYS = [4, -2, 6, 3, -5, 8, 2, -1, 5, 4, -3, 7, 6, 2];

export function Seats(): ReactElement {
  const { t } = useWords("sparkbar");

  return (
    <Stack align="flex-end" direction="row" justify="between">
      <Stat.Root>
        <Stat.Label>{t("seats.label")}</Stat.Label>
        <Stat.ValueText>{t("seats.value")}</Stat.ValueText>
        <Stat.HelpText>{t("seats.help")}</Stat.HelpText>
      </Stat.Root>
      <Sparkbar signed size="lg" values={DAYS} />
    </Stack>
  );
}
