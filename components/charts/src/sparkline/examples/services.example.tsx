import { type ReactElement, useId } from "react";

import { Table } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import { Sparkline } from "#sparkline/index.ts";

const SERVICES = [
  { key: "api", now: "182 ms", run: [160, 170, 168, 190, 240, 210, 185, 182] },
  { key: "search", now: "94 ms", run: [120, 118, 110, 104, 99, 97, 95, 94] },
  { key: "checkout", now: "311 ms", run: [250, 255, 262, 270, 284, 290, 305, 311] },
  { key: "auth", now: "45 ms", run: [44, 46, 45, 47, 44, 45, 46, 45] },
];

export function Services(): ReactElement {
  const { t } = useWords("sparkline");
  const id = useId();

  return (
    <Table.Scroller aria-labelledby={id} variant="surface">
      <Table.Root>
        <Table.Caption id={id}>{t("services.caption")}</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>{t("services.service")}</Table.ColumnHeader>
            <Table.ColumnHeader data-numeric>{t("services.now")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("services.day")}</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {SERVICES.map((service) => (
            <Table.Row key={service.key}>
              <Table.RowHeader>{t(`services.${service.key}`)}</Table.RowHeader>
              <Table.Cell data-numeric>{service.now}</Table.Cell>
              <Table.Cell>
                <Sparkline size="sm" values={service.run} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.Scroller>
  );
}
