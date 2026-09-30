/**
 * Renders the separator that resizes a column, at the inline end of the column's header.
 *
 * @remarks
 *   The element is an `hr`, whose role is `separator`, in the tab order: the WAI-ARIA window
 *   splitter pattern. It is named by the header's words for the column, and its value is the
 *   column's size in pixels, between the column's minimum and maximum. A pointer drags it through
 *   TanStack's resize handler, a double click restores the size the column states, and the keys
 *   come from `resizedByKey`. The header passes the size and whether the column is being resized,
 *   because the column remains the same object across changes.
 */

import { type ReactElement } from "react";

import { type Header, type RowData } from "@tanstack/react-table";

import { withContext } from "#data-table/context.ts";
import { type Features } from "#data-table/features.ts";
import { boundsOf, resizedByKey } from "#data-table/resizing.ts";
import { useTableState } from "#data-table/state.ts";

/**
 * Renders the `hr` with the recipe's resizer class.
 */
const Handle = withContext("hr", "resizer");

/**
 * Describes the props of a resizer: the header, the words and the column's size and state.
 */
export interface ResizerProps {
  /**
   * Header of the column the separator resizes.
   */
  readonly header: Header<Features, RowData>;

  /**
   * Accessible name of the separator, such as "Resize Amount".
   */
  readonly label: string;

  /**
   * Whether a pointer is resizing the column now.
   */
  readonly resizing: boolean;

  /**
   * Size of the column in pixels.
   */
  readonly size: number;

  /**
   * Size in words, such as "150 pixels".
   */
  readonly valueText: string;
}

/**
 * Renders the separator.
 *
 * @param props - The header, the words, the size and the resizing state.
 * @returns The `hr` element.
 */
export function Resizer({ header, label, resizing, size, valueText }: ResizerProps): ReactElement {
  const table = useTableState();
  const { column } = header;
  const { max, min } = boundsOf(column.columnDef);
  const drag = header.getResizeHandler();

  return (
    <Handle
      aria-label={label}
      aria-orientation="vertical"
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={size}
      aria-valuetext={valueText}
      data-resizing={resizing ? "" : undefined}
      onDoubleClick={() => {
        column.resetSize();
      }}
      onKeyDown={(event) => {
        resizedByKey(table, column, event);
      }}
      onMouseDown={drag}
      onTouchStart={drag}
      tabIndex={0}
    />
  );
}
