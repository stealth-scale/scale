import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { BubbleChart } from "#bubble-chart/index.ts";

const ACCOUNTS: Array<{ active: number; arr: number; seats: number }> = [];

export function Quiet(): ReactElement {
  const { t } = useWords("bubble-chart");

  return (
    <BubbleChart
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      label={t("accounts.label")}
      series={[{ key: "accounts", label: t("quiet.accounts"), points: ACCOUNTS }]}
      sizeKey="arr"
      sizeLabel={t("accounts.arr")}
      xKey="seats"
      xLabel={t("accounts.seats")}
      yKey="active"
      yLabel={t("accounts.active")}
    />
  );
}
