import { type ReactElement } from "react";

import { CheckIcon, ListFilterIcon } from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { RECENT, type Transfer } from "./transfers.ts";

const column = DataTable.createColumnHelper<Transfer>();

const EURO = { currency: "EUR", style: "currency" } as const;

interface FilterWords {
  readonly clearLabel: string;
  readonly label: (column: string, active: boolean) => string;
  readonly maxLabel: string;
  readonly minLabel: string;
}

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

function filterOf(each: DataTable.TableColumn, words: FilterWords): ReactElement {
  return (
    <DataTable.ColumnFilter
      {...words}
      checkIndicator={<CheckIcon />}
      column={each}
      indicator={<ListFilterIcon size="1em" />}
    />
  );
}

export function Filters(): ReactElement {
  const { t } = useWords("data-table");
  const words: FilterWords = {
    clearLabel: t("filters.clear"),
    label: (name, active) => t(active ? "filters.active" : "filters.filter", { column: name }),
    maxLabel: t("filters.max"),
    minLabel: t("filters.min"),
  };
  const table = DataTable.useDataTable({
    columns: column.columns([
      column.accessor("reference", {
        header: t("ledger.reference"),
        meta: { filter: "text", rowHeader: true },
      }),
      column.accessor((transfer) => t(transfer.account), {
        filterFn: "arrHas",
        header: t("account"),
        id: "account",
        meta: { filter: "select" },
      }),
      column.accessor((transfer) => t(`ledger.${transfer.state}`), {
        filterFn: "arrHas",
        header: t("ledger.state"),
        id: "state",
        meta: { filter: "select" },
      }),
      column.accessor("amount", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("amount"),
        meta: { filter: "range", numeric: true },
      }),
    ]),
    data: RECENT,
    getRowId: (row) => row.reference,
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table
        caption={t("filters.caption")}
        columnActions={(each) => filterOf(each, words)}
        empty={t("filters.empty")}
        filteredAnnouncement={(count, total) => t("filters.found", { count, total })}
        variant="surface"
      />
    </DataTable.Root>
  );
}
