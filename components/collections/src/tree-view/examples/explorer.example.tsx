import { type ReactElement } from "react";

import { ChevronRightIcon, FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { TreeCollection } from "#collection/index.ts";
import * as TreeView from "#tree-view/index.ts";

interface FileNode {
  children?: FileNode[];
  id: string;
  name: string;
}

const FILES = new TreeCollection<FileNode>({
  nodeToString: (node): string => node.name,
  nodeToValue: (node): string => node.id,
  rootNode: {
    children: [
      {
        children: [
          {
            children: [
              { id: "src/components/button.tsx", name: "button.tsx" },
              { id: "src/components/card.tsx", name: "card.tsx" },
            ],
            id: "src/components",
            name: "components",
          },
          { id: "src/index.ts", name: "index.ts" },
        ],
        id: "src",
        name: "src",
      },
      { id: "package.json", name: "package.json" },
      { id: "README.md", name: "README.md" },
    ],
    id: "root",
    name: "",
  },
});

export function Explorer(props: TreeView.RootProps): ReactElement {
  const { t } = useWords("tree-view");

  return (
    <TreeView.Root
      collection={FILES}
      defaultExpandedValue={["src", "src/components"]}
      defaultSelectedValue={["src/components/card.tsx"]}
      {...props}
    >
      <TreeView.Label>{t("explorer.label")}</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Nodes
          render={({ node, nodeState }: TreeView.NodeDetails<FileNode>) =>
            nodeState.isBranch ? (
              <TreeView.BranchControl>
                <TreeView.BranchIndicator>
                  <ChevronRightIcon />
                </TreeView.BranchIndicator>
                {nodeState.expanded ? <FolderOpenIcon /> : <FolderIcon />}
                <TreeView.BranchText>{node.name}</TreeView.BranchText>
              </TreeView.BranchControl>
            ) : (
              <TreeView.Item>
                <FileIcon />
                <TreeView.ItemText>{node.name}</TreeView.ItemText>
              </TreeView.Item>
            )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}
