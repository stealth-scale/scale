import { type ReactElement, useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Field, NativeSelect } from "@stealthscale/component-forms";
import { Grid } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { SALES } from "./sales.ts";

const AGGREGATES = ["sum", "average", "min", "max", "count"] as const;

const EURO = { currency: "EUR", maximumFractionDigits: 0, style: "currency" } as const;

export function Aggregates(): ReactElement {
  const { t } = useWords("data-table");
  const [aggregate, setAggregate] = useState<DataTable.PivotAggregate>("average");
  const table = DataTable.useDataTable(
    DataTable.pivot(
      SALES.map((sale) => ({
        quarter: t(`pivot.${sale.quarter}`),
        region: t(`pivot.${sale.region}`),
        value: sale.value,
      })),
      {
        aggregate,
        column: "quarter",
        format: aggregate === "count" ? undefined : EURO,
        headers: { region: t("pivot.region") },
        missingLabel: t("pivot.missing"),
        rows: ["region"],
        totalLabel: t("pivot.total"),
        value: "value",
      },
    ),
  );

  return (
    <DataTable.Root table={table}>
      <Grid.Root columns="fill-xs">
        <Field.Root orientation="horizontal" size="sm">
          <Field.Label>{t("aggregates.label")}</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              onChange={(event) => {
                const { value } = event.currentTarget;

                setAggregate(AGGREGATES.find((each) => each === value) ?? aggregate);
              }}
              value={aggregate}
            >
              {AGGREGATES.map((each) => (
                <option key={each} value={each}>
                  {t(`aggregates.${each}`)}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator>
              <ChevronDownIcon />
            </NativeSelect.Indicator>
          </NativeSelect.Root>
        </Field.Root>
      </Grid.Root>
      <DataTable.Table caption={t("aggregates.caption")} variant="surface" />
    </DataTable.Root>
  );
}
