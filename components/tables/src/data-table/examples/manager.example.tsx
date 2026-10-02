import { type ReactElement } from "react";

import { CheckIcon, Columns3Icon, GripVerticalIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Format } from "@stealthscale/component-data";
import { Popover } from "@stealthscale/component-disclosure";
import { Stack } from "@stealthscale/component-layout";
import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { RECENT, type Transfer } from "./transfers.ts";

const column = DataTable.createColumnHelper<Transfer>();

const EURO = { currency: "EUR", style: "currency" } as const;

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

export function Manager(): ReactElement {
  const { t } = useWords("data-table");
  const table = DataTable.useDataTable({
    columns: column.columns([
      column.accessor("reference", { header: t("ledger.reference"), meta: { rowHeader: true } }),
      column.accessor((transfer) => t(transfer.account), { header: t("account"), id: "account" }),
      column.accessor((transfer) => t(transfer.region), {
        header: t("spanned.region"),
        id: "region",
      }),
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
    data: RECENT,
    getRowId: (row) => row.reference,
    initialState: { columnVisibility: { region: false } },
  });

  return (
    <DataTable.Root table={table}>
      <Stack direction="row" justify="end">
        <Popover.Root positioning={{ placement: "bottom-end" }} size="sm">
          <ButtonPropsProvider value={{ size: "sm", variant: "outline" }}>
            <Popover.Trigger as={Button}>
              <Columns3Icon size="1em" />
              {t("manager.button")}
            </Popover.Trigger>
          </ButtonPropsProvider>
          <Portal>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Title>{t("manager.heading")}</Popover.Title>
                <DataTable.ColumnManager
                  checkIndicator={<CheckIcon />}
                  handleIndicator={<GripVerticalIcon size="1em" />}
                  handleLabel={(item) => t("manager.move", { item })}
                  label={t("manager.heading")}
                  resetLabel={t("manager.reset")}
                />
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      </Stack>
      <DataTable.Table caption={t("manager.caption")} variant="surface" />
    </DataTable.Root>
  );
}
