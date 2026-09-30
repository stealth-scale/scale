import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Heatmap } from "#heatmap/index.ts";

import { AUTHORISATIONS, hoursOf, TRADING_HOURS, WEEKDAYS } from "./readings.ts";

export function Readout(): ReactElement {
  const { t } = useWords("heatmap");
  const most = Math.max(...AUTHORISATIONS.map((cell) => cell.value ?? 0));

  return (
    <Heatmap
      cells={AUTHORISATIONS}
      columns={hoursOf(TRADING_HOURS)}
      corner={t("authorisations.corner")}
      defaultIndex={AUTHORISATIONS.findIndex((cell) => cell.value === most)}
      label={t("authorisations.label")}
      rows={WEEKDAYS.map((key) => ({ key, label: t(`days.${key}`) }))}
      valueLabel={t("authorisations.value")}
    />
  );
}
