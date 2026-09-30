import { type ReactElement } from "react";

import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Payout, PAYOUTS } from "./payouts.ts";

const column = DataTable.createColumnHelper<Payout>();

const EURO = { currency: "EUR", style: "currency" } as const;

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

export function Totals(): ReactElement {
  const { t } = useWords("data-table");
  const table = DataTable.useDataTable({
    columns: column.columns([
      column.accessor("account", {
        cell: (cell) => t(cell.getValue()),
        footer: t("totals.total"),
        header: t("account"),
        meta: { rowHeader: true },
      }),
      column.accessor("transfers", {
        aggregationFn: "sum",
        footer: (footer) => footer.column.getAggregationValue<number>(),
        header: t("transfers"),
        meta: { numeric: true },
      }),
      column.accessor("amount", {
        aggregationFn: "sum",
        cell: (cell) => amountOf(cell.getValue()),
        footer: (footer) => amountOf(footer.column.getAggregationValue<number>()),
        header: t("amount"),
        meta: { numeric: true },
      }),
    ]),
    data: PAYOUTS,
    getRowId: (row) => row.account,
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table caption={t("totals.caption")} variant="surface" />
    </DataTable.Root>
  );
}
