import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ParetoChart, paretoCutoff, paretoRows } from "#pareto-chart/index.ts";

const CAUSES = [
  { cause: "Misprint", defects: 34 },
  { cause: "Scratch", defects: 182 },
  { cause: "Warp", defects: 21 },
  { cause: "Dent", defects: 97 },
  { cause: "Stain", defects: 15 },
  { cause: "Crack", defects: 61 },
  { cause: "Other", defects: 10 },
];

export function Defects(): ReactElement {
  const { t } = useWords("pareto-chart");
  const cutoff = paretoCutoff(paretoRows(CAUSES, "defects"), 0.9);

  return (
    <ParetoChart
      caption={t("defects.caption", { count: cutoff, total: CAUSES.length })}
      categoryKey="cause"
      cumulativeLabel={t("cumulative")}
      data={CAUSES}
      label={t("defects.label")}
      legendLabel={t("series")}
      threshold={0.9}
      thresholdLabel={t("defects.threshold")}
      valueKey="defects"
      valueLabel={t("defects.defects")}
    />
  );
}
