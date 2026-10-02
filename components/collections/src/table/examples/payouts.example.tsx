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

const TOTAL = "17,500.40";

export function Payouts(
  props: Omit<Table.SimpleProps<Account>, "columns" | "rows" | "rowToKey">,
): ReactElement {
  const { t } = useWords("table");

  return (
    <Table.Simple<Account>
      caption={t("caption")}
      columns={[
        { key: "name", label: t("account"), rowHeader: true },
        { key: "amount", label: t("amount"), numeric: true, sorted: "descending" },
      ]}
      rows={ACCOUNTS.map(({ amount, key }) => ({ amount, key, name: t(key) }))}
      rowToKey={(row) => row.key}
      total={(column) => {
        if (column.key === "name") return t("total");

        return column.numeric === true ? TOTAL : null;
      }}
      variant="surface"
      {...props}
    />
  );
}
