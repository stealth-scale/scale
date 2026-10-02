import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ViolinPlot } from "#violin-plot/index.ts";

const NONE: number[] = [];

export function Quiet(): ReactElement {
  const { t } = useWords("violin-plot");

  return (
    <ViolinPlot
      caption={t("quiet.caption")}
      countLabel={t("requests")}
      empty={t("quiet.empty")}
      groups={[
        { key: "search", label: t("endpoints.search"), values: NONE },
        { key: "checkout", label: t("endpoints.checkout"), values: NONE },
        { key: "profile", label: t("endpoints.profile"), values: NONE },
      ]}
      label={t("endpoints.label")}
    />
  );
}
