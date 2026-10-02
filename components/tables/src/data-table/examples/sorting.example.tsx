import { type ReactElement } from "react";

import { ArrowUpIcon } from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Payout, PAYOUTS } from "./payouts.ts";

const column = DataTable.createColumnHelper<Payout>();

const EURO = { currency: "EUR", style: "currency" } as const;

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

export function Sorting(): ReactElement {
  const { t } = useWords("data-table");
  const table = DataTable.useDataTable({
    columns: column.columns([
      column.accessor("account", {
        cell: (cell) => t(cell.getValue()),
        header: t("account"),
        meta: { rowHeader: true },
      }),
      column.accessor("transfers", { header: t("transfers"), meta: { numeric: true } }),
      column.accessor("amount", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("amount"),
        meta: { numeric: true },
      }),
    ]),
    data: PAYOUTS,
    getRowId: (row) => row.account,
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table
        caption={t("sorting.caption")}
        sortIndicator={<ArrowUpIcon size="1em" />}
        variant="surface"
      />
    </DataTable.Root>
  );
}
