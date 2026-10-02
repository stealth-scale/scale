import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { PieChart } from "#pie-chart/index.ts";

export function Survey(): ReactElement {
  const { t } = useWords("pie-chart");

  return (
    <PieChart
      caption={t("survey.caption")}
      defaultHiddenKeys={["none"]}
      label={t("survey.label")}
      legendLabel={t("survey.legend")}
      slices={[
        { key: "yes", label: t("survey.yes"), value: 420 },
        { key: "no", label: t("survey.no"), value: 180 },
        { key: "unsure", label: t("survey.unsure"), value: 90 },
        { color: "neutral", key: "none", label: t("survey.none"), value: 110 },
      ]}
    />
  );
}
