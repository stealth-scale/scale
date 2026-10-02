import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { SunburstChart } from "#sunburst-chart/index.ts";

import { labelled, SPEND } from "./spend.ts";

export function Palette(): ReactElement {
  const { t } = useWords("sunburst-chart");

  return (
    <SunburstChart
      caption={t("palette.caption")}
      label={t("spend.label")}
      legendLabel={t("teams")}
      nodes={labelled(SPEND, (key) => t(`names.${key}`), {
        data: "teal",
        platform: "purple",
        product: "orange",
      })}
      shareLabel={t("share")}
      valueLabel={t("value")}
      valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
      values={false}
    />
  );
}
