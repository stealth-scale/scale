import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Table from "#table/index.ts";

interface Account {
  readonly amount: string;
  readonly key: string;
  readonly name: string;
}

const ACCOUNTS = [
  { amount: "4,120.00", key: "bridge" },
  { amount: "880.40", key: "halden" },
  { amount: "12,500.00", key: "perrin" },
] as const;

function linkOf(row: Account): ReactElement {
  return <a href={`#${row.key}`}>{row.name}</a>;
}

export function Linked(
  props: Omit<Table.SimpleProps<Account>, "columns" | "rows" | "rowToKey">,
): ReactElement {
  const { t } = useWords("table");

  return (
    <Table.Simple<Account>
      caption={t("caption")}
      columns={[
        { cell: linkOf, key: "name", label: t("account"), rowHeader: true },
        { key: "amount", label: t("amount"), numeric: true },
      ]}
      rows={ACCOUNTS.map(({ amount, key }) => ({ amount, key, name: t(key) }))}
      rowToKey={(row) => row.key}
      variant="surface"
      {...props}
    />
  );
}
