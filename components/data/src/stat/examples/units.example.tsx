import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Stat from "#stat/index.ts";

export function Units(): ReactElement {
  const { t } = useWords("stat");

  return (
    <Stat.Root>
      <Stat.Label>{t("duration.label")}</Stat.Label>
      <Stat.ValueText>
        3<Stat.ValueUnit>{t("duration.hours")}</Stat.ValueUnit>
        20<Stat.ValueUnit>{t("duration.minutes")}</Stat.ValueUnit>
      </Stat.ValueText>
    </Stat.Root>
  );
}
