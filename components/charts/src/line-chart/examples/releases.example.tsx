import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { LineChart } from "#line-chart/index.ts";

const DAYS = [212, 205, 218, 381, 396, 372, 368, 362, 355, 358, 214, 208, 221, 199].map(
  (p95, index) => ({ day: `2026-09-${String(index + 14)}`, p95 }),
);

export function Releases(): ReactElement {
  const { t } = useWords("line-chart");

  return (
    <LineChart
      annotations={[
        { at: "2026-09-17", key: "4.12", label: t("releases.first") },
        {
          at: "2026-09-20",
          color: "info",
          key: "freeze",
          label: t("releases.freeze"),
          until: "2026-09-22",
        },
        { at: "2026-09-24", key: "4.13", label: t("releases.second") },
      ]}
      caption={t("releases.caption")}
      categoryKey="day"
      curve="linear"
      data={DAYS}
      defaultIndex={3}
      label={t("releases.label")}
      labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
      series={[{ key: "p95", label: t("releases.p95") }]}
      valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
    />
  );
}
