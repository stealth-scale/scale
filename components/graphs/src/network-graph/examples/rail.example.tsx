import { type ReactElement } from "react";

import { MaximizeIcon, MinusIcon, PlusIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Graph from "#graph/index.ts";
import { NetworkGraph } from "#network-graph/index.ts";

const CITIES = [
  "Amsterdam",
  "Athens",
  "Barcelona",
  "Berlin",
  "Bern",
  "Bratislava",
  "Brussels",
  "Bucharest",
  "Budapest",
  "Copenhagen",
  "Dublin",
  "Düsseldorf",
  "Frankfurt",
  "Geneva",
  "Gothenburg",
  "Hamburg",
  "Helsinki",
  "Kraków",
  "Lisbon",
  "Ljubljana",
  "London",
  "Lyon",
  "Madrid",
  "Marseille",
  "Milan",
  "Munich",
  "Oslo",
  "Paris",
  "Porto",
  "Prague",
  "Riga",
  "Rome",
  "Sofia",
  "Stockholm",
  "Tallinn",
  "Vienna",
  "Vilnius",
  "Warsaw",
  "Zagreb",
  "Zürich",
];

const STATIONS = CITIES.map((label) => ({ id: label, label }));

const SERVICES = CITIES.flatMap((city, at) =>
  [1, 11].map((step) => ({ source: city, target: CITIES[(at + step) % CITIES.length] ?? city })),
);

export function Rail(): ReactElement {
  const { t } = useWords("network-graph");

  return (
    <NetworkGraph
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
      edgeName={({ source, target }) => t("words.edge", { source, target })}
      focusLabel={t("words.focus")}
      label={t("rail.label")}
      links={SERVICES}
      neighborLabel={t("words.connected")}
      nodeDescription={t("words.description")}
      nodes={STATIONS}
      overview={<Graph.MiniMap label={t("rail.overview")} />}
      promptLabel={t("rail.prompt")}
      ratio="wide"
      seed={6}
      summary={({ count, name }) => t("rail.summary", { count, name })}
    />
  );
}
