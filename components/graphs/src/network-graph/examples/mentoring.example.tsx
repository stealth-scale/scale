import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { NetworkGraph } from "#network-graph/index.ts";

const PEOPLE = [
  { id: "elena", label: "Elena Fischer" },
  { id: "priya", label: "Priya Raman" },
  { id: "tomas", label: "Tomás Ferreira" },
  { id: "mateusz", label: "Mateusz Nowak" },
  { id: "ayse", label: "Ayşe Demir" },
  { id: "sofia", label: "Sofia Rossi" },
  { id: "kwame", label: "Kwame Mensah" },
  { id: "jonas", label: "Jonas Lindqvist" },
];

const MENTORING = [
  { source: "priya", target: "elena" },
  { source: "elena", target: "tomas" },
  { source: "elena", target: "mateusz" },
  { source: "tomas", target: "ayse" },
  { source: "tomas", target: "sofia" },
  { source: "priya", target: "mateusz" },
  { source: "mateusz", target: "kwame" },
  { source: "sofia", target: "jonas" },
];

export function Mentoring(): ReactElement {
  const { t } = useWords("network-graph");

  return (
    <NetworkGraph
      clearLabel={t("words.clear")}
      defaultFocus="elena"
      depth={2}
      edgeName={({ source, target }) => t("words.edge", { source, target })}
      focusLabel={t("words.focus")}
      label={t("mentoring.label")}
      links={MENTORING}
      neighborLabel={t("words.connected")}
      nodeDescription={t("words.description")}
      nodes={PEOPLE}
      promptLabel={t("mentoring.prompt")}
      summary={({ count, name }) => t("mentoring.summary", { count, name })}
    />
  );
}
