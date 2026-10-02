import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { DonutChart } from "#donut-chart/index.ts";

const KINDS = [
  { gigabytes: 118, key: "video" },
  { gigabytes: 42, key: "images" },
  { gigabytes: 26, key: "archives" },
  { gigabytes: 9.5, key: "documents" },
];

export function Largest(): ReactElement {
  const { t } = useWords("donut-chart");

  return (
    <DonutChart
      caption={t("largest.caption")}
      defaultIndex={0}
      label={t("usage.label")}
      legendLabel={t("usage.legend")}
      slices={KINDS.map(({ gigabytes: value, key }) => ({ key, label: t(`usage.${key}`), value }))}
      valueOptions={{ maximumFractionDigits: 1, style: "unit", unit: "gigabyte" }}
    />
  );
}
