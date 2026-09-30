import { type ReactElement, type ReactNode } from "react";

import { renderHook } from "@testing-library/react";

import { Field } from "@stealthscale/component-forms";
import { Pagination } from "@stealthscale/component-navigation";
import { LocaleContext } from "@stealthscale/provider-locale";

import { ColumnFilter, type ColumnFilterProps } from "#data-table/column-filter.tsx";
import { createColumnHelper } from "#data-table/column-helper.ts";
import { ColumnManager, type ColumnManagerProps } from "#data-table/column-manager.tsx";
import { ColumnMenu, type ColumnMenuProps } from "#data-table/column-menu.tsx";
import { expandColumn } from "#data-table/expand-column.tsx";
import { type EditorProps } from "#data-table/features.ts";
import { PageSize } from "#data-table/page-size.tsx";
import { TablePagination } from "#data-table/pagination.tsx";
import { pinColumn } from "#data-table/pin-column.tsx";
import { pivot, type PivotOptions } from "#data-table/pivot.tsx";
import { Root } from "#data-table/root.tsx";
import { Search } from "#data-table/search.tsx";
import { selectColumn } from "#data-table/select-column.tsx";
import { Table, type TableProps } from "#data-table/table.tsx";
import {
  type DataTableApi,
  type DataTableOptions,
  useDataTable,
} from "#data-table/use-data-table.ts";

export interface Entry {
  readonly account: string;
  readonly amount: number;
  readonly children?: readonly Entry[];
  readonly region: string;
}

export const ENTRIES: readonly Entry[] = Array.from({ length: 12 }, (_, at) => ({
  account: `Account ${String(at + 1).padStart(2, "0")}`,
  amount: ((at * 7) % 12) * 100,
  region: at % 2 === 0 ? "North" : "South",
}));

const column = createColumnHelper<Entry>();

export const COLUMNS = column.columns([
  column.accessor("account", { header: "Account", meta: { rowHeader: true } }),
  column.accessor("region", { enableSorting: false, header: "Region" }),
  column.accessor("amount", { header: "Amount", meta: { numeric: true } }),
]);

export const GROUPED = column.columns([
  column.accessor("account", { header: "Account", meta: { rowHeader: true } }),
  column.group({
    columns: column.columns([
      column.accessor("region", { header: "Region" }),
      column.accessor("amount", { header: "Amount", meta: { numeric: true } }),
    ]),
    header: "Figures",
    id: "figures",
  }),
]);

export const SELECTING = column.columns([
  selectColumn<Entry>({
    allLabel: "Select every entry",
    indeterminateIndicator: "–",
    indicator: "✓",
    label: (entry) => `Select ${entry.account}`,
  }),
  ...COLUMNS,
]);

export const EXPANDING = column.columns([
  expandColumn<Entry>({
    detail: (entry) => `${entry.account} is in the ${entry.region} region.`,
    indicator: "›",
    label: (entry) => `Details of ${entry.account}`,
  }),
  ...COLUMNS,
]);

export const PINNING = column.columns([
  pinColumn<Entry>({ indicator: "↑", label: (entry) => `Pin ${entry.account}` }),
  ...COLUMNS,
]);

export const SPANNING = column.columns([
  column.accessor("account", {
    header: "Account",
    meta: { rowHeader: true },
    spanColumns: ({ row }) => (row.original.amount === 0 ? 2 : 1),
  }),
  column.accessor("region", { header: "Region", spanRows: true }),
  column.accessor("amount", { header: "Amount", meta: { numeric: true } }),
]);

export const EDITING = column.columns([
  column.accessor("account", { header: "Account", meta: { rowHeader: true } }),
  column.accessor("region", { header: "Region", meta: { edit: {} } }),
  column.accessor("amount", {
    header: "Amount",
    meta: {
      edit: { validate: (text) => (/^\d+$/u.test(text) ? undefined : "Enter a whole number") },
      numeric: true,
    },
  }),
]);

