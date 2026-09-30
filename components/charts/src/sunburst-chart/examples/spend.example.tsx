import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { hierarchyLeaves } from "#hierarchy/index.ts";
import { SunburstChart } from "#sunburst-chart/index.ts";

import { labelled, SPEND } from "./spend.ts";

const EUROS: Intl.NumberFormatOptions = {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency",
};

export function Spend(): ReactElement {
  const { i18n, t } = useWords("sunburst-chart");
  const nodes = labelled(SPEND, (key) => t(`names.${key}`));
  const leaves = hierarchyLeaves(nodes);
  const total = leaves.reduce((sum, leaf) => sum + leaf.value, 0);
  const platform = leaves
    .filter((leaf) => leaf.group === "platform")
    .reduce((sum, leaf) => sum + leaf.share, 0);

  return (
    <SunburstChart
      caption={t("spend.caption", { share: Math.round(platform * 100) })}
      center={new Intl.NumberFormat(i18n.language, EUROS).format(total)}
      centerLabel={t("spend.center")}
      label={t("spend.label")}
      legendLabel={t("teams")}
      nodes={nodes}
      shareLabel={t("share")}
      valueLabel={t("value")}
      valueOptions={EUROS}
    />
  );
}
