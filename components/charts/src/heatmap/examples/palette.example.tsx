import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Heatmap } from "#heatmap/index.ts";

import { AUTHORISATIONS, hoursOf, TRADING_HOURS, WEEKDAYS } from "./readings.ts";

export function Palette(): ReactElement {
  const { t } = useWords("heatmap");

  return (
    <Heatmap
      cells={AUTHORISATIONS}
      color="purple"
      columns={hoursOf(TRADING_HOURS)}
      corner={t("authorisations.corner")}
      label={t("authorisations.label")}
      rows={WEEKDAYS.map((key) => ({ key, label: t(`days.${key}`) }))}
      valueLabel={t("authorisations.value")}
    />
  );
}
