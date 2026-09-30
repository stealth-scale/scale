import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PolarAreaChart } from "#polar-area-chart/index.ts";

import { WIND } from "./cycles.ts";

export function Wind(): ReactElement {
  const { t } = useWords("polar-area-chart");

  return (
    <PolarAreaChart
      caption={t("wind.caption")}
      color="teal"
      label={t("wind.label")}
      slices={WIND.map(({ key, value }) => ({ key, label: t(`points.${key}`), value }))}
      valueOptions={{ style: "unit", unit: "hour", unitDisplay: "narrow" }}
    />
  );
}
