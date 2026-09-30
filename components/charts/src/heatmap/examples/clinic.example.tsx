import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { cohortCells } from "#cohort/index.ts";
import { Heatmap } from "#heatmap/index.ts";

const INTAKES = [
  [24, 21, 19, 17, 16, 15],
  [31, 26, 23, 21, 19],
  [7, 7, 6, 6],
  [28, 24, 21],
  [22, 19],
  [19],
];

export function Clinic(): ReactElement {
  const { i18n, t } = useWords("heatmap");
  const month = new Intl.DateTimeFormat(i18n.language, { month: "short", timeZone: "UTC" });
  const cohorts = INTAKES.map((retained, at) => ({
    key: String(at),
    label: month.format(Date.UTC(2026, at, 1)),
    retained,
    size: retained[0] ?? 0,
  }));

  return (
    <Heatmap
      {...cohortCells(cohorts, {
        label: (cohort) => t("clinic.cohort", { label: cohort.label, size: cohort.size }),
        locale: i18n.language,
        measure: "count",
        periodLabel: (period) => t("clinic.period", { period }),
      })}
      caption={t("clinic.caption")}
      corner={t("clinic.corner")}
      label={t("clinic.label")}
      valueLabel={t("clinic.value")}
      values
    />
  );
}
