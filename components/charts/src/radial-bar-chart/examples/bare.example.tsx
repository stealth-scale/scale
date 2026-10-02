import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RadialBarChart } from "#radial-bar-chart/index.ts";

import { USAGE } from "./quotas.ts";

export function Bare(): ReactElement {
  const { t } = useWords("radial-bar-chart");

  return (
    <RadialBarChart
      bars={USAGE.map(({ key, used }) => ({ key, label: t(`usage.${key}`), value: used }))}
      caption={t("bare.caption")}
      label={t("usage.label")}
      max={1}
      track={false}
      valueOptions={{ style: "percent" }}
    />
  );
}
