import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { Format } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { type Item, useDrive } from "./drive.ts";

const column = DataTable.createColumnHelper<Item>();

function sizeOf(value: number): ReactElement {
  return <Format.Byte value={value} />;
}

export function Lazy(): ReactElement {
  const { t } = useWords("data-table");
  const { expanded, items, onExpandedChange } = useDrive();
  const table = DataTable.useDataTable({
    autoResetExpanded: false,
    columns: column.columns([
      column.accessor((item) => t(`lazy.${item.name}`), {
        header: t("lazy.name"),
        id: "name",
        meta: { rowHeader: true },
      }),
      column.accessor("size", {
        cell: (cell) => sizeOf(cell.getValue()),
        header: t("lazy.size"),
        meta: { numeric: true },
      }),
    ]),
    data: items,
    getRowCanExpand: (row) => row.original.kind === "folder",
    getRowId: (item) => item.path,
    getSubRows: (item) => item.items,
    onExpandedChange,
    state: { expanded },
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table
        caption={t("lazy.caption")}
        collapseLabel={t("tree.collapse")}
        expandIndicator={<ChevronRightIcon size="1em" />}
        expandLabel={t("tree.expand")}
        loadingLabel={t("lazy.loading")}
        variant="surface"
      />
    </DataTable.Root>
  );
}
