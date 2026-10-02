import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RadialBarChart } from "#radial-bar-chart/index.ts";

export function Quiet(): ReactElement {
  const { t } = useWords("radial-bar-chart");

  return (
    <RadialBarChart
      bars={[]}
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      label={t("usage.label")}
      max={1}
    />
  );
}
