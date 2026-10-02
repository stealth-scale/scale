import { type ReactElement, useState } from "react";

import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Kbd, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { TreeCollection } from "#collection/index.ts";
import * as TreeView from "#tree-view/index.ts";

interface Entry {
  children?: Entry[];
  id: string;
  name: string;
}

const DRAFTS = new TreeCollection<Entry>({
  nodeToString: (node): string => node.name,
  nodeToValue: (node): string => node.id,
  rootNode: {
    children: [
      {
        children: [
          { id: "brief", name: "Brief.md" },
          { id: "moodboard", name: "Moodboard.png" },
        ],
        id: "launch",
        name: "Launch",
      },
      { id: "notes", name: "Notes.md" },
    ],
    id: "root",
    name: "",
  },
});

export function Rename(): ReactElement {
  const { t } = useWords("tree-view");
  const [collection, setCollection] = useState(DRAFTS);

  return (
    <Stack gap="sm">
      <TreeView.Root
        canRename={() => true}
        collection={collection}
        defaultExpandedValue={["launch"]}
        onRenameComplete={({ indexPath, label }) => {
          const node = collection.at(indexPath);

          if (node !== undefined)
            setCollection(collection.replace(indexPath, { ...node, name: label }));
        }}
      >
        <TreeView.Label>{t("rename.label")}</TreeView.Label>
        <TreeView.Tree>
          <TreeView.Nodes
            render={({ node, nodeState }: TreeView.NodeDetails<Entry>) =>
              nodeState.isBranch ? (
                <TreeView.BranchControl>
                  <TreeView.BranchIndicator>
                    <ChevronRightIcon />
                  </TreeView.BranchIndicator>
                  <FolderIcon />
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                  <TreeView.NodeRenameInput label={t("rename.input")} />
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  <FileIcon />
                  <TreeView.ItemText>{node.name}</TreeView.ItemText>
                  <TreeView.NodeRenameInput label={t("rename.input")} />
                </TreeView.Item>
              )
            }
          />
        </TreeView.Tree>
      </TreeView.Root>
      <Text size="sm" tone="muted">
        {t("rename.hint")} <Kbd.Root>F2</Kbd.Root>
      </Text>
    </Stack>
  );
}
