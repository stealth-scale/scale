import { type ReactElement, useState } from "react";

import { ArrowUpIcon } from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { DELAY } from "./server.ts";
import { type Transfer, transfersOf } from "./transfers.ts";

const column = DataTable.createColumnHelper<Transfer>();

const EURO = { currency: "EUR", style: "currency" } as const;

const BATCH = 50;

const ARCHIVE = transfersOf(1000, 11_000);

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

export function Endless(): ReactElement {
  const { t } = useWords("data-table");
  const [rows, setRows] = useState(() => ARCHIVE.slice(0, BATCH));
  const [loading, setLoading] = useState(false);
  const table = DataTable.useDataTable({
    columns: column.columns([
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
      column.accessor("amount", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("amount"),
        meta: { numeric: true },
        size: 176,
      }),
    ]),
    data: rows,
    getRowId: (row) => row.reference,
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table
        aria-busy={loading}
        caption={t("endless.caption")}
        onEndReached={() => {
          if (rows.length === ARCHIVE.length) return;

          setLoading(true);
          setTimeout(() => {
            setRows(ARCHIVE.slice(0, rows.length + BATCH));
            setLoading(false);
          }, DELAY);
        }}
        sortIndicator={<ArrowUpIcon size="1em" />}
        style={{ maxBlockSize: "24rem" }}
        variant="surface"
        windowed
      />
      <Text as="output">
        {loading
          ? t("endless.loading")
          : t("endless.loaded", { count: rows.length, total: ARCHIVE.length })}
      </Text>
    </DataTable.Root>
  );
}
