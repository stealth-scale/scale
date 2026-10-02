import { type ReactElement } from "react";

import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Forecast, FORECASTS } from "./forecast.ts";

const column = DataTable.createColumnHelper<Forecast>();

const EURO = { currency: "EUR", maximumFractionDigits: 0, style: "currency" } as const;

const QUARTERS = ["q1", "q2", "q3", "q4"] as const;

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

export function Grid(): ReactElement {
  const { t } = useWords("data-table");
  const table = DataTable.useDataTable({
    columns: column.columns([
      column.accessor((row) => t(`grid.${row.department}`), {
        header: t("grid.department"),
        id: "department",
        meta: { rowHeader: true },
      }),
      ...QUARTERS.map((quarter) =>
        column.accessor(quarter, {
          cell: (cell) => amountOf(cell.getValue()),
          header: t(`grid.${quarter}`),
          meta: { numeric: true },
        }),
      ),
    ]),
    data: FORECASTS,
    getRowId: (row) => row.department,
    initialState: {
      cellSelection: [
        { anchorColumnId: "q2", anchorRowId: "sales", focusColumnId: "q3", focusRowId: "design" },
      ],
    },
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table caption={t("grid.caption")} grid variant="surface" />
    </DataTable.Root>
  );
}
