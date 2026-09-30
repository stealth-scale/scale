import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Graph from "#graph/index.ts";
import { layoutGraph } from "#layout/index.ts";

const STEPS = ["draft", "review", "publish"] as const;

const EDGES = [
  { id: "draft-review", source: "draft", target: "review" },
  { id: "review-publish", source: "review", target: "publish" },
];

export function Review(props: Graph.RootProps): ReactElement {
  const { t } = useWords("graph");
  const nodes = layoutGraph(
    STEPS.map((step) => ({
      data: { label: t(`review.${step}`) },
      id: step,
      position: { x: 0, y: 0 },
      type: step === "draft" ? "input" : step === "publish" ? "output" : "default",
    })),
    EDGES,
    { ranksep: 48 },
  );

  return (
    <Graph.Root {...props}>
      <Graph.Canvas edges={EDGES} label={t("review.label")} nodes={nodes} readOnly />
    </Graph.Root>
  );
}
