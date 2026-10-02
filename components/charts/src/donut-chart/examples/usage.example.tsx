import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { DonutChart } from "#donut-chart/index.ts";

const KINDS = [
  { gigabytes: 118, key: "video" },
  { gigabytes: 42, key: "images" },
  { gigabytes: 26, key: "archives" },
  { gigabytes: 9.5, key: "documents" },
];

export function Usage(): ReactElement {
  const { i18n, t } = useWords("donut-chart");
  const gigabytes = new Intl.NumberFormat(i18n.language, {
    maximumFractionDigits: 1,
    style: "unit",
    unit: "gigabyte",
  });
  const total = KINDS.reduce((sum, kind) => sum + kind.gigabytes, 0);

  return (
    <DonutChart
      caption={t("usage.caption")}
      center={gigabytes.format(total)}
      centerLabel={t("usage.center")}
      label={t("usage.label")}
      legendLabel={t("usage.legend")}
      slices={KINDS.map(({ gigabytes: value, key }) => ({ key, label: t(`usage.${key}`), value }))}
      valueOptions={{ maximumFractionDigits: 1, style: "unit", unit: "gigabyte" }}
    />
  );
}
