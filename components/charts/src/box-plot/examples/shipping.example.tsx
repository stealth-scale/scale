import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BoxPlot } from "#box-plot/index.ts";

import { ECONOMY, EXPRESS, STANDARD } from "./methods.ts";

export function Shipping(): ReactElement {
  const { t } = useWords("box-plot");

  return (
    <BoxPlot
      caption={t("shipping.caption")}
      color="teal"
      countLabel={t("shipping.orders")}
      groups={[
        { key: "express", label: t("shipping.express"), values: EXPRESS },
        { key: "standard", label: t("shipping.standard"), values: STANDARD },
        { key: "economy", label: t("shipping.economy"), values: ECONOMY },
      ]}
      label={t("shipping.label")}
      valueDomain={[0, 12]}
      valueOptions={{ style: "unit", unit: "day", unitDisplay: "narrow" }}
    />
  );
}
