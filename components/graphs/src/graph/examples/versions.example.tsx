import { type ReactElement } from "react";

import { type Edge, type Node } from "@xyflow/react";

import { Grid } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { diffGraphs } from "#diff/index.ts";
import * as Graph from "#graph/index.ts";
import { layoutGraph } from "#layout/index.ts";

const ORIGIN = { x: 0, y: 0 };

const BEFORE = {
  links: [
    ["screen", "draft"],
    ["draft", "publish"],
    ["publish", "notify"],
  ],
  steps: [
    ["screen", "screening"],
    ["draft", "small"],
    ["publish", "helpCentre"],
    ["notify", "email"],
  ],
} as const;

const AFTER = {
  links: [
    ["screen", "draft"],
    ["draft", "score"],
    ["score", "publish"],
  ],
  steps: [
    ["screen", "screening"],
    ["draft", "large"],
    ["score", "three"],
    ["publish", "helpCentre"],
  ],
} as const;

function edgesOf(links: typeof AFTER.links | typeof BEFORE.links): Edge[] {
  return links.map(([source, target]) => ({ id: `${source}-${target}`, source, target }));
}

export function Versions(): ReactElement {
  const { t } = useWords("graph");
  const nodesOf = (steps: typeof AFTER.steps | typeof BEFORE.steps): Node[] =>
    steps.map(([id, detail]) => ({
      data: { label: t(`versions.steps.${id}`), subtitle: t(`versions.details.${detail}`) },
      id,
      position: ORIGIN,
    }));
  const before = { edges: edgesOf(BEFORE.links), nodes: nodesOf(BEFORE.steps) };
  const after = { edges: edgesOf(AFTER.links), nodes: nodesOf(AFTER.steps) };
  const diff = diffGraphs(before, after);
  const words = {
    addedLabel: t("versions.added"),
    changedLabel: t("versions.changed"),
    removedLabel: t("versions.removed"),
  };

  return (
    <Grid.Root columns="fit-xs" gap="md">
      <Grid.Item>
        <Graph.Root ratio="portrait">
          <Graph.Canvas
            changes={diff}
            edges={before.edges}
            label={t("versions.before.label")}
            nodes={layoutGraph(before.nodes, before.edges)}
            readOnly
            {...words}
          />
          <Graph.Caption>{t("versions.before.caption")}</Graph.Caption>
        </Graph.Root>
      </Grid.Item>
      <Grid.Item>
        <Graph.Root ratio="portrait">
          <Graph.Canvas
            changes={diff}
            edges={after.edges}
            label={t("versions.after.label")}
            nodes={layoutGraph(after.nodes, after.edges)}
            readOnly
            {...words}
          />
          <Graph.Caption>{t("versions.after.caption")}</Graph.Caption>
        </Graph.Root>
      </Grid.Item>
    </Grid.Root>
  );
}
