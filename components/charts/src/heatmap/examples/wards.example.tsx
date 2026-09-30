import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Heatmap } from "#heatmap/index.ts";

import { OCCUPANCY, WARDS, WORKDAYS } from "./readings.ts";

export function Wards(): ReactElement {
  const { t } = useWords("heatmap");

  return (
    <Heatmap
      caption={t("wards.caption")}
      cells={OCCUPANCY}
      columns={WORKDAYS.map((key) => ({ key, label: t(`wards.days.${key}`) }))}
      corner={t("wards.corner")}
      label={t("wards.label")}
      missingLabel={t("wards.missing")}
      rows={WARDS.map((key) => ({ key, label: t(`names.${key}`) }))}
      valueLabel={t("wards.value")}
    />
  );
}
