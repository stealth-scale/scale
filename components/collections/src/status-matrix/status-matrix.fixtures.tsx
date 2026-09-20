/**
 * Builds the matrix every specification draws, so no case states the same eight props.
 */

import { type ReactElement, type ReactNode } from "react";

import { withProvider } from "#status-matrix/context.ts";
import { type MatrixCell, type MatrixHeading, type MatrixState } from "#status-matrix/states.ts";
import { StatusMatrix, type StatusMatrixProps } from "#status-matrix/status-matrix.tsx";

/**
 * Provides the variants every part below the root reads.
 */
const Framed = withProvider("div", "root");

/**
 * Draws whatever a case wants measured inside the root that states the variants.
 *
 * @param children - The part under test, which a case puts in a matrix where one is needed.
 * @returns The root, holding it.
 */
export function framed(children: ReactNode): ReactElement {
  return <Framed>{children}</Framed>;
}

/**
 * The vocabulary every case reads its cells against.
 */
export const STATES: Readonly<Record<string, MatrixState>> = {
  down: { label: "Down", mark: "x", tone: "error" },
  fine: { label: "Healthy", mark: "y", tone: "success" },
  rolling: { label: "Rolling out", mark: "r", tone: "info" },
  skipped: { label: "Not applicable", mark: "-", tone: "neutral" },
  slow: { label: "Degraded", mark: "!", tone: "warning" },
};

/**
 * Drawn at a crossing nobody measured.
 */
export const UNMEASURED: MatrixState = { label: "Not measured", tone: "neutral" };

/**
 * The rows every case draws, gathered into two sections.
 */
export const ROWS: readonly MatrixHeading[] = [
  { group: "Payments", id: "checkout", label: "checkout-api" },
  { group: "Payments", id: "ledger", label: "ledger" },
  { group: "Discovery", id: "search", label: "search-api" },
];

/**
 * The columns every case draws.
 */
export const COLUMNS: readonly MatrixHeading[] = [
  { id: "eu", label: "EU" },
  { id: "us", label: "US" },
  { id: "apac", label: "APAC" },
];

/**
 * The crossings every case reads. The APAC column of `search` is left out, so one pair is a gap.
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
 * Draws a matrix, less whatever a case states itself.
 *
 * @param props - Whatever the case sets on the matrix.
 * @returns The grid and its legend.
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
