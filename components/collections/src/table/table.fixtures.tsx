/**
 * Builds the tables the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import * as Table from "#table/index.ts";
import { type ScrollerProps } from "#table/scroller.tsx";

/**
 * Renders the children inside a scroller.
 *
 * @param children - The part under test.
 * @returns The scroller with the children inside it.
 */
export function scrolled(children: ReactNode): ReactElement {
  return <Table.Scroller>{children}</Table.Scroller>;
}

/**
 * Renders cells inside a scroller, a table, a body and a row.
 *
 * @param children - The row's cells.
 * @returns The scroller with the row inside it.
 */
export function rowed(children: ReactNode): ReactElement {
  return (
    <Table.Scroller>
      <Table.Root>
        <Table.Body>
          <Table.Row>{children}</Table.Row>
        </Table.Body>
      </Table.Root>
    </Table.Scroller>
  );
}

/**
 * Renders a table with every part: column declarations, a caption, a header with a sort button,
 * two body rows and a total.
 *
 * @param props - The props of the scroller.
 * @returns The table.
 */
export function composed(props: ScrollerProps = {}): ReactElement {
  return (
    <Table.Scroller aria-labelledby="table-caption" {...props}>
      <Table.Root>
        <Table.ColumnGroup>
          <Table.Column />
          <Table.Column />
        </Table.ColumnGroup>
        <Table.Caption id="table-caption">Invoices this quarter</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Client</Table.ColumnHeader>
            <Table.ColumnHeader aria-sort="ascending" data-numeric>
              <Table.Sorter>Total</Table.Sorter>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.RowHeader>Fathom</Table.RowHeader>
            <Table.Cell data-numeric>1,024.00</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeader>Folio</Table.RowHeader>
            <Table.Cell data-numeric>512.50</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.RowHeader>Total</Table.RowHeader>
            <Table.Cell data-numeric>1,536.50</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    </Table.Scroller>
  );
}
