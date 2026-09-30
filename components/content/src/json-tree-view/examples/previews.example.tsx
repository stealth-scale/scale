import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as JsonTreeView from "#json-tree-view/index.ts";

const EVENTS = Array.from({ length: 120 }, (_, index) => ({
  id: `evt_${String(index + 1).padStart(4, "0")}`,
  type: index % 3 === 0 ? "payout.paid" : "charge.succeeded",
}));

const FEED = { data: EVENTS, has_more: true, url: "/v1/events" };

export function Previews(): ReactElement {
  const { t } = useWords("json-tree-view");

  return (
    <JsonTreeView.Root
      data={FEED}
      defaultExpandedDepth={2}
      groupArraysAfterLength={50}
      maxPreviewItems={2}
    >
      <JsonTreeView.Tree
        aria-label={t("previews.label")}
        arrow={<ChevronRightIcon />}
        indentGuide
      />
    </JsonTreeView.Root>
  );
}
