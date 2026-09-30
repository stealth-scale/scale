import { type ReactElement } from "react";

import {
  BrainCircuitIcon,
  ChartColumnIcon,
  DatabaseIcon,
  FileDownIcon,
  LayersIcon,
} from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { DirectedGraph } from "#directed-graph/index.ts";

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
  { id: "stg_events", kind: "model" },
  { id: "stg_accounts", kind: "model" },
  { id: "fct_revenue", kind: "model" },
  { id: "dim_customer", kind: "model" },
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

export function Isolate(): ReactElement {
  const { t } = useWords("directed-graph");
  const nodes = DATASETS.map((dataset) => ({
    icon: ICONS[dataset.kind],
    id: dataset.id,
    kind: t(`kinds.${dataset.kind}`),
    label:
      dataset.kind === "dashboard" || dataset.kind === "job"
        ? t(`lineage.${dataset.id}`)
        : dataset.id,
  }));

  return (
    <DirectedGraph
      clearLabel={t("words.clear")}
      defaultFocus="fct_revenue"
      depth={1}
      direction="right"
      downstreamLabel={t("words.downstream")}
      edgeName={({ source, target }) => t("words.edge", { source, target })}
      edges={EDGES}
      focusLabel={t("words.focus")}
      label={t("isolate.label")}
      nodeDescription={t("words.description")}
      nodes={nodes}
      promptLabel={t("words.prompt")}
      summary={({ downstream, name, upstream }) =>
        t("words.summary", { downstream, name, upstream })
      }
      trace="isolate"
      upstreamLabel={t("words.upstream")}
    />
  );
}
