import { type ReactElement, useState } from "react";

import { ChevronRightIcon, LockIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Group, Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { TreeCollection } from "#collection/index.ts";
import * as TreeView from "#tree-view/index.ts";

interface Section {
  children?: Section[];
  disabled?: boolean;
  id: string;
}

const OUTLINE = new TreeCollection<Section>({
  nodeToValue: (node): string => node.id,
  rootNode: {
    children: [
      { children: [{ id: "summary" }, { id: "goals" }], id: "introduction" },
      {
        children: [
          { id: "survey" },
          { children: [{ id: "latency" }, { id: "errors" }], id: "results" },
        ],
        id: "findings",
      },
      { children: [{ id: "raw-data" }], disabled: true, id: "appendix" },
    ],
    id: "root",
  },
});

export function Outline(): ReactElement {
  const { t } = useWords("tree-view");
  const [expanded, setExpanded] = useState(["introduction"]);

  return (
    <Stack gap="sm">
      <Group gap="xs">
        <Button
          onClick={() => {
            setExpanded(OUTLINE.getBranchValues());
          }}
          size="sm"
          variant="outline"
        >
          {t("outline.expand")}
        </Button>
        <Button
          onClick={() => {
            setExpanded([]);
          }}
          size="sm"
          variant="outline"
        >
          {t("outline.collapse")}
        </Button>
      </Group>
      <TreeView.Root
        collection={OUTLINE}
        expandedValue={expanded}
        expandOnClick={false}
        onExpandedChange={(details) => {
          setExpanded(details.expandedValue);
        }}
      >
        <TreeView.Label>{t("outline.label")}</TreeView.Label>
        <TreeView.Tree>
          <TreeView.Nodes
            render={({ node, nodeState }: TreeView.NodeDetails<Section>) =>
              nodeState.isBranch ? (
                <TreeView.BranchControl>
                  <TreeView.BranchTrigger>
                    <TreeView.BranchIndicator>
                      <ChevronRightIcon />
                    </TreeView.BranchIndicator>
                  </TreeView.BranchTrigger>
                  <TreeView.BranchText>{t(`outline.${node.id}`)}</TreeView.BranchText>
                  {nodeState.disabled ? <LockIcon /> : null}
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  <TreeView.ItemText>{t(`outline.${node.id}`)}</TreeView.ItemText>
                </TreeView.Item>
              )
            }
          />
        </TreeView.Tree>
      </TreeView.Root>
    </Stack>
  );
}
