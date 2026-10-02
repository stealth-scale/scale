/**
 * Fixtures for the status matrix specs: a vocabulary, two axes, the cells and a matrix builder.
 */

import { type ReactElement, type ReactNode } from "react";

import { withProvider } from "#status-matrix/context.ts";
import { type MatrixCell, type MatrixHeading, type MatrixState } from "#status-matrix/states.ts";
import { StatusMatrix, type StatusMatrixProps } from "#status-matrix/status-matrix.tsx";

/**
 * Renders the root `div` that provides the variants.
 */
const Framed = withProvider("div", "root");

/**
 * Renders a part inside the root that provides the variants.
 *
 * @param children - The part under test.
 * @returns The root with the part inside it.
 */
export function framed(children: ReactNode): ReactElement {
  return <Framed>{children}</Framed>;
}

/**
 * Vocabulary of five states, one per tone.
 */
export const STATES: Readonly<Record<string, MatrixState>> = {
  down: { label: "Down", mark: "x", tone: "error" },
  fine: { label: "Healthy", mark: "y", tone: "success" },
  rolling: { label: "Rolling out", mark: "r", tone: "info" },
  skipped: { label: "Not applicable", mark: "-", tone: "neutral" },
  slow: { label: "Degraded", mark: "!", tone: "warning" },
};

/**
 * State of a pair without a cell, with no mark.
 */
export const UNMEASURED: MatrixState = { label: "Not measured", tone: "neutral" };

/**
 * Three rows in two groups.
 */
export const ROWS: readonly MatrixHeading[] = [
  { group: "Payments", id: "checkout", label: "checkout-api" },
  { group: "Payments", id: "ledger", label: "ledger" },
  { group: "Discovery", id: "search", label: "search-api" },
];

/**
 * Three columns.
 */
export const COLUMNS: readonly MatrixHeading[] = [
  { id: "eu", label: "EU" },
  { id: "us", label: "US" },
  { id: "apac", label: "APAC" },
];

/**
 * Cells for every pair but `search` in `apac`, which is a gap.
 */
export const CELLS: readonly MatrixCell[] = [
  { column: "eu", row: "checkout", state: "fine" },
  { column: "us", row: "checkout", state: "down" },
  { column: "apac", row: "checkout", state: "slow" },
  { column: "eu", row: "ledger", state: "fine" },
  { column: "us", row: "ledger", state: "fine" },
  { column: "apac", row: "ledger", state: "fine" },
  { column: "eu", row: "search", state: "fine" },
  { column: "us", row: "search", state: "rolling" },
];

/**
 * Renders a matrix over the fixtures with a caption, a corner, a legend and a rollup, and the
 * props the case sets.
 *
 * @param props - The props the case sets.
 * @returns The matrix.
 */
export function graded(props: Partial<StatusMatrixProps> = {}): ReactElement {
  return (
    <StatusMatrix
      caption="Service health by region"
      cells={CELLS}
      columns={COLUMNS}
      corner="Service"
      legend="States"
      rollup="Worst"
      rows={ROWS}
      states={STATES}
      unmeasured={UNMEASURED}
      {...props}
    />
  );
}
