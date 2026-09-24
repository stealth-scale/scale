import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Table from "#table/index.ts";

interface Account {
  readonly amount: string;
  readonly key: string;
  readonly name: string;
  readonly state: string;
}

const ACCOUNTS = [
  { amount: "4,120.00", key: "bridge", state: "settled" },
  { amount: "880.40", key: "halden", state: "held" },
  { amount: "12,500.00", key: "perrin", state: "queued" },
] as const;

export function Sections(): ReactElement {
  const { t } = useWords("table");

  return (
    <Table.Simple<Account>
      caption={t("caption")}
      columns={[
        { key: "name", label: t("account"), rowHeader: true },
        { key: "amount", label: t("amount"), numeric: true },
      ]}
      groupBy={(row) => row.state}
      groupLabel={(state) => t(state)}
      rows={ACCOUNTS.map(({ amount, key, state }) => ({ amount, key, name: t(key), state }))}
      rowToKey={(row) => row.key}
      variant="surface"
    />
  );
}
