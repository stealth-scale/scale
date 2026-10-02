import { type ReactElement } from "react";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  EllipsisVerticalIcon,
  EyeOffIcon,
  PinIcon,
  PinOffIcon,
  XIcon,
} from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { RECENT, type Transfer } from "./transfers.ts";

const column = DataTable.createColumnHelper<Transfer>();

const EURO = { currency: "EUR", style: "currency" } as const;

const GLYPHS: DataTable.ColumnMenuIndicators = {
  ascending: <ArrowUpIcon />,
  descending: <ArrowDownIcon />,
  end: <PinIcon />,
  hide: <EyeOffIcon />,
  start: <PinIcon />,
  unpinned: <PinOffIcon />,
  unsorted: <XIcon />,
};

type MenuWords = Omit<DataTable.ColumnMenuProps, "actionIndicators" | "column" | "indicator">;

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

function menuOf(each: DataTable.TableColumn, words: MenuWords): ReactElement {
  return (
    <DataTable.ColumnMenu
      {...words}
      actionIndicators={GLYPHS}
      column={each}
      indicator={<EllipsisVerticalIcon size="1em" />}
    />
  );
}

export function Menus(): ReactElement {
  const { t } = useWords("data-table");
  const words: MenuWords = {
    ascendingLabel: t("menus.ascending"),
    descendingLabel: t("menus.descending"),
    endLabel: t("menus.end"),
    hideLabel: t("menus.hide"),
    label: (name) => t("menus.options", { column: name }),
    startLabel: t("menus.start"),
    unpinnedLabel: t("menus.unpinned"),
    unsortedLabel: t("menus.unsorted"),
  };
  const table = DataTable.useDataTable({
    columns: column.columns([
      column.accessor("reference", { header: t("ledger.reference"), meta: { rowHeader: true } }),
      column.accessor((transfer) => t(transfer.account), { header: t("account"), id: "account" }),
      column.accessor((transfer) => t(transfer.region), {
        header: t("spanned.region"),
        id: "region",
      }),
      column.accessor("amount", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("amount"),
        meta: { numeric: true },
      }),
    ]),
    data: RECENT,
    defaultColumn: { minSize: 140, size: 180 },
    getRowId: (row) => row.reference,
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table
        caption={t("menus.caption")}
        columnActions={(each) => menuOf(each, words)}
        sortIndicator={<ArrowUpIcon size="1em" />}
        variant="surface"
      />
    </DataTable.Root>
  );
}
