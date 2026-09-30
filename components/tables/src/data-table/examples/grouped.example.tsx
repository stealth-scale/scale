import { type ReactElement } from "react";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  GroupIcon,
  UngroupIcon,
  XIcon,
} from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Transfer, TRANSFERS } from "./transfers.ts";

const column = DataTable.createColumnHelper<Transfer>();

const EURO = { currency: "EUR", style: "currency" } as const;

const GLYPHS: DataTable.ColumnMenuIndicators = {
  ascending: <ArrowUpIcon />,
  descending: <ArrowDownIcon />,
  grouped: <GroupIcon />,
  ungrouped: <UngroupIcon />,
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

export function Grouped(): ReactElement {
  const { t } = useWords("data-table");
  const words: MenuWords = {
    ascendingLabel: t("menus.ascending"),
    descendingLabel: t("menus.descending"),
    groupedLabel: t("grouped.group"),
    label: (name) => t("menus.options", { column: name }),
    ungroupedLabel: t("grouped.ungroup"),
    unsortedLabel: t("menus.unsorted"),
  };
  const table = DataTable.useDataTable({
    columns: column.columns([
      column.accessor("reference", { header: t("ledger.reference"), meta: { rowHeader: true } }),
      column.accessor((transfer) => t(transfer.account), { header: t("account"), id: "account" }),
      column.accessor("state", {
        cell: (cell) => t(`ledger.${cell.getValue()}`),
        header: t("ledger.state"),
      }),
      column.accessor("amount", {
        aggregatedCell: (cell) => amountOf(cell.getValue()),
        aggregationFn: "sum",
        cell: (cell) => amountOf(cell.getValue()),
        header: t("amount"),
        meta: { numeric: true },
      }),
    ]),
    data: TRANSFERS,
    enableColumnPinning: false,
    enableGrouping: true,
    enableHiding: false,
    getRowId: (row) => row.reference,
    initialState: { expanded: { "state:pending": true }, grouping: ["state"] },
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table
        caption={t("grouped.caption")}
        collapseLabel={t("tree.collapse")}
        columnActions={(each) => menuOf(each, words)}
        expandIndicator={<ChevronRightIcon size="1em" />}
        expandLabel={t("tree.expand")}
        sortIndicator={<ArrowUpIcon size="1em" />}
        variant="surface"
      />
    </DataTable.Root>
  );
}
