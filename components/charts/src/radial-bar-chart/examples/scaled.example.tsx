import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RadialBarChart } from "#radial-bar-chart/index.ts";

import { USAGE } from "./quotas.ts";

export function Scaled(): ReactElement {
  const { t } = useWords("radial-bar-chart");

  return (
    <RadialBarChart
      bars={USAGE.map(({ key, used }) => ({ key, label: t(`usage.${key}`), value: used }))}
      caption={t("scaled.caption")}
      label={t("usage.label")}
      valueOptions={{ style: "percent" }}
    />
  );
}
