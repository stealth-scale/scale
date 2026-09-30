import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { DonutChart } from "#donut-chart/index.ts";

const CAUSES = [
  { count: 14, key: "deploy" },
  { count: 9, key: "dependency" },
  { count: 6, key: "capacity" },
  { count: 3, key: "network" },
  { count: 2, key: "certificate" },
  { count: 1, key: "dns" },
];

export function Incidents(): ReactElement {
  const { t } = useWords("donut-chart");
  const total = CAUSES.reduce((sum, cause) => sum + cause.count, 0);

  return (
    <DonutChart
      caption={t("incidents.caption")}
      center={String(total)}
      centerLabel={t("incidents.center")}
      label={t("incidents.label")}
      legendLabel={t("incidents.legend")}
      maxSlices={4}
      otherLabel={t("incidents.other")}
      slices={CAUSES.map(({ count, key }) => ({ key, label: t(`incidents.${key}`), value: count }))}
    />
  );
}
