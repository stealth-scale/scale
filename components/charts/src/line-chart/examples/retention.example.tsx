import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { retentionSeries } from "#cohort/index.ts";
import { LineChart } from "#line-chart/index.ts";

const TRIALS = [420, 385, 440, 398, 412, 455, 430, 402, 447, 390].map((size, at) => {
  const first = (at >= 5 ? 0.62 : 0.5) + (((at * 7) % 5) - 2) * 0.015;
  const kept = 0.86 + ((at * 3) % 4) * 0.015;

  return {
    retained: Array.from({ length: 10 - at }, (_, week) =>
      week === 0 ? size : Math.round(size * first * kept ** (week - 1)),
    ),
    size,
  };
});

export function Retention(): ReactElement {
  const { t } = useWords("line-chart");
  const cohorts = TRIALS.map(({ retained, size }, at) => ({
    key: `w${String(at + 1)}`,
    label: t("retention.cohort", { week: at + 1 }),
    retained,
    size,
  }));

  return (
    <LineChart
      {...retentionSeries(cohorts, {
        averageLabel: t("retention.average"),
        periodLabel: (week) => t("retention.period", { week }),
        sparseLabel: t("retention.sparse"),
      })}
      caption={t("retention.caption")}
      label={t("retention.label")}
    />
  );
}
