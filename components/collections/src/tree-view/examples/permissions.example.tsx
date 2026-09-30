import { type ReactElement, useState } from "react";

import { CheckIcon, ChevronRightIcon, MinusIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { TreeCollection } from "#collection/index.ts";
import * as TreeView from "#tree-view/index.ts";

interface Permission {
  children?: Permission[];
  id: string;
}

const GROUPS = {
  billing: ["view-invoices", "download-invoices", "change-plan"],
  members: ["invite-members", "remove-members"],
  settings: ["rename-workspace", "delete-workspace"],
};

const LEAVES = Object.values(GROUPS).flat();

const PERMISSIONS = new TreeCollection<Permission>({
  nodeToValue: (node): string => node.id,
  rootNode: {
    children: Object.entries(GROUPS).map(([id, leaves]) => ({
      children: leaves.map((leaf) => ({ id: leaf })),
      id,
    })),
    id: "root",
  },
});

export function Permissions(): ReactElement {
  const { t } = useWords("tree-view");
  const [checked, setChecked] = useState(["view-invoices", "download-invoices"]);
  const granted = LEAVES.filter((leaf) => checked.includes(leaf)).length;

  return (
    <Stack gap="sm">
      <TreeView.Root
        checkable
        checkedValue={checked}
        collection={PERMISSIONS}
        defaultExpandedValue={["billing", "members"]}
        onCheckedChange={(details) => {
          setChecked(details.checkedValue);
        }}
      >
        <TreeView.Label>{t("permissions.label")}</TreeView.Label>
        <TreeView.Tree>
          <TreeView.Nodes
            render={({ node, nodeState }: TreeView.NodeDetails<Permission>) => {
              const box = (
                <TreeView.NodeCheckbox>
                  {nodeState.checked === "indeterminate" ? <MinusIcon /> : <CheckIcon />}
                </TreeView.NodeCheckbox>
              );

              return nodeState.isBranch ? (
                <TreeView.BranchControl>
                  <TreeView.BranchIndicator>
                    <ChevronRightIcon />
                  </TreeView.BranchIndicator>
                  {box}
                  <TreeView.BranchText>{t(`permissions.${node.id}`)}</TreeView.BranchText>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  {box}
                  <TreeView.ItemText>{t(`permissions.${node.id}`)}</TreeView.ItemText>
                </TreeView.Item>
              );
            }}
          />
        </TreeView.Tree>
      </TreeView.Root>
      <Text as="output" size="sm" tone="muted">
        {t("permissions.count", { count: granted, total: LEAVES.length })}
      </Text>
    </Stack>
  );
}
