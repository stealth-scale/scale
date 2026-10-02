import { type ReactElement } from "react";

import { ArrowUpIcon, SearchIcon, XIcon } from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Payout, PAYOUTS } from "./payouts.ts";

const column = DataTable.createColumnHelper<Payout>();

const EURO = { currency: "EUR", style: "currency" } as const;

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

export function Searching(): ReactElement {
  const { t } = useWords("data-table");
  const table = DataTable.useDataTable({
    columns: column.columns([
      column.accessor((payout) => t(payout.account), {
        header: t("account"),
        id: "account",
        meta: { rowHeader: true },
      }),
      column.accessor((payout) => t(payout.region), { header: t("spanned.region"), id: "region" }),
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
      <DataTable.Search
        aria-label={t("search.label")}
        clearIndicator={<XIcon size="1em" />}
        clearLabel={t("search.clear")}
        placeholder={t("search.label")}
        searchIndicator={<SearchIcon size="1em" />}
      />
      <DataTable.Table
        caption={t("search.caption")}
        empty={t("search.empty")}
        filteredAnnouncement={(count, total) => t("search.found", { count, total })}
        sortIndicator={<ArrowUpIcon size="1em" />}
        variant="surface"
      />
    </DataTable.Root>
  );
}
