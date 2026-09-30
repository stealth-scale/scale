import { type ReactElement, useId, useState } from "react";

import { Button } from "@stealthscale/component-actions";
import { Table } from "@stealthscale/component-collections";
import { Group, Stack } from "@stealthscale/component-layout";
import { Code, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Format from "#format/index.ts";
import { Timestamp } from "#timestamp/index.ts";

const PAYOUTS = [
  { amount: 4820, at: "2026-07-25T12:15:00Z", key: "PO-2026-0731", status: "initiated" },
  { amount: 1204.5, at: "2026-07-25T09:05:00Z", key: "PO-2026-0730", status: "settled" },
  { amount: 12_900, at: "2026-07-24T16:40:00Z", key: "PO-2026-0729", status: "returned" },
] as const;

const EUROS: Intl.NumberFormatOptions = { currency: "EUR", style: "currency" };

export function Payouts(): ReactElement {
  const { t } = useWords("timestamp");
  const caption = useId();
  const [readAt, setReadAt] = useState(() => new Date("2026-07-25T14:30:00Z"));

  return (
    <Stack align="flex-start" gap="md">
      <Table.Scroller aria-labelledby={caption}>
        <Table.Root>
          <Table.Caption id={caption}>{t("payouts.caption")}</Table.Caption>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>{t("payouts.columns.reference")}</Table.ColumnHeader>
              <Table.ColumnHeader data-numeric>{t("payouts.columns.amount")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("payouts.columns.status")}</Table.ColumnHeader>
              <Table.ColumnHeader>{t("payouts.columns.initiated")}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {PAYOUTS.map((payout) => (
              <Table.Row key={payout.key}>
                <Table.RowHeader>
                  <Code>{payout.key}</Code>
                </Table.RowHeader>
                <Table.Cell data-numeric>
                  <Format.Number options={EUROS} value={payout.amount} />
                </Table.Cell>
                <Table.Cell>{t(`payouts.statuses.${payout.status}`)}</Table.Cell>
                <Table.Cell>
                  <Timestamp now={readAt} reads="relative" value={payout.at} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.Scroller>
      <Group align="baseline" gap="md">
        <Button
          onClick={() => {
            setReadAt((before) => new Date(before.getTime() + 3_600_000));
          }}
          size="sm"
          variant="outline"
        >
          {t("payouts.move")}
        </Button>
        <Text>
          {t("payouts.measured")}{" "}
          <Timestamp
            options={{ timeStyle: "short", timeZone: "Europe/Amsterdam" }}
            value={readAt}
          />
        </Text>
      </Group>
    </Stack>
  );
}
