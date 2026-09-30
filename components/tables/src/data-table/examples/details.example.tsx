import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { DataList } from "@stealthscale/component-collections";
import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Payout, PAYOUTS } from "./payouts.ts";

const column = DataTable.createColumnHelper<Payout>();

const EURO = { currency: "EUR", style: "currency" } as const;

interface Words {
  readonly average: string;
  readonly transfers: string;
}

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

function detailOf(payout: Payout, words: Words): ReactElement {
  return (
    <DataList.Root orientation="horizontal">
      <DataList.Item>
        <DataList.ItemLabel>{words.transfers}</DataList.ItemLabel>
        <DataList.ItemValue>{payout.transfers}</DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>{words.average}</DataList.ItemLabel>
        <DataList.ItemValue>{amountOf(payout.amount / payout.transfers)}</DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}

export function Details(): ReactElement {
  const { t } = useWords("data-table");
  const words = { average: t("details.average"), transfers: t("transfers") };
  const table = DataTable.useDataTable({
    columns: column.columns([
      DataTable.expandColumn<Payout>({
        detail: (payout) => detailOf(payout, words),
        header: t("details.header"),
        indicator: <ChevronRightIcon size="1em" />,
        label: (payout) => t("details.one", { account: t(payout.account) }),
      }),
      column.accessor("account", {
        cell: (cell) => t(cell.getValue()),
        header: t("account"),
        meta: { rowHeader: true },
      }),
      column.accessor("amount", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("amount"),
        meta: { numeric: true },
      }),
    ]),
    data: PAYOUTS,
    getRowCanExpand: () => true,
    getRowId: (row) => row.account,
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table caption={t("details.caption")} variant="surface" />
    </DataTable.Root>
  );
}