export function regionEditor(props: EditorProps): ReactElement {
  return (
    <select
      aria-describedby={props["aria-describedby"]}
      aria-invalid={props["aria-invalid"]}
      aria-label={props["aria-label"]}
      id={props.id}
      onChange={(event) => {
        props.commit(event.currentTarget.value);
      }}
      value={props.value}
    >
      <option value="North">North</option>
      <option value="South">South</option>
      <option value="West">West</option>
    </select>
  );
}

export const CHOOSING = column.columns([
  column.accessor("account", { header: "Account", meta: { rowHeader: true } }),
  column.accessor("region", { header: "Region", meta: { edit: { editor: regionEditor } } }),
]);

export const FILTERING = column.columns([
  column.accessor("account", { header: "Account", meta: { filter: "text", rowHeader: true } }),
  column.accessor("region", { filterFn: "arrHas", header: "Region", meta: { filter: "select" } }),
  column.accessor("amount", { header: "Amount", meta: { filter: "range", numeric: true } }),
]);

export const TREE: readonly Entry[] = [
  {
    account: "North",
    amount: 900,
    children: [
      {
        account: "Oslo",
        amount: 400,
        children: [
          { account: "Oslo East", amount: 150, region: "North" },
          { account: "Oslo West", amount: 250, region: "North" },
        ],
        region: "North",
      },
      { account: "Bergen", amount: 500, region: "North" },
    ],
    region: "North",
  },
  {
    account: "South",
    amount: 700,
    children: [{ account: "Lisbon", amount: 700, region: "South" }],
    region: "South",
  },
  { account: "Central", amount: 300, region: "Central" },
];

export const BRANCHED: Partial<DataTableOptions<Entry>> = {
  data: TREE,
  getSubRows: (entry) => entry.children,
};

export const SUMMED = column.columns([
  column.accessor("account", { header: "Account", meta: { rowHeader: true } }),
  column.accessor("region", { header: "Region" }),
  column.accessor("amount", { aggregationFn: "sum", header: "Amount", meta: { numeric: true } }),
]);

export const FOOTED = column.columns([
  column.accessor("account", { footer: "Total", header: "Account", meta: { rowHeader: true } }),
  column.accessor("region", { header: "Region" }),
  column.accessor("amount", { footer: "6,600", header: "Amount", meta: { numeric: true } }),
]);

export const HEADED_UNFOOTED = column.columns([
  column.accessor("region", { footer: "Total", header: "Region", meta: { rowHeader: true } }),
  column.accessor("account", { header: "Account", meta: { rowHeader: true } }),
  column.accessor("amount", { footer: "6,600", header: "Amount", meta: { numeric: true } }),
]);

export interface Order {
  readonly amount: number;
  readonly group: string;
  readonly part: string;
  readonly period: string;
}

export const ORDERS: readonly Order[] = [
  { amount: 10, group: "a", part: "one", period: "x" },
  ...Array.from({ length: 99 }, () => ({ amount: 90, group: "a", part: "one", period: "y" })),
  { amount: 5, group: "b", part: "two", period: "x" },
];

export const NESTED: readonly Order[] = [
  { amount: 4, group: "a", part: "one", period: "x" },
  { amount: 6, group: "b", part: "two", period: "x" },
  { amount: 8, group: "a", part: "two", period: "y" },
];

export function optionsOf(given: Partial<DataTableOptions<Entry>> = {}): DataTableOptions<Entry> {
  return { columns: COLUMNS, data: ENTRIES, getRowId: (row) => row.account, ...given };
}

export function tableOf(given: Partial<DataTableOptions<Entry>> = {}): DataTableApi<Entry> {
  return renderHook(() => useDataTable(optionsOf(given))).result.current;
}

interface LedgerProps {
  readonly after?: ReactNode;
  readonly before?: ReactNode;
  readonly options: Partial<DataTableOptions<Entry>>;
  readonly rebuilt: boolean;
  readonly table: Partial<TableProps>;
}

function selectingNow(): typeof SELECTING {
  return column.columns([
    selectColumn<Entry>({
      allLabel: "Select every entry",
      label: (entry) => `Select ${entry.account}`,
    }),
    column.accessor("account", { cell: (cell) => cell.getValue(), header: "Account" }),
  ]);
}

