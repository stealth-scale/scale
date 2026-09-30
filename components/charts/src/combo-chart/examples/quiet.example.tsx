import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ComboChart } from "#combo-chart/index.ts";

const MONTHS: Array<{ margin: number; month: string; revenue: number }> = [];

export function Quiet(): ReactElement {
  const { t } = useWords("combo-chart");

  return (
    <ComboChart
      caption={t("quiet.caption")}
      categoryKey="month"
      data={MONTHS}
      empty={t("quiet.empty")}
      label={t("revenue.label")}
      legendLabel={t("series")}
      series={[
        { key: "revenue", label: t("revenue.revenue"), mark: "bar" },
        { axis: "end", key: "margin", label: t("revenue.margin"), mark: "line" },
      ]}
    />
  );
}
