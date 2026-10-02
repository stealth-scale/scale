/**
 * Renders a Markdown table with the collections `Table` parts.
 *
 * @remarks
 *   The table scrolls sideways in the table's scroll area where it is wider than the document, and
 *   the scrolling region is named by the heading of the section the table is in, else by
 *   `tableLabel`. A column the author aligned right takes `data-numeric`, which ends its cells and
 *   sets tabular figures, and a column the author centred takes `data-align=center`, which the
 *   document's recipe centres.
 */

import { type ReactElement } from "react";

import { type TableNode } from "@tanstack/markdown";

import { Table } from "@stealthscale/component-collections";

import { renderInlines } from "#markdown/inlines.tsx";
import { each } from "#markdown/keyed.tsx";
import { type Scope } from "#markdown/scope.ts";

/**
 * Describes the alignment of one column, as the author wrote it.
 */
type Alignment = TableNode["align"][number];

/**
 * Returns the attributes of a cell in a column of an alignment.
 */
function alignedOf(align: Alignment): Readonly<Record<string, string>> {
  if (align === "right") return { "data-numeric": "" };

  return align === "center" ? { "data-align": "center" } : {};
}

/**
 * Renders a table in the table's scroll area.
 *
 * @param node - The table block.
 * @param scope - The document's components, glyphs, words and ids.
 */
export function renderTable(node: TableNode, scope: Scope): ReactElement {
  return (
    <Table.Scroller aria-label={scope.section ?? scope.words.tableLabel} size={scope.size}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            {each(node.header, (cell, index) => (
              <Table.ColumnHeader {...alignedOf(node.align[index])}>
                {renderInlines(cell.children, scope)}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {each(node.rows, (row) => (
            <Table.Row>
              {each(row, (cell, index) => (
                <Table.Cell {...alignedOf(node.align[index])}>
                  {renderInlines(cell.children, scope)}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.Scroller>
  );
}
