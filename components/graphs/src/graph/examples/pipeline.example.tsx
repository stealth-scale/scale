import { type ReactElement } from "react";

import { MaximizeIcon, MinusIcon, PlusIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Graph from "#graph/index.ts";
import { layoutGraph } from "#layout/index.ts";

const STEPS = [
  { id: "orders", type: "input" },
  { id: "customers", type: "input" },
  { id: "clean", status: { key: "succeeded", palette: "success" }, type: "default" },
  { id: "join", status: { key: "running", palette: "info" }, type: "default" },
  { id: "revenue", type: "output" },
  { id: "churn", status: { key: "failed", palette: "error" }, type: "output" },
] as const;

const EDGES = [
  { id: "orders-clean", source: "orders", target: "clean" },
  { id: "clean-join", source: "clean", target: "join" },
  { id: "customers-join", source: "customers", target: "join" },
  { id: "join-revenue", source: "join", target: "revenue" },
  { id: "join-churn", source: "join", target: "churn" },
];

export function Pipeline(): ReactElement {
  const { t } = useWords("graph");
  const nodes = layoutGraph(
    STEPS.map((step) => ({
      data: {
        label: t(`pipeline.${step.id}.label`),
        subtitle: t(`pipeline.${step.id}.kind`),
        ...("status" in step
          ? { status: { label: t(`status.${step.status.key}`), palette: step.status.palette } }
          : {}),
      },
      id: step.id,
      position: { x: 0, y: 0 },
      type: step.type,
    })),
    EDGES,
    { ranksep: 64 },
  );

  return (
    <Graph.Root>
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
      <Graph.Canvas edges={EDGES} label={t("pipeline.label")} nodes={nodes} readOnly />
      <Graph.Caption>{t("pipeline.caption")}</Graph.Caption>
    </Graph.Root>
  );
}
