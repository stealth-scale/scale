import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BoxPlot } from "#box-plot/index.ts";

import { DESKTOP, MOBILE, TABLET } from "./paints.ts";

export function Warehouse(): ReactElement {
  const { t } = useWords("box-plot");

  return (
    <BoxPlot
      caption={t("warehouse.caption")}
      countLabel={t("warehouse.loads")}
      groups={[
        { key: "desktop", label: t("warehouse.desktop"), summary: DESKTOP },
        { key: "tablet", label: t("warehouse.tablet"), summary: TABLET },
        { key: "mobile", label: t("warehouse.mobile"), summary: MOBILE },
      ]}
      label={t("warehouse.label")}
      valueOptions={{ style: "unit", unit: "second", unitDisplay: "narrow" }}
    />
  );
}
