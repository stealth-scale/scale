import { type ReactElement, useState } from "react";

import { ChevronRightIcon, FileTextIcon, FolderIcon, SearchIcon, XIcon } from "lucide-react";

import { SearchInput } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { TreeCollection } from "#collection/index.ts";
import * as TreeView from "#tree-view/index.ts";

interface Doc {
  children?: Doc[];
  id: string;
  name: string;
}

const DOCS = new TreeCollection<Doc>({
  nodeToString: (node): string => node.name,
  nodeToValue: (node): string => node.id,
  rootNode: {
    children: [
      {
        children: [
          { id: "q3-plan", name: "Q3 plan.md" },
          { id: "q3-review", name: "Q3 review.md" },
          { id: "hiring", name: "Hiring plan.md" },
        ],
        id: "planning",
        name: "Planning",
      },
      {
        children: [
          { id: "invoice-2031", name: "Invoice 2031.pdf" },
          { id: "invoice-2032", name: "Invoice 2032.pdf" },
        ],
        id: "finance",
        name: "Finance",
      },
      { id: "handbook", name: "Handbook.md" },
    ],
    id: "root",
    name: "",
  },
});

export function Search(): ReactElement {
  const { t } = useWords("tree-view");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const typed = query.trim().toLowerCase();
  const shown =
    typed === "" ? DOCS : DOCS.filter((node) => node.name.toLowerCase().includes(typed));
  const empty = shown.getNodeChildren(shown.rootNode).length === 0;

  return (
    <Stack gap="sm">
      <SearchInput
        aria-label={t("search.field")}
        clearIndicator={<XIcon />}
        clearLabel={t("search.clear")}
        onValueChange={setQuery}
        placeholder={t("search.field")}
        searchIndicator={<SearchIcon />}
        value={query}
      />
      <TreeView.Root
        collection={shown}
        expandedValue={typed === "" ? expanded : shown.getBranchValues()}
        onExpandedChange={(details) => {
          if (typed === "") setExpanded(details.expandedValue);
        }}
      >
        <TreeView.Tree aria-label={t("search.label")}>
          <TreeView.Nodes
            render={({ node, nodeState }: TreeView.NodeDetails<Doc>) =>
              nodeState.isBranch ? (
                <TreeView.BranchControl>
                  <TreeView.BranchIndicator>
                    <ChevronRightIcon />
                  </TreeView.BranchIndicator>
                  <FolderIcon />
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  <FileTextIcon />
                  <TreeView.ItemText>{node.name}</TreeView.ItemText>
                </TreeView.Item>
              )
            }
          />
        </TreeView.Tree>
      </TreeView.Root>
      {empty ? (
        <Text size="sm" tone="muted">
          {t("search.empty", { query })}
        </Text>
      ) : null}
    </Stack>
  );
}
