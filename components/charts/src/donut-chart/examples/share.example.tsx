import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { DonutChart } from "#donut-chart/index.ts";

export function Share(): ReactElement {
  const { t } = useWords("donut-chart");

  return (
    <DonutChart
      caption={t("share.caption")}
      center={t("share.center")}
      centerLabel={t("share.centerLabel")}
      label={t("share.label")}
      legendLabel={t("share.legend")}
      slices={[
        { key: "starter", label: t("share.starter"), value: 610 },
        { key: "growth", label: t("share.growth"), value: 520 },
        { key: "scale", label: t("share.scale"), value: 170 },
      ]}
    />
  );
}
