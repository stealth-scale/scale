import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { WaterfallChart } from "#waterfall-chart/index.ts";

const CHANGES = [3, 2, -1, 4, 1, 0, 5, -2, 3, 1, -1, 2];

export function Headcount(): ReactElement {
  const { i18n, t } = useWords("waterfall-chart");
  const month = new Intl.DateTimeFormat(i18n.language, { month: "short", timeZone: "UTC" });

  return (
    <WaterfallChart
      caption={t("headcount.caption")}
      connectors={false}
      label={t("headcount.label")}
      steps={[
        { key: "start", label: t("headcount.start"), total: true, value: 48 },
        ...CHANGES.map((value, index) => ({
          key: String(index),
          label: month.format(Date.UTC(2026, index, 1)),
          value,
        })),
        { key: "end", label: t("headcount.end"), total: true },
      ]}
      valueLabel={t("headcount.people")}
      valueLabels={false}
    />
  );
}
