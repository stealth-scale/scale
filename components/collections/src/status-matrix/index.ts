/**
 * Exports `StatusMatrix` and its types.
 *
 * @remarks
 *   The matrix is one component, not a namespace of parts. A grid with another structure composes
 *   the table's parts, which the matrix is built from.
 */

export {
  type MatrixCell,
  type MatrixHeading,
  type MatrixState,
  type MatrixTone,
} from "#status-matrix/states.ts";
export { StatusMatrix, type StatusMatrixProps } from "#status-matrix/status-matrix.tsx";
