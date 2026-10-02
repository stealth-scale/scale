import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Graph from "#graph/index.ts";
import { layoutGraph } from "#layout/index.ts";

const CALLS = [
  ["gateway", "auth"],
  ["gateway", "catalog"],
  ["gateway", "cart"],
  ["gateway", "search"],
  ["cart", "pricing"],
  ["cart", "inventory"],
  ["catalog", "inventory"],
  ["catalog", "media"],
  ["search", "catalog"],
  ["checkout", "cart"],
  ["checkout", "payments"],
  ["checkout", "shipping"],
  ["payments", "fraud"],
  ["payments", "ledger"],
  ["shipping", "inventory"],
  ["gateway", "checkout"],
] as const;

const IDS = [...new Set(CALLS.flat())];

const EDGES = CALLS.map(([source, target]) => ({ id: `${source}-${target}`, source, target }));

export function Services(): ReactElement {
  const { t } = useWords("graph");
  const nodes = layoutGraph(
    IDS.map((id) => ({ data: { label: t(`services.${id}`) }, id, position: { x: 0, y: 0 } })),
    EDGES,
    { direction: "right" },
  );

  return (
    <Graph.Root direction="right" ratio="wide">
      <Graph.Canvas edges={EDGES} label={t("services.label")} nodes={nodes} readOnly />
      <Graph.MiniMap label={t("services.overview")} />
      <Graph.Caption>{t("services.caption")}</Graph.Caption>
    </Graph.Root>
  );
}
