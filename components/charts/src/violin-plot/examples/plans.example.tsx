import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ViolinPlot } from "#violin-plot/index.ts";

import { FREE, PRO, TEAM } from "./sessions.ts";

export function Plans(): ReactElement {
  const { t } = useWords("violin-plot");

  return (
    <ViolinPlot
      caption={t("plans.caption")}
      color="teal"
      countLabel={t("plans.sessions")}
      groups={[
        { key: "free", label: t("plans.free"), values: FREE },
        { key: "pro", label: t("plans.pro"), values: PRO },
        { key: "team", label: t("plans.team"), values: TEAM },
      ]}
      label={t("plans.label")}
      valueDomain={[0, 60]}
      valueOptions={{ style: "unit", unit: "minute", unitDisplay: "short" }}
    />
  );
}