// eslint-disable-next-line react/only-export-components -- the hook runs inside a component the fixture renders
function Ledger({ after, before, options, rebuilt, table }: LedgerProps): ReactElement {
  const created = useDataTable(optionsOf(rebuilt ? { columns: selectingNow() } : options));

  return (
    <Root table={created}>
      {before}
      <Table caption="Ledger" {...table} />
      {after}
    </Root>
  );
}

export function paged(
  options: Partial<DataTableOptions<Entry>> = {},
  before: ReactNode = null,
  indicator?: ReactNode,
): ReactElement {
  return (
    <Ledger
      after={
        <>
          <PageSize indicator={indicator} label="Entries per page" sizes={[5, 10]} />
          <TablePagination>
            <Pagination.PageText format="long" />
            <Pagination.Items />
          </TablePagination>
        </>
      }
      before={before}
      options={{ initialState: { pagination: { pageIndex: 0, pageSize: 5 } }, ...options }}
      rebuilt={false}
      table={{}}
    />
  );
}

export function fielded(): ReactElement {
  return (
    <Ledger
      after={
        <Field.Root>
          <Field.Label>Entries per page</Field.Label>
          <PageSize sizes={[5, 10]} />
        </Field.Root>
      }
      options={{ initialState: { pagination: { pageIndex: 0, pageSize: 5 } } }}
      rebuilt={false}
      table={{}}
    />
  );
}

export function filtered(
  options: Partial<DataTableOptions<Entry>> = {},
  words: Partial<ColumnFilterProps> = {},
): ReactElement {
  return (
    <Ledger
      options={{ columns: FILTERING, ...options }}
      rebuilt={false}
      table={{
        columnActions: (each) => (
          <ColumnFilter checkIndicator="✓" column={each} indicator="⌕" {...words} />
        ),
      }}
    />
  );
}

export function managed(
  options: Partial<DataTableOptions<Entry>> = {},
  words: Partial<ColumnManagerProps> = {},
): ReactElement {
  return (
    <Ledger
      before={<ColumnManager checkIndicator="✓" handleIndicator="⠿" {...words} />}
      options={options}
      rebuilt={false}
      table={{}}
    />
  );
}

export function menued(
  options: Partial<DataTableOptions<Entry>> = {},
  only?: string,
  words: Partial<ColumnMenuProps> = {},
): ReactElement {
  return (
    <Ledger
      options={options}
      rebuilt={false}
      table={{
        columnActions: (each) =>
          only === undefined || each.id === only ? (
            <ColumnMenu column={each} indicator="⋮" {...words} />
          ) : null,
      }}
    />
  );
}

export function searchField(): ReactElement {
  return <Search aria-label="Search entries" clearIndicator="×" />;
}

export function searched(
  options: Partial<DataTableOptions<Entry>> = {},
  table: Partial<TableProps> = {},
): ReactElement {
  return <Ledger before={searchField()} options={options} rebuilt={false} table={table} />;
}

export function tabled(
  options: Partial<DataTableOptions<Entry>> = {},
  table: Partial<TableProps> = {},
): ReactElement {
  return <Ledger options={options} rebuilt={false} table={table} />;
}

export function rebuiltTable(): ReactElement {
  return <Ledger options={{}} rebuilt table={{}} />;
}

interface PivotedProps {
  readonly options: PivotOptions<Order>;
  readonly records: readonly Order[];
}

// eslint-disable-next-line react/only-export-components -- the hook runs inside a component the fixture renders
function Pivoted({ options, records }: PivotedProps): ReactElement {
  const table = useDataTable(pivot(records, options));

  return (
    <Root table={table}>
      <Table caption="Amounts" />
    </Root>
  );
}

export function pivoted(
  options: Partial<PivotOptions<Order>> = {},
  records: readonly Order[] = NESTED,
): ReactElement {
  return (
    <Pivoted
      options={{ column: "period", rows: ["group", "part"], value: "amount", ...options }}
      records={records}
    />
  );
}

export function rightToLeft({ children }: { readonly children: ReactNode }): ReactElement {
  return (
    <LocaleContext
      value={{
        direction: "rtl",
        isPending: false,
        locale: "ar",
        locales: ["ar"],
        setLocale: () => {},
      }}
    >
      {children}
    </LocaleContext>
  );
}
