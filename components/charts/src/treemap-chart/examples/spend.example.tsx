import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { hierarchyLeaves } from "#hierarchy/index.ts";
import { TreemapChart } from "#treemap-chart/index.ts";

import { labelled, SPEND } from "./spend.ts";

export function Spend(): ReactElement {
  const { t } = useWords("treemap-chart");
  const nodes = labelled(SPEND, (key) => t(`names.${key}`));
  const [first, second] = hierarchyLeaves(nodes).toSorted((a, b) => b.value - a.value);

  return (
    <TreemapChart
      caption={
        first &&
        second &&
        t("spend.caption", {
          first: t(`names.${first.key}`),
          second: t(`names.${second.key}`),
          share: Math.round((first.share + second.share) * 100),
        })
      }
      label={t("spend.label")}
      legendLabel={t("teams")}
      nodes={nodes}
      shareLabel={t("share")}
      valueLabel={t("value")}
      valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
    />
  );
}
