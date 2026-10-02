import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ScatterPlot } from "#scatter-plot/index.ts";

const VENDORS = [
  { execution: 0.82, name: "Alder", vision: 0.76 },
  { execution: 0.71, name: "Birch", vision: 0.34 },
  { execution: 0.63, name: "Cedar", vision: 0.61 },
  { execution: 0.34, name: "Hazel", vision: 0.26 },
  { execution: 0.18, name: "Larch", vision: 0.45 },
  { execution: 0.4, name: "Maple", vision: 0.85 },
  { execution: 0.24, name: "Rowan", vision: 0.66 },
  { execution: 0.56, name: "Spruce", vision: 0.17 },
];

export function Quadrants(): ReactElement {
  const { t } = useWords("scatter-plot");

  return (
    <ScatterPlot
      caption={t("quadrants.caption")}
      label={t("quadrants.label")}
      labelKey="name"
      quadrants={{
        names: {
          bottomEnd: t("quadrants.visionaries"),
          bottomStart: t("quadrants.niche"),
          topEnd: t("quadrants.leaders"),
          topStart: t("quadrants.challengers"),
        },
      }}
      series={[{ key: "vendors", label: t("quadrants.vendors"), points: VENDORS }]}
      xEnds={[t("quadrants.low"), t("quadrants.high")]}
      xKey="vision"
      xLabel={t("quadrants.vision")}
      xOptions={{ style: "percent" }}
      yEnds={[t("quadrants.low"), t("quadrants.high")]}
      yKey="execution"
      yLabel={t("quadrants.execution")}
      yOptions={{ style: "percent" }}
    />
  );
}
