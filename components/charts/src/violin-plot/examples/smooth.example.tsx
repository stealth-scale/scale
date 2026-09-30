import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ViolinPlot } from "#violin-plot/index.ts";

import { CHECKOUT, PROFILE, SEARCH } from "./endpoints.ts";

export function Smooth(): ReactElement {
  const { t } = useWords("violin-plot");

  return (
    <ViolinPlot
      bandwidth={60}
      caption={t("smooth.caption")}
      countLabel={t("requests")}
      groups={[
        { key: "search", label: t("endpoints.search"), values: SEARCH },
        { key: "checkout", label: t("endpoints.checkout"), values: CHECKOUT },
        { key: "profile", label: t("endpoints.profile"), values: PROFILE },
      ]}
      label={t("endpoints.label")}
      valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
    />
  );
}
