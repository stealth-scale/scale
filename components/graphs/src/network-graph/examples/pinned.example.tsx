import { type ReactElement } from "react";

import { FactoryIcon, WarehouseIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { NetworkGraph } from "#network-graph/index.ts";

const SITES = [
  { icon: <FactoryIcon />, id: "eindhoven", weight: 9 },
  { icon: <WarehouseIcon />, id: "venlo", weight: 6 },
  { icon: <FactoryIcon />, id: "genk", weight: 5 },
  { icon: <FactoryIcon />, id: "kortrijk", weight: 4 },
  { icon: <FactoryIcon />, id: "timisoara", weight: 4 },
  { icon: <FactoryIcon />, id: "bochum", weight: 3 },
] as const;

const DELIVERIES = [
  { source: "eindhoven", strength: 2, target: "venlo" },
  { source: "venlo", strength: 2, target: "genk" },
  { source: "venlo", target: "kortrijk" },
  { source: "venlo", target: "timisoara" },
  { source: "genk", target: "bochum" },
  { source: "eindhoven", target: "genk" },
];

export function Pinned(): ReactElement {
  const { t } = useWords("network-graph");
  const nodes = SITES.map(({ icon, id, weight }) => ({
    icon,
    id,
    label: t(`pinned.sites.${id}`),
    weight,
  }));

  return (
    <NetworkGraph
      clearLabel={t("words.clear")}
      draggable={false}
      edgeName={({ source, target }) => t("words.edge", { source, target })}
      focusLabel={t("words.focus")}
      label={t("pinned.label")}
      links={DELIVERIES}
      neighborLabel={t("words.connected")}
      nodeDescription={t("words.fixed")}
      nodes={nodes}
      promptLabel={t("pinned.prompt")}
      summary={({ count, name }) => t("pinned.summary", { count, name })}
    />
  );
}
