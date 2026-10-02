import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BarChart } from "#bar-chart/index.ts";

const MONTHS = [
  [412, 380],
  [356, 400],
  [468, 420],
  [441, 440],
  [398, 460],
  [512, 480],
].map(([signups, target], index) => ({
  month: `2026-0${String(4 + index)}-01`,
  signups,
  target,
}));

export function Targets(): ReactElement {
  const { t } = useWords("bar-chart");

  return (
    <BarChart
      caption={t("targets.caption")}
      categoryKey="month"
      data={MONTHS}
      label={t("targets.label")}
      labelOptions={{ month: "short", timeZone: "UTC" }}
      series={[{ key: "signups", label: t("targets.signups"), target: "target" }]}
      targetLabel={t("targets.target")}
    />
  );
}
