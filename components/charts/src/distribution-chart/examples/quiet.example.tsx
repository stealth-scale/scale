import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { DistributionChart } from "#distribution-chart/index.ts";

const NORTH: number[] = [];
const SOUTH: number[] = [];

export function Quiet(): ReactElement {
  const { t } = useWords("distribution-chart");

  return (
    <DistributionChart
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      label={t("regions.label")}
      series={[
        { key: "north", label: t("regions.north"), values: NORTH },
        { key: "south", label: t("regions.south"), values: SOUTH },
      ]}
    />
  );
}
