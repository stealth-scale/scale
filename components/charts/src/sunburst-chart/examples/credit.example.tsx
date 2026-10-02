import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { hierarchyLeaves } from "#hierarchy/index.ts";
import { SunburstChart } from "#sunburst-chart/index.ts";

import { CREDITED, labelled } from "./spend.ts";

export function Credit(): ReactElement {
  const { t } = useWords("sunburst-chart");
  const nodes = labelled(CREDITED, (key) => t(`names.${key}`));
  const below = hierarchyLeaves(nodes).filter((leaf) => leaf.value < 0);

  return (
    <SunburstChart
      caption={t("credit.caption", {
        count: below.length,
        names: below.map((leaf) => t(`names.${leaf.key}`)).join(", "),
      })}
      label={t("spend.label")}
      legendLabel={t("teams")}
      nodes={nodes}
      shareLabel={t("share")}
      valueLabel={t("value")}
      valueOptions={{ currency: "EUR", maximumFractionDigits: 0, style: "currency" }}
    />
  );
}
