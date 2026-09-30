import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { RadialBarChart } from "#radial-bar-chart/index.ts";

import { ACTIVITY } from "./quotas.ts";

const COLORS = { exercise: "green", move: "pink", stand: "cyan" } as const;

export function Activity(): ReactElement {
  const { t } = useWords("radial-bar-chart");

  return (
    <RadialBarChart
      bars={ACTIVITY.map(({ key, used }) => ({
        color: COLORS[key],
        key,
        label: t(`activity.${key}`),
        value: used,
      }))}
      caption={t("activity.caption")}
      label={t("activity.label")}
      max={1}
      valueOptions={{ style: "percent" }}
    />
  );
}
