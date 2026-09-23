import { type ReactElement, useId } from "react";

import { Table } from "@stealthscale/component-collections";
import { Code } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { ColorSwatch } from "#color-swatch/index.ts";

const TOKENS = [
  ["page", "#303841"],
  ["panel", "#3A4750"],
  ["primary", "#D72323"],
  ["ink", "#EEEEEE"],
] as const;

export function Tokens(): ReactElement {
  const { t } = useWords("color-swatch");
  const caption = useId();

  return (
    <Table.Scroller aria-labelledby={caption}>
      <Table.Root>
        <Table.Caption id={caption}>{t("caption")}</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>{t("columns.colour")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("columns.role")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("columns.value")}</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {TOKENS.map(([role, value]) => (
            <Table.Row key={role}>
              <Table.Cell>
                <ColorSwatch value={value} />
              </Table.Cell>
              <Table.RowHeader>{t(`roles.${role}`)}</Table.RowHeader>
              <Table.Cell>
                <Code>{value}</Code>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.Scroller>
  );
}
