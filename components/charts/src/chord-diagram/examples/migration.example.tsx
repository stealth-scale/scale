import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ChordDiagram } from "#chord-diagram/index.ts";
import { flowBalance } from "#sankey-chart/index.ts";

import { MOVES, named, REGIONS } from "./calls.ts";

export function Migration(): ReactElement {
  const { t } = useWords("chord-diagram");
  const nodes = named(REGIONS, (key) => t(`names.${key}`));
  const north = flowBalance(nodes, MOVES).find((region) => region.key === "north");

  return (
    <ChordDiagram
      caption={t("migration.caption", {
        gained: (north?.inflow ?? 0) - (north?.outflow ?? 0),
        name: t("names.north"),
      })}
      flows={MOVES}
      inflowLabel={t("migration.in")}
      label={t("migration.label")}
      nodes={nodes}
      outflowLabel={t("migration.out")}
    />
  );
}
