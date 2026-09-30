import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { StackedAreaChart } from "#stacked-area-chart/index.ts";

const MONTHS = [
  [5800, 2100, 900, 1200],
  [6100, 2300, 1000, 1400],
  [6400, 2600, 1100, 1900],
  [6900, 2700, 1300, 2600],
  [7200, 2900, 1500, 3400],
  [7600, 3000, 1700, 4300],
].map(([web, ios, android, api], index) => ({
  android,
  api,
  ios,
  month: `2026-0${String(4 + index)}-01`,
  web,
}));

export function Share(): ReactElement {
  const { t } = useWords("stacked-area-chart");

  return (
    <StackedAreaChart
      caption={t("share.caption")}
      categoryKey="month"
      data={MONTHS}
      label={t("share.label")}
      labelOptions={{ month: "short", timeZone: "UTC" }}
      legendLabel={t("series")}
      percent
      series={[
        { key: "web", label: t("share.web") },
        { key: "ios", label: t("share.ios") },
        { key: "android", label: t("share.android") },
        { key: "api", label: t("share.api") },
      ]}
    />
  );
}
