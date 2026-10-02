import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PieChart } from "#pie-chart/index.ts";

export function Quota(): ReactElement {
  const { t } = useWords("pie-chart");

  return (
    <PieChart
      caption={t("quota.caption")}
      label={t("quota.label")}
      legendLabel={t("quota.legend")}
      shares={false}
      slices={[
        { color: "blue", key: "used", label: t("quota.used"), value: 142 },
        { color: "neutral", key: "free", label: t("quota.free"), value: 58 },
      ]}
      valueOptions={{ style: "unit", unit: "gigabyte" }}
    />
  );
}
