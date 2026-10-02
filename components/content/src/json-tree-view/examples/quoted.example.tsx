import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as JsonTreeView from "#json-tree-view/index.ts";

const MANIFEST = {
  dependencies: { "@northwind/ledger": "^4.2.0", react: "^19.3.0" },
  name: "@northwind/payouts",
  private: true,
  scripts: { build: "vp pack", test: "vp test" },
  version: "2.4.0",
};

export function Quoted(): ReactElement {
  const { t } = useWords("json-tree-view");

  return (
    <JsonTreeView.Root data={MANIFEST} defaultExpandedDepth={2} quotesOnKeys>
      <JsonTreeView.Tree aria-label={t("quoted.label")} arrow={<ChevronRightIcon />} indentGuide />
    </JsonTreeView.Root>
  );
}
