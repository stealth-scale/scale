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

const QUARTERS = [
  ["Jan", "Feb", "Mar"],
  ["Apr", "May", "Jun"],
  ["Jul", "Aug", "Sep"],
] as const;

export function Quarters(): ReactElement {
  const { t } = useWords("table");

  return (
    <Table.Simple<Account>
      caption={t("byMonth")}
      columns={[
        { key: "name", label: t("account"), rowHeader: true },
        ...QUARTERS.map((months, at) => ({
          columns: months.map((month) => ({
            cell: (row: Account) => row.amount,
            key: month,
            label: month,
            numeric: true,
          })),
          label: `Q${String(at + 1)}`,
        })),
      ]}
      rows={ACCOUNTS.map(({ amount, key }) => ({ amount, key, name: t(key) }))}
      rowToKey={(row) => row.key}
      rules="all"
      variant="surface"
    />
  );
}
