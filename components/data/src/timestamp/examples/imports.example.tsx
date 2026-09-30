import { type ReactElement, useId } from "react";

import { Table } from "@stealthscale/component-collections";
import { Code } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Timestamp } from "#timestamp/index.ts";

const PARCELS = [
  { delivered: "2026-07-25T09:40:00Z", parcel: "NL-8842-291" },
  { delivered: "", parcel: "NL-8842-292" },
  { delivered: "niet bezorgd", parcel: "NL-8842-293" },
] as const;

const DELIVERED: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Amsterdam",
};

export function Imports(): ReactElement {
  const { t } = useWords("timestamp");
  const caption = useId();

  return (
    <Table.Scroller aria-labelledby={caption}>
      <Table.Root>
        <Table.Caption id={caption}>{t("imports.caption")}</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>{t("imports.columns.parcel")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("imports.columns.cell")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("imports.columns.delivered")}</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {PARCELS.map(({ delivered, parcel }) => (
            <Table.Row key={parcel}>
              <Table.RowHeader>
                <Code>{parcel}</Code>
              </Table.RowHeader>
              <Table.Cell>
                {delivered === "" ? t("imports.blank") : <Code>{delivered}</Code>}
              </Table.Cell>
              <Table.Cell>
                <Timestamp options={DELIVERED} value={delivered} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.Scroller>
  );
}
