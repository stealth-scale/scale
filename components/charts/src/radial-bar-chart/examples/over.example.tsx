import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RadialBarChart } from "#radial-bar-chart/index.ts";

import { OVERRUN } from "./quotas.ts";

export function Over(): ReactElement {
  const { t } = useWords("radial-bar-chart");

  return (
    <RadialBarChart
      bars={OVERRUN.map(({ key, used }) => ({ key, label: t(`usage.${key}`), value: used }))}
      caption={t("over.caption")}
      label={t("usage.label")}
      max={1}
      valueOptions={{ style: "percent" }}
    />
  );
}
