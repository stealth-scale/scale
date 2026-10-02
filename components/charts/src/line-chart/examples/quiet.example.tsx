import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { LineChart } from "#line-chart/index.ts";

const DAYS: Array<{ day: string; errors: number }> = [];

export function Quiet(): ReactElement {
  const { t } = useWords("line-chart");

  return (
    <LineChart
      caption={t("quiet.caption")}
      categoryKey="day"
      data={DAYS}
      empty={t("quiet.empty")}
      label={t("quiet.label")}
      series={[{ key: "errors", label: t("quiet.errors") }]}
    />
  );
}
