import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { SankeyChart, sankeyCycles } from "#sankey-chart/index.ts";

import { CHECKOUT, LOOPED, named } from "./visitors.ts";

export function Loop(): ReactElement {
  const { t } = useWords("sankey-chart");
  const cycles = sankeyCycles(LOOPED);

  return (
    <SankeyChart
      caption={t("loop.caption", {
        count: cycles.length,
        names: cycles
          .map((flow) =>
            t("loop.flow", { from: t(`names.${flow.from}`), to: t(`names.${flow.to}`) }),
          )
          .join(", "),
      })}
      flows={LOOPED}
      inflowLabel={t("in")}
      label={t("loop.label")}
      nodes={named(CHECKOUT, (key) => t(`names.${key}`))}
      outflowLabel={t("out")}
      shareLabel={t("share")}
      valueLabel={t("loop.value")}
    />
  );
}
