/**
 * Publishes the status matrix: one set drawn against another, a mark at every crossing.
 *
 * @remarks
 *   One component rather than a namespace of parts. What a matrix draws is fixed — a grid of marks
 *   over a legend — and a caller who wants something else composes the table's own parts, which is
 *   what this is built from.
 */

export {
  type MatrixCell,
  type MatrixHeading,
  type MatrixState,
  type MatrixTone,
} from "#status-matrix/states.ts";
export { StatusMatrix, type StatusMatrixProps } from "#status-matrix/status-matrix.tsx";
