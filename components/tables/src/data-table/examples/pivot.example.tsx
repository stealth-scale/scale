import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { SALES } from "./sales.ts";

const EURO = { currency: "EUR", maximumFractionDigits: 0, style: "currency" } as const;

export function Pivot(): ReactElement {
  const { t } = useWords("data-table");
  const table = DataTable.useDataTable(
    DataTable.pivot(
      SALES.map((sale) => ({
        product: t(`pivot.${sale.product}`),
        quarter: t(`pivot.${sale.quarter}`),
        region: t(`pivot.${sale.region}`),
        value: sale.value,
      })),
      {
        column: "quarter",
        format: EURO,
        headers: { product: t("pivot.product"), region: t("pivot.region") },
        missingLabel: t("pivot.missing"),
        rows: ["region", "product"],
        totalLabel: t("pivot.total"),
        value: "value",
      },
    ),
  );

  return (
    <DataTable.Root table={table}>
      <DataTable.Table align="start" caption={t("pivot.caption")} variant="surface" />
    </DataTable.Root>
  );
}
