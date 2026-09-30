import { type ReactElement } from "react";

import { CheckIcon, MinusIcon } from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Payout, PAYOUTS } from "./payouts.ts";

const column = DataTable.createColumnHelper<Payout>();

const EURO = { currency: "EUR", style: "currency" } as const;

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

export function Selection(): ReactElement {
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
      }),
      column.accessor("amount", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("amount"),
        meta: { numeric: true },
      }),
    ]),
    data: PAYOUTS,
    getRowId: (row) => row.account,
  });
  const count = Object.keys(table.state.rowSelection).length;

  return (
    <DataTable.Root table={table}>
      <Text as="output">{t("selection.count", { count })}</Text>
      <DataTable.Table caption={t("selection.caption")} variant="surface" />
    </DataTable.Root>
  );
}
