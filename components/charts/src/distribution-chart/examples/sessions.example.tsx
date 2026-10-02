import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { DistributionChart } from "#distribution-chart/index.ts";

import { FREE, PRO } from "./sessions.ts";

export function Sessions(): ReactElement {
  const { t } = useWords("distribution-chart");

  return (
    <DistributionChart
      caption={t("sessions.caption")}
      label={t("sessions.label")}
      legendLabel={t("sessions.plans")}
      normalize
      series={[
        { key: "free", label: t("sessions.free"), values: FREE },
        { key: "pro", label: t("sessions.pro"), values: PRO },
      ]}
      valueOptions={{ style: "unit", unit: "minute", unitDisplay: "short" }}
    />
  );
}
