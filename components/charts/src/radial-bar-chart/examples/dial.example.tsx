import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RadialBarChart } from "#radial-bar-chart/index.ts";

import { USAGE } from "./quotas.ts";

export function Dial(): ReactElement {
  const { t } = useWords("radial-bar-chart");

  return (
    <RadialBarChart
      bars={USAGE.map(({ key, used }) => ({ key, label: t(`usage.${key}`), value: used }))}
      caption={t("dial.caption")}
      endAngle={-45}
      label={t("usage.label")}
      max={1}
      startAngle={225}
      valueOptions={{ style: "percent" }}
    />
  );
}
