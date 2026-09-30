import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PercentStackedBar } from "#percent-stacked-bar/index.ts";

const REGIONS: Array<{ growth: number; region: string; scale: number; starter: number }> = [];

export function Unsold(): ReactElement {
  const { t } = useWords("percent-stacked-bar");

  return (
    <PercentStackedBar
      caption={t("unsold.caption")}
      categoryKey="region"
      data={REGIONS}
      empty={t("unsold.empty")}
      label={t("mix.label")}
      series={[
        { key: "scale", label: t("mix.scale") },
        { key: "growth", label: t("mix.growth") },
        { key: "starter", label: t("mix.starter") },
      ]}
    />
  );
}
