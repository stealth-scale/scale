import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { StackedAreaChart } from "#stacked-area-chart/index.ts";

const DAYS: Array<{ day: string; direct: number; referral: number; search: number }> = [];

export function Untracked(): ReactElement {
  const { t } = useWords("stacked-area-chart");

  return (
    <StackedAreaChart
      caption={t("untracked.caption")}
      categoryKey="day"
      data={DAYS}
      empty={t("untracked.empty")}
      label={t("traffic.label")}
      series={[
        { key: "direct", label: t("traffic.direct") },
        { key: "search", label: t("traffic.search") },
        { key: "referral", label: t("traffic.referral") },
      ]}
    />
  );
}
