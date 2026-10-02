import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as JsonTreeView from "#json-tree-view/index.ts";

class Money {
  readonly amount: number;
  readonly currency: string;

  constructor(amount: number, currency: string) {
    this.amount = amount;
    this.currency = currency;
  }
}

function settle(payout: string): string {
  return `settled ${payout}`;
}

const HELD = Object.assign(new Error("The payout was held"), {
  stack: "Error: The payout was held\n    at settle (payouts.ts:40:3)",
});

const VALUES = {
  bigint: 9_007_199_254_740_993n,
  boolean: true,
  date: new Date("2026-09-25T14:22:00Z"),
  error: HELD,
  function: settle,
  map: new Map([
    ["density", "compact"],
    ["theme", "dark"],
  ]),
  money: new Money(1234.56, "GBP"),
  null: null,
  number: 1234.56,
  regex: /^po_\d+$/u,
  set: new Set(["eur", "gbp"]),
  string: "Northwind Ltd",
  symbol: Symbol("payout"),
  typed: new Uint8Array([4, 8, 15, 16]),
  undefined,
  url: new URL("https://northwind.example/payouts?status=paid"),
};

export function Types(): ReactElement {
  const { t } = useWords("json-tree-view");

  return (
    <JsonTreeView.Root data={VALUES} showNonenumerable={false}>
      <JsonTreeView.Tree aria-label={t("types.label")} arrow={<ChevronRightIcon />} indentGuide />
    </JsonTreeView.Root>
  );
}
