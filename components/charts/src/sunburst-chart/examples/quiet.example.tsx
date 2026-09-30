import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { SunburstChart } from "#sunburst-chart/index.ts";

export function Quiet(): ReactElement {
  const { t } = useWords("sunburst-chart");

  return (
    <SunburstChart
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      label={t("spend.label")}
      nodes={[]}
    />
  );
}
