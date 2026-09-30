import { type ReactElement, useState } from "react";

import { ChevronRightIcon, LoaderCircleIcon } from "lucide-react";

import { Icon } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { TreeCollection } from "#collection/index.ts";
import * as TreeView from "#tree-view/index.ts";

interface Place {
  children?: Place[];
  childrenCount?: number;
  id: string;
}

const OFFICES: Readonly<Record<string, readonly string[]>> = {
  americas: ["new-york", "sao-paulo"],
  asia: ["singapore", "tokyo"],
  europe: ["amsterdam", "berlin", "lisbon"],
};

const REGIONS = new TreeCollection<Place>({
  nodeToValue: (node): string => node.id,
  rootNode: {
    children: Object.entries(OFFICES).map(([id, cities]) => ({ childrenCount: cities.length, id })),
    id: "root",
  },
});

function load({
  signal,
  valuePath,
}: {
  signal: AbortSignal;
  valuePath: string[];
}): Promise<Place[]> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve((OFFICES[valuePath.at(-1) ?? ""] ?? []).map((id) => ({ id })));
    }, 800);

    signal.addEventListener("abort", () => {
      clearTimeout(timer);
    });
  });
}

export function Lazy(): ReactElement {
  const { t } = useWords("tree-view");
  const [collection, setCollection] = useState(REGIONS);

  return (
    <TreeView.Root
      collection={collection}
      loadChildren={load}
      onLoadChildrenComplete={(details: { collection: TreeCollection<Place> }) => {
        setCollection(details.collection);
      }}
    >
      <TreeView.Label>{t("lazy.label")}</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Nodes
          render={({ node, nodeState }: TreeView.NodeDetails<Place>) =>
            nodeState.isBranch ? (
              <TreeView.BranchControl>
                <TreeView.BranchIndicator>
                  {nodeState.loading ? (
                    <Icon as={LoaderCircleIcon} motion="spin" />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </TreeView.BranchIndicator>
                <TreeView.BranchText>{t(`lazy.${node.id}`)}</TreeView.BranchText>
              </TreeView.BranchControl>
            ) : (
              <TreeView.Item>
                <TreeView.ItemText>{t(`lazy.${node.id}`)}</TreeView.ItemText>
              </TreeView.Item>
            )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}
