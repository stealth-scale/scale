import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ViolinPlot } from "#violin-plot/index.ts";

import { CHECKOUT, PROFILE, SEARCH } from "./endpoints.ts";

export function Outline(): ReactElement {
  const { t } = useWords("violin-plot");

  return (
    <ViolinPlot
      caption={t("outline.caption")}
      countLabel={t("requests")}
      groups={[
        { key: "search", label: t("endpoints.search"), values: SEARCH },
        { key: "checkout", label: t("endpoints.checkout"), values: CHECKOUT },
        { key: "profile", label: t("endpoints.profile"), values: PROFILE },
      ]}
      label={t("endpoints.label")}
      quartiles={false}
      valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
    />
  );
}
