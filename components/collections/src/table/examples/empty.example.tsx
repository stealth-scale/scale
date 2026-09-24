import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Table from "#table/index.ts";

interface Account {
  readonly amount: string;
  readonly key: string;
  readonly name: string;
}

export function Empty(): ReactElement {
  const { t } = useWords("table");

  return (
    <Table.Simple<Account>
      caption={t("caption")}
      columns={[
        { key: "name", label: t("account"), rowHeader: true },
        { key: "amount", label: t("amount"), numeric: true },
      ]}
      empty={t("nothing")}
      rows={[]}
      rowToKey={(row) => row.key}
      variant="surface"
    />
  );
}
