import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PieChart } from "#pie-chart/index.ts";

export function Regions(): ReactElement {
  const { t } = useWords("pie-chart");

  return (
    <PieChart
      caption={t("regions.caption")}
      defaultIndex={0}
      label={t("regions.label")}
      legendLabel={t("regions.legend")}
      slices={[
        { key: "americas", label: t("regions.americas"), value: 36_900 },
        { key: "europe", label: t("regions.europe"), value: 48_200 },
        { key: "latam", label: t("regions.latam"), value: 6100 },
        { key: "apac", label: t("regions.apac"), value: 14_300 },
      ]}
      valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
    />
  );
}
