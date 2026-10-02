import { type ReactElement } from "react";

import { ArrowUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Pagination } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Transfer, TRANSFERS } from "./transfers.ts";

const column = DataTable.createColumnHelper<Transfer>();

const EURO = { currency: "EUR", style: "currency" } as const;

const SIZES = [10, 20, 50];

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

export function Pages(): ReactElement {
  const { t } = useWords("data-table");
  const table = DataTable.useDataTable({
    columns: column.columns([
      column.accessor("reference", { header: t("ledger.reference"), meta: { rowHeader: true } }),
      column.accessor((transfer) => t(transfer.account), { header: t("account"), id: "account" }),
      column.accessor((transfer) => t(`ledger.${transfer.state}`), {
        header: t("ledger.state"),
        id: "state",
      }),
      column.accessor("amount", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("amount"),
        meta: { numeric: true },
      }),
    ]),
    data: TRANSFERS,
    getRowId: (row) => row.reference,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table
        caption={t("ledger.caption")}
        sortIndicator={<ArrowUpIcon size="1em" />}
        variant="surface"
      />
      <Stack align="baseline" direction="row" gap="md" justify="between" wrap>
        <DataTable.PageSize
          indicator={<ChevronDownIcon />}
          label={t("ledger.perPage")}
          size="sm"
          sizes={SIZES}
        />
        <DataTable.Pagination aria-label={t("ledger.pages")} size="sm">
          <Pagination.PageText
            format={({ count, pageRange }) =>
              t("ledger.range", {
                count,
                end: pageRange.end,
                start: count === 0 ? 0 : pageRange.start + 1,
              })
            }
          />
          <Pagination.PrevTrigger label={t("ledger.previous")}>
            <ChevronLeftIcon />
          </Pagination.PrevTrigger>
          <Pagination.Items
            label={(page) => t("ledger.page", { page })}
            summary={({ page, totalPages }) => t("ledger.summary", { page, totalPages })}
          />
          <Pagination.NextTrigger label={t("ledger.next")}>
            <ChevronRightIcon />
          </Pagination.NextTrigger>
        </DataTable.Pagination>
      </Stack>
    </DataTable.Root>
  );
}
