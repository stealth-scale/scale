import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { DirectedGraph, treeEdges } from "#directed-graph/index.ts";

const PEOPLE = [
  { id: "ceo" },
  { id: "cto", manager: "ceo" },
  { id: "cfo", manager: "ceo" },
  { id: "cpo", manager: "ceo" },
  { id: "eng1", manager: "cto" },
  { id: "eng2", manager: "cto" },
  { id: "eng3", manager: "eng1" },
  { id: "eng4", manager: "eng1" },
  { id: "fin1", manager: "cfo" },
  { id: "des1", manager: "cpo", status: { key: "leave", palette: "warning" } },
  { id: "pm1", manager: "cpo", status: { key: "open", palette: "info" } },
] as const;

const EDGES = treeEdges(PEOPLE, (person) => ("manager" in person ? person.manager : undefined));

export function OrgChart(): ReactElement {
  const { t } = useWords("directed-graph");
  const nodes = PEOPLE.map((person) => ({
    id: person.id,
    kind: t(`people.${person.id}.title`),
    label: t(`people.${person.id}.name`),
    status:
      "status" in person
        ? { label: t(`org.${person.status.key}`), palette: person.status.palette }
        : undefined,
  }));

  return (
    <DirectedGraph
      clearLabel={t("org.clear")}
      collapseLabel={(count) => t("org.collapse", { count })}
      collapsible
      defaultCollapsed={["eng1"]}
      downstreamLabel={t("org.reports")}
      edgeName={({ source, target }) => t("words.edge", { source, target })}
      edges={EDGES}
      emptyLabel={t("org.empty")}
      expandLabel={(count) => t("org.expand", { count })}
      label={t("org.label")}
      nodeDescription={t("org.description")}
      nodes={nodes}
      promptLabel={t("org.prompt")}
      summary={({ downstream, name }) => t("org.summary", { count: downstream, name })}
      trace="off"
      upstreamLabel={t("org.reportsTo")}
    />
  );
}
