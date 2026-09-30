import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { DistributionChart } from "#distribution-chart/index.ts";

import { NORTH, SOUTH } from "./deliveries.ts";

export function Regions(): ReactElement {
  const { t } = useWords("distribution-chart");

  return (
    <DistributionChart
      caption={t("regions.caption")}
      label={t("regions.label")}
      legendLabel={t("regions.regions")}
      series={[
        { key: "north", label: t("regions.north"), values: NORTH },
        { key: "south", label: t("regions.south"), values: SOUTH },
      ]}
      valueOptions={{ style: "unit", unit: "day", unitDisplay: "narrow" }}
    />
  );
}
