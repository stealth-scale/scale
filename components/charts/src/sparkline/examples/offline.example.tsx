import { type ReactElement } from "react";

import { Stat } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Sparkline } from "#sparkline/index.ts";

const READINGS = [21.4, 21.6, 21.9, null, null, 22.8, 22.6, 22.1, 21.8];

export function Offline(): ReactElement {
  const { t } = useWords("sparkline");

  return (
    <Stack align="flex-end" direction="row" justify="between">
      <Stat.Root>
        <Stat.Label>{t("offline.label")}</Stat.Label>
        <Stat.ValueText>{t("offline.value")}</Stat.ValueText>
        <Stat.HelpText>{t("offline.help")}</Stat.HelpText>
      </Stat.Root>
      <Sparkline curve="linear" size="lg" values={READINGS} />
    </Stack>
  );
}
