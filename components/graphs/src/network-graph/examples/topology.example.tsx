import { type ReactElement } from "react";

import {
  ClockIcon,
  DatabaseIcon,
  GlobeIcon,
  MaximizeIcon,
  MinusIcon,
  PlusIcon,
  ServerIcon,
} from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Graph from "#graph/index.ts";
import { NetworkGraph } from "#network-graph/index.ts";

const ICONS = {
  core: <ServerIcon />,
  data: <DatabaseIcon />,
  edge: <GlobeIcon />,
  ops: <ClockIcon />,
};

const SERVICES = [
  { group: "edge", id: "api-gateway", weight: 9 },
  { group: "edge", id: "cdn-edge", weight: 3 },
  { group: "core", id: "auth-service", weight: 7 },
  { group: "core", id: "checkout-api", weight: 8 },
  { group: "core", id: "ledger-worker", weight: 6 },
  { group: "core", id: "payout-service", weight: 4 },
  { group: "data", id: "postgres-primary", weight: 8 },
  { group: "data", id: "redis-sessions", weight: 5 },
  { group: "data", id: "kafka-events", weight: 7 },
  { group: "data", id: "search-index", weight: 3 },
  { group: "ops", id: "cron-scheduler", weight: 2 },
  { group: "ops", id: "fax-gateway", weight: 1 },
] as const;

const CALLS = [
  { source: "cdn-edge", target: "api-gateway" },
  { source: "api-gateway", strength: 2, target: "auth-service" },
  { source: "api-gateway", strength: 2, target: "checkout-api" },
  { source: "api-gateway", target: "search-index" },
  { source: "auth-service", strength: 2, target: "redis-sessions" },
  { source: "auth-service", target: "postgres-primary" },
  { source: "checkout-api", strength: 2, target: "postgres-primary" },
  { source: "checkout-api", strength: 2, target: "kafka-events" },
  { source: "ledger-worker", strength: 2, target: "kafka-events" },
  { source: "ledger-worker", target: "postgres-primary" },
  { source: "payout-service", target: "ledger-worker" },
  { source: "payout-service", target: "kafka-events" },
  { source: "cron-scheduler", target: "payout-service" },
  { source: "kafka-events", target: "search-index" },
];

export function Topology(): ReactElement {
  const { t } = useWords("network-graph");
  const nodes = SERVICES.map(({ group, id, weight }) => ({
    icon: ICONS[group],
    id,
    label: id,
    weight,
  }));

  return (
    <NetworkGraph
      caption={t("topology.caption")}
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
      defaultFocus="checkout-api"
      edgeName={({ source, target }) => t("words.edge", { source, target })}
      focusLabel={t("words.focus")}
      label={t("topology.label")}
      links={CALLS}
      neighborLabel={t("words.connected")}
      nodeDescription={t("words.description")}
      nodes={nodes}
      overview={<Graph.MiniMap label={t("topology.overview")} />}
      promptLabel={t("topology.prompt")}
      ratio="wide"
      summary={({ count, name }) => t("topology.summary", { count, name })}
    />
  );
}
