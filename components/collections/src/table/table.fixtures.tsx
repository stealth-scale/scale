/**
 * Builds the table a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import * as Table from "#table/index.ts";
import { type ScrollerProps } from "#table/scroller.tsx";

/**
 * Draws whatever a case wants measured inside the scroller that states the variants.
 *
 * @param children - The part under test, which the case puts in a table where one is needed.
 * @returns The scroller, holding it.
 */
export function scrolled(children: ReactNode): ReactElement {
  return <Table.Scroller>{children}</Table.Scroller>;
}

/**
 * Draws a part that only renders inside a row, in the elements a browser expects it in.
 *
 * @param children - The row's cells.
 * @returns The scroller, the table and one row, holding them.
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
 * Draws a whole table, so a case can read what every band did.
 *
 * @param props - Whatever the case sets on the scroller.
 * @returns Every part composed the way a caller composes them.
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
