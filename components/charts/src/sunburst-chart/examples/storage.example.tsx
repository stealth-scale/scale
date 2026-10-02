import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { SunburstChart } from "#sunburst-chart/index.ts";

import { labelled, STORAGE } from "./spend.ts";

export function Storage(): ReactElement {
  const { t } = useWords("sunburst-chart");

  return (
    <SunburstChart
      caption={t("storage.caption")}
      label={t("storage.label")}
      legendLabel={t("folders")}
      nodes={labelled(STORAGE, (key) => t(`names.${key}`))}
      shareLabel={t("storage.share")}
      valueLabel={t("storage.value")}
      valueOptions={{ maximumFractionDigits: 0, style: "unit", unit: "gigabyte" }}
    />
  );
}
