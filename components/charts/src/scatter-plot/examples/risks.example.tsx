import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ScatterPlot, spreadPoints } from "#scatter-plot/index.ts";

const RISKS = [
  { impact: 0.88, key: "breach", likelihood: 0.28 },
  { impact: 0.8, key: "outage", likelihood: 0.66 },
  { impact: 0.8, key: "fraud", likelihood: 0.66 },
  { impact: 0.62, key: "supplier", likelihood: 0.22 },
  { impact: 0.32, key: "turnover", likelihood: 0.82 },
  { impact: 0.18, key: "price", likelihood: 0.36 },
  { impact: 0.42, key: "currency", likelihood: 0.58 },
];

export function Risks(): ReactElement {
  const { t } = useWords("scatter-plot");
  const points = spreadPoints(
    RISKS.map(({ impact, key, likelihood }) => ({ impact, likelihood, name: t(`risks.${key}`) })),
    { distance: 0.15, x: [0, 1], xKey: "likelihood", y: [0, 1], yKey: "impact" },
  );

  return (
    <ScatterPlot
      caption={t("risks.caption")}
      label={t("risks.label")}
      labelKey="name"
      quadrants={{
        names: {
          bottomEnd: t("risks.reduce"),
          bottomStart: t("risks.accept"),
          topEnd: t("risks.act"),
          topStart: t("risks.prepare"),
        },
      }}
      series={[{ key: "risks", label: t("risks.risks"), points }]}
      xEnds={[t("risks.rare"), t("risks.certain")]}
      xKey="likelihood"
      xLabel={t("risks.likelihood")}
      xOptions={{ style: "percent" }}
      yEnds={[t("risks.minor"), t("risks.severe")]}
      yKey="impact"
      yLabel={t("risks.impact")}
      yOptions={{ style: "percent" }}
    />
  );
}
