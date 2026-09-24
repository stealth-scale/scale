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

export function Fixed(): ReactElement {
  const { t } = useWords("table");

  return (
    <Table.Simple<Account>
      caption={t("caption")}
      columns={[
        { key: "name", label: t("account"), rowHeader: true, width: "40%" },
        { key: "state", label: t("state"), width: "25%" },
        { key: "amount", label: t("amount"), numeric: true, width: "35%" },
      ]}
      layout="fixed"
      rows={ACCOUNTS.map(({ amount, key, state }) => ({
        amount,
        key,
        name: t(key),
        state: t(state),
      }))}
      rowToKey={(row) => row.key}
      variant="surface"
    />
  );
}
