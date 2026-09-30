import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PolarAreaChart } from "#polar-area-chart/index.ts";

export function Quiet(): ReactElement {
  const { t } = useWords("polar-area-chart");

  return (
    <PolarAreaChart
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      label={t("requests.label")}
      slices={[]}
    />
  );
}
