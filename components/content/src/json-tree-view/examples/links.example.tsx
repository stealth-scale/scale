import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as JsonTreeView from "#json-tree-view/index.ts";

const CHARGE = {
  amount: 4200,
  currency: "gbp",
  customer: "cus_4Q2x",
  id: "ch_91kR",
  invoice: "in_77aP",
  payment_intent: "pi_3LbW",
  status: "succeeded",
};

const PAGES: Readonly<Record<string, string>> = {
  cus_: "customers",
  in_: "invoices",
  pi_: "payment-intents",
};

function hrefOf(node: JsonTreeView.JsonNode): string | undefined {
  const value: unknown = node.value;

  if (typeof value !== "string") return undefined;

  const prefix = Object.keys(PAGES).find((each) => value.startsWith(each));

  return prefix === undefined ? undefined : `#${String(PAGES[prefix])}/${value}`;
}

export function Links(): ReactElement {
  const { t } = useWords("json-tree-view");

  return (
    <JsonTreeView.Root data={CHARGE}>
      <JsonTreeView.Tree
        aria-label={t("links.label")}
        arrow={<ChevronRightIcon />}
        getHref={hrefOf}
        indentGuide
      />
    </JsonTreeView.Root>
  );
}
