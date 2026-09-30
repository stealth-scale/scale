import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Heatmap } from "#heatmap/index.ts";

import { HEADCOUNT_VARIANCE, QUARTERS, TEAMS } from "./readings.ts";

export function Variance(): ReactElement {
  const { t } = useWords("heatmap");

  return (
    <Heatmap
      caption={t("variance.caption")}
      cells={HEADCOUNT_VARIANCE}
      columns={QUARTERS.map((key) => ({ key, label: t(`quarters.${key}`) }))}
      corner={t("variance.corner")}
      label={t("variance.label")}
      rows={TEAMS.map((key) => ({ key, label: t(`names.${key}`) }))}
      scale="diverging"
      size="lg"
      valueLabel={t("variance.value")}
      valueOptions={{ signDisplay: "exceptZero" }}
      values
    />
  );
}
