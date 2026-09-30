import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Heatmap } from "#heatmap/index.ts";

import { AUTHORISATIONS, hoursOf, TRADING_HOURS, WEEKDAYS } from "./readings.ts";

export function Authorisations(): ReactElement {
  const { t } = useWords("heatmap");
  const [busiest] = AUTHORISATIONS.toSorted(
    (first, second) => (second.value ?? 0) - (first.value ?? 0),
  );

  return (
    <Heatmap
      caption={t("authorisations.caption", {
        count: busiest?.value,
        day: t(`days.${busiest?.row ?? ""}`),
        hour: busiest?.column,
      })}
      cells={AUTHORISATIONS}
      columns={hoursOf(TRADING_HOURS)}
      corner={t("authorisations.corner")}
      label={t("authorisations.label")}
      rows={WEEKDAYS.map((key) => ({ key, label: t(`days.${key}`) }))}
      valueLabel={t("authorisations.value")}
    />
  );
}
