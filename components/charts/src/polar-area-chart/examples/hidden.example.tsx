import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PolarAreaChart } from "#polar-area-chart/index.ts";

import { HOURS } from "./cycles.ts";

export function Hidden(): ReactElement {
  const { t } = useWords("polar-area-chart");

  return (
    <PolarAreaChart
      caption={t("hidden.caption")}
      defaultHiddenKeys={["12"]}
      label={t("requests.label")}
      slices={HOURS.map(({ key, value }) => ({ key, label: t(`hours.${key}`), value }))}
    />
  );
}
