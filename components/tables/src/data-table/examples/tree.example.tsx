import { type ReactElement } from "react";

import { ArrowUpIcon, ChevronRightIcon } from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Budget, BUDGETS } from "./budgets.ts";

const column = DataTable.createColumnHelper<Budget>();

const EURO = { currency: "EUR", maximumFractionDigits: 0, style: "currency" } as const;

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

export function Tree(): ReactElement {
  const { t } = useWords("data-table");
  const table = DataTable.useDataTable({
    columns: column.columns([
      column.accessor((budget) => t(`tree.${budget.centre}`), {
        header: t("tree.centre"),
        id: "centre",
        meta: { rowHeader: true },
      }),
      column.accessor("budget", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("tree.budget"),
        meta: { numeric: true },
      }),
      column.accessor("spent", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("tree.spent"),
        meta: { numeric: true },
      }),
    ]),
    data: BUDGETS,
    getRowId: (budget) => budget.centre,
    getSubRows: (budget) => budget.teams,
    initialState: { expanded: { engineering: true } },
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table
        caption={t("tree.caption")}
        collapseLabel={t("tree.collapse")}
        expandIndicator={<ChevronRightIcon size="1em" />}
        expandLabel={t("tree.expand")}
        sortIndicator={<ArrowUpIcon size="1em" />}
        variant="surface"
      />
    </DataTable.Root>
  );
}
