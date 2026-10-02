import { type ReactElement } from "react";

import { type Edge, type Node } from "@xyflow/react";

import { DataList } from "@stealthscale/component-collections";
import { Badge } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { diffGraphs, type GraphChange } from "#diff/index.ts";

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

const LOOKS = {
  added: { mark: "+", palette: "success" },
  changed: { mark: "~", palette: "warning" },
  removed: { mark: "−", palette: "error" },
  unchanged: { mark: "", palette: "neutral" },
} as const;

function edgesOf(links: typeof AFTER.links | typeof BEFORE.links): Edge[] {
  return links.map(([source, target]) => ({ id: `${source}-${target}`, source, target }));
}

function changed({ change }: GraphChange): boolean {
  return change !== "unchanged";
}

export function Changes(): ReactElement {
  const { t } = useWords("graph");
  const nodesOf = (steps: typeof AFTER.steps | typeof BEFORE.steps): Node[] =>
    steps.map(([id, detail]) => ({
      data: { label: t(`versions.steps.${id}`), subtitle: t(`versions.details.${detail}`) },
      id,
      position: ORIGIN,
    }));
  const diff = diffGraphs(
    { edges: edgesOf(BEFORE.links), nodes: nodesOf(BEFORE.steps) },
    { edges: edgesOf(AFTER.links), nodes: nodesOf(AFTER.steps) },
  );
  const fields: Record<string, string> = { subtitle: t("versions.list.subtitle") };
  const groups = [
    { entries: diff.nodes.filter(changed), title: t("versions.list.steps") },
    { entries: diff.edges.filter(changed), title: t("versions.list.links") },
  ];
  const count = groups.reduce((sum, { entries }) => sum + entries.length, 0);

  return (
    <Stack gap="md">
      <Text as="output">{t("versions.list.summary", { count })}</Text>
      {groups.map(({ entries, title }) => (
        <Stack gap="sm" key={title}>
          <Heading as="h3" size="sm">
            {title}
          </Heading>
          <DataList.Root orientation="horizontal">
            {entries.map((entry) => (
              <DataList.Item key={entry.id}>
                <DataList.ItemLabel>
                  <Badge palette={LOOKS[entry.change].palette} size="sm" variant="surface">
                    {`${LOOKS[entry.change].mark} ${t(`versions.${entry.change}`)}`}
                  </Badge>
                </DataList.ItemLabel>
                <DataList.ItemValue>
                  {entry.fields.length === 0
                    ? entry.label
                    : t("versions.list.fields", {
                        fields: entry.fields.map((field) => fields[field] ?? field).join(", "),
                        label: entry.label,
                      })}
                </DataList.ItemValue>
              </DataList.Item>
            ))}
          </DataList.Root>
        </Stack>
      ))}
    </Stack>
  );
}
