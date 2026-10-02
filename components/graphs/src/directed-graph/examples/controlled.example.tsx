import { type ReactElement, useState } from "react";

import { ChartColumnIcon, ChevronDownIcon, DatabaseIcon, LayersIcon } from "lucide-react";

import { NativeSelect } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { DirectedGraph } from "#directed-graph/index.ts";

const DATASETS = [
  { icon: <DatabaseIcon />, id: "orders", kind: "source" },
  { icon: <DatabaseIcon />, id: "refunds", kind: "source" },
  { icon: <LayersIcon />, id: "net_orders", kind: "model" },
  { icon: <ChartColumnIcon />, id: "exec_overview", kind: "dashboard" },
] as const;

const EDGES = [
  { source: "orders", target: "net_orders" },
  { source: "refunds", target: "net_orders" },
  { source: "net_orders", target: "exec_overview" },
];

export function Controlled(): ReactElement {
  const { t } = useWords("directed-graph");
  const [focus, setFocus] = useState<null | string>("net_orders");
  const nodes = DATASETS.map((dataset) => ({
    icon: dataset.icon,
    id: dataset.id,
    kind: t(`kinds.${dataset.kind}`),
    label: dataset.kind === "dashboard" ? t(`lineage.${dataset.id}`) : dataset.id,
  }));

  return (
    <Stack align="flex-start">
      <NativeSelect.Root>
        <NativeSelect.Field
          aria-label={t("controlled.pick")}
          onChange={(event) => {
            setFocus(event.target.value === "" ? null : event.target.value);
          }}
          placeholder={t("controlled.none")}
          value={focus ?? ""}
        >
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator>
          <ChevronDownIcon />
        </NativeSelect.Indicator>
      </NativeSelect.Root>
      <DirectedGraph
        clearLabel={t("words.clear")}
        direction="right"
        downstreamLabel={t("words.downstream")}
        edgeName={({ source, target }) => t("words.edge", { source, target })}
        edges={EDGES}
        focus={focus}
        focusLabel={t("words.focus")}
        label={t("controlled.label")}
        nodeDescription={t("words.description")}
        nodes={nodes}
        onFocusChange={setFocus}
        promptLabel={t("words.prompt")}
        summary={({ downstream, name, upstream }) =>
          t("words.summary", { downstream, name, upstream })
        }
        upstreamLabel={t("words.upstream")}
      />
    </Stack>
  );
}
