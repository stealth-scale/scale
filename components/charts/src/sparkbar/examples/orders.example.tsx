import { type ReactElement } from "react";

import { Stat } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Sparkbar } from "#sparkbar/index.ts";

const DAYS = [118, 132, 97, 141, 156, 88, 124];

export function Orders(): ReactElement {
  const { t } = useWords("sparkbar");

  return (
    <Stack align="flex-end" direction="row" justify="between">
      <Stat.Root>
        <Stat.Label>{t("orders.label")}</Stat.Label>
        <Stat.ValueText>{t("orders.value")}</Stat.ValueText>
        <Stat.HelpText>{t("orders.help")}</Stat.HelpText>
      </Stat.Root>
      <Sparkbar baseline={120} color="teal" size="lg" values={DAYS} />
    </Stack>
  );
}
