import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BoxPlot } from "#box-plot/index.ts";

const NONE: number[] = [];

export function Quiet(): ReactElement {
  const { t } = useWords("box-plot");

  return (
    <BoxPlot
      caption={t("quiet.caption")}
      countLabel={t("requests")}
      empty={t("quiet.empty")}
      groups={[
        { key: "frankfurt", label: t("regions.frankfurt"), values: NONE },
        { key: "amsterdam", label: t("regions.amsterdam"), values: NONE },
        { key: "virginia", label: t("regions.virginia"), values: NONE },
        { key: "singapore", label: t("regions.singapore"), values: NONE },
      ]}
      label={t("regions.label")}
    />
  );
}
