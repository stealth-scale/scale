import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BoxPlot } from "#box-plot/index.ts";

import { AMSTERDAM, FRANKFURT, SINGAPORE, VIRGINIA } from "./regions.ts";

export function Slowest(): ReactElement {
  const { t } = useWords("box-plot");

  return (
    <BoxPlot
      caption={t("slowest.caption")}
      countLabel={t("requests")}
      defaultIndex={3}
      groups={[
        { key: "frankfurt", label: t("regions.frankfurt"), values: FRANKFURT },
        { key: "amsterdam", label: t("regions.amsterdam"), values: AMSTERDAM },
        { key: "virginia", label: t("regions.virginia"), values: VIRGINIA },
        { key: "singapore", label: t("regions.singapore"), values: SINGAPORE },
      ]}
      label={t("regions.label")}
      valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
    />
  );
}
