import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as JsonTreeView from "#json-tree-view/index.ts";

const PAYOUT = {
  amount: 324_000,
  arrival_date: "2026-09-26",
  currency: "gbp",
  destination: { bank_name: "Northwind Bank", country: "GB", last4: "6789" },
  id: "po_1093",
  livemode: false,
  metadata: { approved_by: null, batch: "2026-09-25-am" },
  status: "paid",
  transfers: [
    { amount: 162_000, id: "tr_311" },
    { amount: 162_000, id: "tr_312" },
  ],
};

export function Response(props: Partial<JsonTreeView.RootProps>): ReactElement {
  const { t } = useWords("json-tree-view");

  return (
    <JsonTreeView.Root data={PAYOUT} defaultExpandedDepth={2} {...props}>
      <JsonTreeView.Tree
        aria-label={t("response.label")}
        arrow={<ChevronRightIcon />}
        indentGuide
      />
    </JsonTreeView.Root>
  );
}
