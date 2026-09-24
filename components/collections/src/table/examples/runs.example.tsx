import { type ReactElement, useId } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Table from "#table/index.ts";

const ACCOUNTS = [
  { amount: "4,120.00", key: "bridge" },
  { amount: "880.40", key: "halden" },
  { amount: "12,500.00", key: "perrin" },
] as const;

const MONTHS = ["Jan", "Feb"] as const;

export function Runs(): ReactElement {
  const { t } = useWords("table");
  const id = useId();

  return (
    <Table.Scroller aria-labelledby={id} variant="surface">
      <Table.Root>
        <Table.Caption id={id}>{t("caption")}</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>{t("account")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("month")}</Table.ColumnHeader>
            <Table.ColumnHeader data-numeric>{t("amount")}</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        {ACCOUNTS.map((account) => (
          <Table.Body key={account.key}>
            {MONTHS.map((month, at) => (
              <Table.Row key={month}>
                {at === 0 ? (
                  <Table.RowHeader rowSpan={MONTHS.length} scope="rowgroup">
                    {t(account.key)}
                  </Table.RowHeader>
                ) : null}
                <Table.Cell>{month}</Table.Cell>
                <Table.Cell data-numeric>{account.amount}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        ))}
      </Table.Root>
    </Table.Scroller>
  );
}
