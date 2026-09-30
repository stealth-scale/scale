import { type ReactElement } from "react";

import { addEdge, useEdgesState, useNodesState } from "@xyflow/react";
import { MaximizeIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Graph from "#graph/index.ts";
import { layoutGraph } from "#layout/index.ts";

const IDS = ["webhook", "enrich", "route", "slack", "email"] as const;

const LINKS = [
  ["webhook", "enrich"],
  ["enrich", "route"],
  ["route", "slack"],
] as const;

export function Editor(): ReactElement {
  const { t } = useWords("graph");
  const [nodes, , onNodesChange] = useNodesState(
    layoutGraph(
      IDS.map((id) => ({
        data: { label: t(`editor.${id}`) },
        id,
        position: { x: 0, y: 0 },
        type: id === "webhook" ? "input" : id === "slack" || id === "email" ? "output" : "default",
      })),
      LINKS.map(([source, target]) => ({ id: `${source}-${target}`, source, target })),
      { ranksep: 64 },
    ),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    LINKS.map(([source, target]) => ({ id: `${source}-${target}`, source, target })),
  );

  return (
    <Stack>
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
        </Graph.Controls>
        <Graph.Canvas
          edges={edges}
          label={t("editor.label")}
          nodes={nodes}
          onConnect={(connection) => {
            setEdges((current) => addEdge(connection, current));
          }}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
          removeGlyph={<XIcon />}
          removeName={({ source, target }) => t("editor.remove", { source, target })}
        />
      </Graph.Root>
      <Text as="output" size="sm" tone="muted">
        {t("editor.count", { count: edges.length })}
      </Text>
    </Stack>
  );
}
