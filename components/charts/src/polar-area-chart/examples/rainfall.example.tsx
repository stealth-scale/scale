import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PolarAreaChart } from "#polar-area-chart/index.ts";

import { RAINFALL } from "./cycles.ts";

export function Rainfall(): ReactElement {
  const { t } = useWords("polar-area-chart");

  return (
    <PolarAreaChart
      caption={t("rainfall.caption")}
      label={t("rainfall.label")}
      slices={RAINFALL.map(({ key, value }) => ({ key, label: t(`months.${key}`), value }))}
      valueOptions={{ style: "unit", unit: "millimeter", unitDisplay: "narrow" }}
    />
  );
}
