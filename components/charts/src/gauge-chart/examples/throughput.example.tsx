import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { GaugeChart } from "#gauge-chart/index.ts";

import { THROUGHPUT_MAX } from "./readings.ts";

export function Throughput(): ReactElement {
  const { t } = useWords("gauge-chart");

  return (
    <GaugeChart
      caption={t("throughput.caption")}
      centerLabel={t("throughput.unit")}
      label={t("throughput.label")}
      max={THROUGHPUT_MAX}
      value={3120}
    />
  );
}
