import { type ReactElement } from "react";

import { ArrowUpIcon, PinIcon } from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Payout, PAYOUTS } from "./payouts.ts";

const column = DataTable.createColumnHelper<Payout>();

const EURO = { currency: "EUR", style: "currency" } as const;

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

export function Pinned(): ReactElement {
  const { t } = useWords("data-table");
  const table = DataTable.useDataTable({
    columns: column.columns([
      DataTable.pinColumn<Payout>({
        header: t("pinned.header"),
        indicator: <PinIcon size="1em" />,
        label: (payout) => t("pinned.one", { account: t(payout.account) }),
      }),
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
    initialState: { rowPinning: { bottom: [], top: ["perrin"] } },
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table
        caption={t("pinned.caption")}
        sortIndicator={<ArrowUpIcon size="1em" />}
        variant="surface"
      />
    </DataTable.Root>
  );
}
