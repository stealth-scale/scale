import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as JsonTreeView from "#json-tree-view/index.ts";

const LINE = {
  err: {
    message: "The payout was held",
    stack: [
      "PayoutError: The payout was held",
      "    at hold (payouts.ts:12:9)",
      "    at settle (payouts.ts:40:3)",
    ].join("\n"),
    type: "PayoutError",
  },
  level: 50,
  msg: "payout held",
  payout: "po_1093",
  time: "2026-09-25T12:06:02.000Z",
};

export function Log(): ReactElement {
  const { t } = useWords("json-tree-view");

  return (
    <JsonTreeView.Root data={LINE} defaultExpandedDepth={2}>
      <JsonTreeView.Tree aria-label={t("log.label")} arrow={<ChevronRightIcon />} indentGuide />
    </JsonTreeView.Root>
  );
}
