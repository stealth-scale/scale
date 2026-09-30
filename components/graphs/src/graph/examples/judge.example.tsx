import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Graph from "#graph/index.ts";
import { layoutGraph } from "#layout/index.ts";

const EDGES = [
  { id: "draft-judge", source: "draft", target: "judge" },
  { id: "judge-publish", source: "judge", sourceHandle: "pass", target: "publish" },
  { id: "judge-revise", source: "judge", sourceHandle: "fail", target: "revise" },
];

export function Judge(): ReactElement {
  const { t } = useWords("graph");
  const nodes = layoutGraph(
    [
      {
        data: { label: t("judge.draft"), subtitle: t("judge.model") },
        id: "draft",
        position: { x: 0, y: 0 },
      },
      {
        data: {
          invalid: true,
          label: t("judge.judge"),
          outputs: [
            { id: "pass", label: t("judge.pass") },
            { id: "fail", label: t("judge.fail") },
          ],
          problem: t("judge.problem"),
          subtitle: t("judge.rubric"),
        },
        id: "judge",
        position: { x: 0, y: 0 },
      },
      {
        data: { label: t("judge.publish") },
        id: "publish",
        position: { x: 0, y: 0 },
        type: "output",
      },
      {
        data: { label: t("judge.revise") },
        id: "revise",
        position: { x: 0, y: 0 },
        type: "output",
      },
    ],
    EDGES,
    { ranksep: 96 },
  );

  return (
    <Graph.Root>
      <Graph.Canvas edges={EDGES} label={t("judge.label")} nodes={nodes} readOnly />
      <Graph.Caption>{t("judge.caption")}</Graph.Caption>
    </Graph.Root>
  );
}
