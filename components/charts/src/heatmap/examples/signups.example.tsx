import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { cohortCells } from "#cohort/index.ts";
import { Heatmap } from "#heatmap/index.ts";

const SIGNUPS = [1840, 1520, 1610, 1980, 1750, 1690, 1880, 1420].map((size, at) => {
  const first = (at >= 4 ? 0.6 : 0.52) + (((at * 5) % 7) - 3) * 0.01;
  const kept = 0.86 + ((at * 3) % 4) * 0.01;

  return {
    retained: Array.from({ length: 8 - at }, (_, period) => {
      if (period === 0) return size;
      if (at === 2 && period === 2) return null;

      return Math.round(size * first * kept ** (period - 1));
    }),
    size,
  };
});

export function Signups(): ReactElement {
  const { i18n, t } = useWords("heatmap");
  const month = new Intl.DateTimeFormat(i18n.language, {
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });
  const cohorts = SIGNUPS.map(({ retained, size }, at) => ({
    key: `2026-${String(at + 1).padStart(2, "0")}`,
    label: month.format(Date.UTC(2026, at, 1)),
    retained,
    size,
  }));

  return (
    <Heatmap
      {...cohortCells(cohorts, {
        average: t("signups.average"),
        label: (cohort) => t("signups.cohort", { label: cohort.label, size: cohort.size }),
        locale: i18n.language,
        periodLabel: (period) => t("signups.period", { period }),
      })}
      caption={t("signups.caption")}
      corner={t("signups.corner")}
      label={t("signups.label")}
      missingLabel={t("signups.missing")}
      valueLabel={t("signups.value")}
      values
    />
  );
}
