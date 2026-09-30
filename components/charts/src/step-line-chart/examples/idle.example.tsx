import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { StepLineChart } from "#step-line-chart/index.ts";

const READINGS: Array<{ api: number; at: string; worker: number }> = [];

export function Idle(): ReactElement {
  const { t } = useWords("step-line-chart");

  return (
    <StepLineChart
      caption={t("idle.caption")}
      categoryKey="at"
      data={READINGS}
      empty={t("idle.empty")}
      label={t("replicas.label")}
      series={[
        { key: "api", label: t("replicas.api") },
        { key: "worker", label: t("replicas.worker") },
      ]}
    />
  );
}
