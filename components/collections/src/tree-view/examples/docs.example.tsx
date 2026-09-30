import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { TreeCollection } from "#collection/index.ts";
import * as TreeView from "#tree-view/index.ts";

interface Page {
  children?: Page[];
  id: string;
}

const PAGES = new TreeCollection<Page>({
  nodeToValue: (node): string => node.id,
  rootNode: {
    children: [
      { children: [{ id: "install" }, { id: "configure" }, { id: "themes" }], id: "start" },
      {
        children: [
          { children: [{ id: "button" }, { id: "toggle-group" }], id: "actions" },
          { children: [{ id: "listbox" }, { id: "tree-view" }], id: "collections" },
        ],
        id: "components",
      },
      { id: "changelog" },
    ],
    id: "root",
  },
});

export function Docs(): ReactElement {
  const { t } = useWords("tree-view");

  return (
    <TreeView.Root
      collection={PAGES}
      defaultExpandedValue={["components", "collections"]}
      defaultSelectedValue={["tree-view"]}
      size="sm"
    >
      <TreeView.Label>{t("docs.label")}</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Nodes
          indentGuide={<TreeView.BranchIndentGuide />}
          render={({ node, nodeState }: TreeView.NodeDetails<Page>) =>
            nodeState.isBranch ? (
              <TreeView.BranchControl>
                <TreeView.BranchIndicator>
                  <ChevronRightIcon />
                </TreeView.BranchIndicator>
                <TreeView.BranchText>{t(`docs.${node.id}`)}</TreeView.BranchText>
              </TreeView.BranchControl>
            ) : (
              <TreeView.Item href={`#docs-${node.id}`}>
                <TreeView.ItemText>{t(`docs.${node.id}`)}</TreeView.ItemText>
              </TreeView.Item>
            )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}
