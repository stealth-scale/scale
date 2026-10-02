import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { FunnelChart } from "#funnel-chart/index.ts";

export function Quiet(): ReactElement {
  const { t } = useWords("funnel-chart");

  return (
    <FunnelChart
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      label={t("checkout.label")}
      stages={[]}
    />
  );
}
