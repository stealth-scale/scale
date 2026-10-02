import { type ReactElement, useRef, useState } from "react";

import { type Edge, type Node, useEdgesState, useNodesState, type XYPosition } from "@xyflow/react";
import { XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Graph from "#graph/index.ts";

const KINDS = ["fraud", "stock", "notice"] as const;

interface Version {
  readonly edges: Edge[];
  readonly nodes: Node[];
  readonly note: string;
}

export function Workflow(): ReactElement {
  const { t } = useWords("graph");
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([
    {
      data: { label: t("workflow.placed") },
      id: "placed",
      position: { x: 0, y: 0 },
      type: "input",
    },
    {
      data: { label: t("workflow.receipt") },
      id: "receipt",
      position: { x: 0, y: 240 },
      type: "output",
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: "placed-receipt", source: "placed", target: "receipt" },
  ]);
  const start = useRef({ edges, nodes });
  const [versions, setVersions] = useState<Version[]>([]);
  const [note, setNote] = useState<string>();
  const names = new Map<string, string>(KINDS.map((kind) => [kind, t(`workflow.kinds.${kind}`)]));
  const commit = (version: Version): void => {
    setVersions((known) => [version, ...known]);
    setNote(version.note);
    setNodes(version.nodes);
    setEdges(version.edges);
  };
  const add = (kind: string, position: XYPosition): void => {
    const label = names.get(kind) ?? kind;
    const id = `${kind}-${crypto.randomUUID()}`;

    commit({
      edges,
      nodes: [...nodes, { data: { label }, id, origin: [0.5, 0.5], position }],
      note: t("workflow.edits.add", { name: label }),
    });
  };

  return (
    <Graph.Root>
      <Stack direction="row" gap="sm" wrap>
        {KINDS.map((kind) => (
          <Graph.PaletteItem item={kind} key={kind} onAdd={add} size="sm">
            {t(`workflow.add.${kind}`)}
          </Graph.PaletteItem>
        ))}
      </Stack>
      <Graph.Canvas
        edges={edges}
        label={t("workflow.label")}
        nodes={nodes}
        onDropItem={add}
        onEdgesChange={onEdgesChange}
        onGraphChange={(graph, step) => {
          const touched = step.nodes.length > 0 ? step.nodes : step.edges;
          const kind = step.type === "remove" && step.nodes.length === 0 ? "unlink" : step.type;

          commit({ ...graph, note: t(`workflow.edits.${kind}`, { count: touched.length }) });
        }}
        onNodesChange={onNodesChange}
        removeGlyph={<XIcon />}
        removeName={({ source, target }) => t("workflow.remove", { source, target })}
      />
      <Graph.Summary>
        <output>{note ?? t("workflow.none")}</output>
        <Button
          aria-disabled={versions.length === 0 ? true : undefined}
          onClick={() => {
            const [last, ...rest] = versions;

            if (last === undefined) return;

            const graph = rest[0] ?? start.current;

            setNodes(graph.nodes);
            setEdges(graph.edges);
            setVersions(rest);
            setNote(t("workflow.undone", { edit: last.note }));
          }}
          size="sm"
          variant="outline"
        >
          {t("workflow.undo")}
        </Button>
      </Graph.Summary>
    </Graph.Root>
  );
}
