import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PercentStackedBar } from "#percent-stacked-bar/index.ts";

const REGIONS = [
  { growth: 520, region: "americas", scale: 170, starter: 610 },
  { growth: 310, region: "emea", scale: 70, starter: 420 },
  { growth: 90, region: "apac", scale: 30, starter: 180 },
];

export function Mix(): ReactElement {
  const { t } = useWords("percent-stacked-bar");
  const rows = REGIONS.map(({ growth, region, scale, starter }) => ({
    growth,
    region: t(`mix.${region}`),
    scale,
    starter,
  }));

  return (
    <PercentStackedBar
      caption={t("mix.caption")}
      categoryKey="region"
      data={rows}
      label={t("mix.label")}
      legendLabel={t("series")}
      series={[
        { key: "scale", label: t("mix.scale") },
        { key: "growth", label: t("mix.growth") },
        { key: "starter", label: t("mix.starter") },
      ]}
    />
  );
}
