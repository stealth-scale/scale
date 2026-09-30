import { type ReactElement, useState } from "react";

import { ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon, XIcon } from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { Pagination } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { useServerPage } from "./server.ts";
import { type Transfer } from "./transfers.ts";

const column = DataTable.createColumnHelper<Transfer>();

const EURO = { currency: "EUR", style: "currency" } as const;

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

export function Server(): ReactElement {
  const { t } = useWords("data-table");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });
  const [sorting, setSorting] = useState<DataTable.SortingState>([]);
  const [search, setSearch] = useState("");
  const { loading, page } = useServerPage({ ...pagination, search, sort: sorting[0] });
  const table = DataTable.useDataTable({
    columns: column.columns([
      column.accessor("reference", {
        enableSorting: false,
        header: t("ledger.reference"),
        meta: { rowHeader: true },
      }),
      column.accessor((transfer) => t(transfer.account), {
        enableSorting: false,
        header: t("account"),
        id: "account",
      }),
      column.accessor("amount", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("amount"),
        meta: { numeric: true },
      }),
    ]),
    data: page.rows,
    getRowId: (row) => row.reference,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onGlobalFilterChange: (next: string) => {
      setSearch(next);
      setPagination((old) => ({ ...old, pageIndex: 0 }));
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: page.count,
    state: { globalFilter: search, pagination, sorting },
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Search
        aria-label={t("server.search")}
        clearIndicator={<XIcon size="1em" />}
        clearLabel={t("search.clear")}
        placeholder={t("server.search")}
        searchIndicator={<SearchIcon size="1em" />}
      />
      <DataTable.Table
        aria-busy={loading}
        caption={t("server.caption")}
        empty={loading ? t("server.loading") : t("server.empty")}
        sortIndicator={<ArrowUpIcon size="1em" />}
        variant="surface"
      />
      <DataTable.Pagination aria-label={t("ledger.pages")} size="sm">
        <Pagination.PrevTrigger label={t("ledger.previous")}>
          <ChevronLeftIcon />
        </Pagination.PrevTrigger>
        <Pagination.PageText
          format={({ page: current, totalPages }) =>
            t("ledger.summary", { page: current, totalPages })
          }
        />
        <Pagination.NextTrigger label={t("ledger.next")}>
          <ChevronRightIcon />
        </Pagination.NextTrigger>
      </DataTable.Pagination>
    </DataTable.Root>
  );
}
