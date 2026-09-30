import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { linearRegression, RegressionOverlay } from "#regression-overlay/index.ts";
import { ScatterPlot } from "#scatter-plot/index.ts";

const TEAMS = [
  [3, 9],
  [4, 12],
  [5, 8],
  [5, 14],
  [6, 10],
  [7, 15],
  [7, 9],
  [8, 13],
  [9, 16],
  [10, 11],
  [11, 17],
  [12, 10],
  [13, 15],
  [14, 12],
  [15, 18],
  [16, 11],
].map(([people = 0, deploys = 0]) => ({ deploys, people }));

export function Weak(): ReactElement {
  const { i18n, t } = useWords("regression-overlay");
  const fit = linearRegression(TEAMS, "people", "deploys");
  const share = new Intl.NumberFormat(i18n.language, { style: "percent" });

  return (
    <ScatterPlot
      caption={t("weak.caption", { share: share.format(fit?.r2 ?? 0) })}
      label={t("weak.label")}
      series={[{ key: "teams", label: t("weak.teams"), points: TEAMS }]}
      xKey="people"
      xLabel={t("weak.people")}
      yKey="deploys"
      yLabel={t("weak.deploys")}
    >
      {fit !== undefined && fit.r2 >= 0.5 ? (
        <RegressionOverlay data={TEAMS} xKey="people" yKey="deploys" />
      ) : null}
    </ScatterPlot>
  );
}
