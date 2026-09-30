import { type ReactElement } from "react";

import {
  BrainCircuitIcon,
  ChartColumnIcon,
  DatabaseIcon,
  FileDownIcon,
  LayersIcon,
  MaximizeIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { DirectedGraph } from "#directed-graph/index.ts";
import * as Graph from "#graph/index.ts";

const ICONS = {
  dashboard: <ChartColumnIcon />,
  features: <BrainCircuitIcon />,
  job: <FileDownIcon />,
  model: <LayersIcon />,
  source: <DatabaseIcon />,
};

const DATASETS = [
  { id: "stripe_charges", kind: "source" },
  { id: "app_events", kind: "source" },
  { id: "crm_accounts", kind: "source" },
  { id: "stg_charges", kind: "model" },
  { id: "stg_events", kind: "model", status: { key: "failed", palette: "error" } },
  { id: "stg_accounts", kind: "model" },
  { id: "fct_revenue", kind: "model" },
  { id: "dim_customer", kind: "model", status: { key: "stale", palette: "warning" } },
  { id: "exec_overview", kind: "dashboard" },
  { id: "churn_features", kind: "features" },
  { id: "finance_export", kind: "job" },
] as const;

const EDGES = [
  { source: "stripe_charges", target: "stg_charges" },
  { source: "app_events", target: "stg_events" },
  { source: "crm_accounts", target: "stg_accounts" },
  { source: "stg_charges", target: "fct_revenue" },
  { source: "stg_events", target: "fct_revenue" },
  { source: "stg_accounts", target: "dim_customer" },
  { source: "stg_events", target: "dim_customer" },
  { source: "fct_revenue", target: "exec_overview" },
  { source: "dim_customer", target: "exec_overview" },
  { source: "dim_customer", target: "churn_features" },
  { source: "fct_revenue", target: "finance_export" },
];

export function Lineage(): ReactElement {
  const { t } = useWords("directed-graph");
  const nodes = DATASETS.map((dataset) => ({
    icon: ICONS[dataset.kind],
    id: dataset.id,
    kind: t(`kinds.${dataset.kind}`),
    label:
      dataset.kind === "dashboard" || dataset.kind === "job"
        ? t(`lineage.${dataset.id}`)
        : dataset.id,
    status:
      "status" in dataset
        ? { label: t(`status.${dataset.status.key}`), palette: dataset.status.palette }
        : undefined,
  }));

  return (
    <DirectedGraph
      caption={t("lineage.caption")}
      clearLabel={t("words.clear")}
      controls={
        <Graph.Controls label={t("controls")}>
          <Graph.Control action="zoomIn" label={t("zoomIn")}>
            <PlusIcon />
          </Graph.Control>
          <Graph.Control action="zoomOut" label={t("zoomOut")}>
            <MinusIcon />
          </Graph.Control>
          <Graph.Control action="fit" label={t("fit")}>
            <MaximizeIcon />
          </Graph.Control>
          <Graph.ZoomLevel />
        </Graph.Controls>
      }
      defaultFocus="dim_customer"
      direction="right"
      downstreamLabel={t("words.downstream")}
      edgeName={({ source, target }) => t("words.edge", { source, target })}
      edges={EDGES}
      focusLabel={t("words.focus")}
      label={t("lineage.label")}
      nodeDescription={t("words.description")}
      nodes={nodes}
      overview={<Graph.MiniMap label={t("lineage.overview")} />}
      promptLabel={t("words.prompt")}
      ratio="wide"
      summary={({ downstream, name, upstream }) =>
        t("words.summary", { downstream, name, upstream })
      }
      upstreamLabel={t("words.upstream")}
    />
  );
}
