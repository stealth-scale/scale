import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PolarAreaChart } from "#polar-area-chart/index.ts";

import { HOURS } from "./cycles.ts";

export function Bare(): ReactElement {
  const { t } = useWords("polar-area-chart");

  return (
    <PolarAreaChart
      caption={t("requests.caption")}
      label={t("requests.label")}
      names={false}
      slices={HOURS.map(({ key, value }) => ({ key, label: t(`hours.${key}`), value }))}
    />
  );
}
