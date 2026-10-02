import { type ReactElement, type ReactNode, useState } from "react";

import { Button } from "@stealthscale/component-actions";
import { Format } from "@stealthscale/component-data";
import { NativeSelect } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { Code, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as DataTable from "#data-table/index.ts";

import { CATEGORIES, changesOf, type Claim, differs, FILED, writtenTo } from "./claims.ts";

const column = DataTable.createColumnHelper<Claim>();

const EURO = { currency: "EUR", style: "currency" } as const;

function amountOf(value: number): ReactElement {
  return <Format.Number options={EURO} value={value} />;
}

function claimOf(id: string): ReactElement {
  return <Code size="sm">{id}</Code>;
}

function picker(editor: DataTable.EditorProps, names: Readonly<Record<string, string>>): ReactNode {
  return (
    <NativeSelect.Root size={editor.size}>
      <NativeSelect.Field
        aria-label={editor["aria-label"]}
        id={editor.id}
        onChange={(event) => {
          editor.commit(event.currentTarget.value);
        }}
        value={editor.value}
      >
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {names[category]}
          </option>
        ))}
      </NativeSelect.Field>
    </NativeSelect.Root>
  );
}

export function Claims(): ReactElement {
  const { t } = useWords("data-table");
  const names = Object.fromEntries(CATEGORIES.map((each) => [each, t(`claims.${each}`)]));
  const [saved, setSaved] = useState(() =>
    FILED.map((filed) => ({
      amount: filed.amount,
      category: filed.category,
      description: t(`claims.${filed.topic}`),
      id: filed.id,
    })),
  );
  const [rows, setRows] = useState(() =>
    saved.map((claim) => (claim.id === "EX-1044" ? writtenTo(claim, "amount", "42.6") : claim)),
  );
  const table = DataTable.useDataTable({
    columns: column.columns([
      column.accessor("id", {
        cell: (cell) => claimOf(cell.getValue()),
        header: t("claims.claim"),
        meta: { rowHeader: true },
      }),
      column.accessor("description", {
        header: t("claims.description"),
        meta: {
          edit: { validate: (text) => (text.trim() === "" ? t("claims.required") : undefined) },
        },
      }),
      column.accessor("category", {
        cell: (cell) => names[cell.getValue()],
        header: t("claims.category"),
        meta: { edit: { editor: (editor) => picker(editor, names) } },
      }),
      column.accessor("amount", {
        cell: (cell) => amountOf(cell.getValue()),
        header: t("claims.amount"),
        meta: {
          edit: {
            validate: (text) => (/^\d+(\.\d{1,2})?$/u.test(text) ? undefined : t("claims.invalid")),
          },
          numeric: true,
        },
      }),
    ]),
    data: rows,
    getRowId: (row) => row.id,
  });

  return (
    <DataTable.Root table={table}>
      <DataTable.Table
        caption={t("claims.caption")}
        grid
        onCellEdit={(edit) => {
          setRows(
            rows.map((row) =>
              row.id === edit.rowId ? writtenTo(row, edit.columnId, edit.value) : row,
            ),
          );
        }}
        unsaved={(id, field) => differs(rows, saved, id, field)}
        unsavedLabel={t("claims.unsaved")}
        variant="surface"
      />
      <Stack direction="row" gap="sm" wrap>
        <Text as="output">{t("claims.changes", { count: changesOf(rows, saved) })}</Text>
        <Button
          onClick={() => {
            setRows(saved);
          }}
          variant="ghost"
        >
          {t("claims.discard")}
        </Button>
        <Button
          onClick={() => {
            setSaved(rows);
          }}
        >
          {t("claims.save")}
        </Button>
      </Stack>
    </DataTable.Root>
  );
}
