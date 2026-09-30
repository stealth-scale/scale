import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { AreaChart } from "#area-chart/index.ts";

const HOURS: Array<{ hour: string; inbound: number; outbound: number }> = [];

export function Offline(): ReactElement {
  const { t } = useWords("area-chart");

  return (
    <AreaChart
      caption={t("offline.caption")}
      categoryKey="hour"
      data={HOURS}
      empty={t("offline.empty")}
      label={t("bandwidth.label")}
      series={[
        { key: "inbound", label: t("bandwidth.inbound") },
        { key: "outbound", label: t("bandwidth.outbound") },
      ]}
    />
  );
}
