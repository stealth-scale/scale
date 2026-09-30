import { type ReactElement } from "react";

import { ArrowUpIcon, CheckIcon, MinusIcon } from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Payout, PAYOUTS } from "./payouts.ts";

const column = DataTable.createColumnHelper<Payout>();

const EURO = { currency: "EUR", style: "currency" } as const;

const SHARE = { maximumFractionDigits: 1, style: "percent" } as const;

const TOTAL = PAYOUTS.reduce((sum, payout) => sum + payout.amount, 0);

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

function shareOf(value: number): ReactElement {
  return <Format.Number options={SHARE} value={value} />;
}

export function Columns(): ReactElement {
  const { t } = useWords("data-table");
  const table = DataTable.useDataTable({
    columns: column.columns([
      DataTable.selectColumn<Payout>({
        allLabel: t("selection.all"),
        indeterminateIndicator: <MinusIcon strokeWidth={3} />,
        indicator: <CheckIcon strokeWidth={3} />,
        label: (payout) => t("selection.one", { account: t(payout.account) }),
      }),
      column.accessor("account", {
        cell: (cell) => t(cell.getValue()),
        header: t("account"),
        meta: { rowHeader: true },
        size: 200,
      }),
      column.accessor("transfers", { header: t("transfers"), meta: { numeric: true }, size: 120 }),
      column.accessor((payout) => payout.amount / payout.transfers, {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("details.average"),
        id: "average",
        meta: { numeric: true },
        size: 180,
      }),
      column.accessor((payout) => payout.amount / TOTAL, {
        cell: (cell) => shareOf(cell.getValue()),
        header: t("columns.share"),
        id: "share",
        meta: { numeric: true },
        size: 110,
      }),
      column.accessor("amount", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("amount"),
        meta: { numeric: true },
        size: 140,
      }),
    ]),
    data: PAYOUTS,
    defaultColumn: { maxSize: 360, minSize: 80 },
    enableColumnResizing: true,
    getRowId: (row) => row.account,
    initialState: { columnPinning: { end: [], start: ["select", "account"] } },
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table
        caption={t("columns.caption")}
        resizeLabel={(name) => t("columns.resize", { column: name })}
        resizeValue={(size) => t("columns.size", { size })}
        sortIndicator={<ArrowUpIcon size="1em" />}
        variant="surface"
      />
    </DataTable.Root>
  );
}
