import { type ReactElement } from "react";

import { ArrowUpIcon, PinIcon } from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Transfer, transfersOf } from "./transfers.ts";

const column = DataTable.createColumnHelper<Transfer>();

const EURO = { currency: "EUR", style: "currency" } as const;

const YEAR = transfersOf(10_000, 20_000);

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

export function Windowed(): ReactElement {
  const { t } = useWords("data-table");
  const table = DataTable.useDataTable({
    columns: column.columns([
      DataTable.pinColumn<Transfer>({
        header: t("pinned.header"),
        indicator: <PinIcon size="1em" />,
        label: (transfer) => t("windowed.pin", { reference: transfer.reference }),
      }),
      column.accessor("reference", {
        header: t("ledger.reference"),
        meta: { rowHeader: true },
        size: 150,
      }),
      column.accessor((transfer) => t(transfer.account), {
        header: t("account"),
        id: "account",
        size: 230,
      }),
      column.accessor((transfer) => t(`ledger.${transfer.state}`), {
        header: t("ledger.state"),
        id: "state",
        size: 140,
      }),
      column.accessor("amount", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("amount"),
        meta: { numeric: true },
        size: 176,
      }),
    ]),
    data: YEAR,
    getRowId: (row) => row.reference,
    initialState: { rowPinning: { bottom: [], top: ["TR-19996"] } },
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table
        caption={t("windowed.caption")}
        sortIndicator={<ArrowUpIcon size="1em" />}
        style={{ maxBlockSize: "24rem" }}
        variant="surface"
        windowed
      />
    </DataTable.Root>
  );
}
