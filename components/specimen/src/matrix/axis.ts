/**
 * Declares one axis of a matrix: the prop it turns, and the values it turns to.
 */

/**
 * Describes one axis of a matrix.
 *
 * @typeParam Value - What one cell is drawn for, such as a look, a size, or a state.
 */
export interface Axis<Value> {
  /**
   * The prop the axis turns, written before each value. Omitted where the values name themselves.
   */
  knob?: string | undefined;

  /**
   * Converts a value into the name its cell is captioned with. Defaults to the value written out,
   * which a look or a size name already is.
   */
  label?: ((value: Value) => string) | undefined;

  /**
   * The values, in the order the cells are drawn.
   */
  of: readonly Value[];
}

/**
 * Returns the name a cell is captioned with.
 */
export function nameOf<Value>(axis: Axis<Value>, value: Value): string {
  return (axis.label ?? String)(value);
}

/**
 * The value a cell is drawn with along an axis that does not cross: nothing, typed so it passes
 * for whatever the matrix types the second argument of its drawing function as.
 *
 * @remarks
 *   A matrix of one axis calls the drawing function with `undefined` for the axis it has not got,
 *   and the type of that argument is the matrix's second type parameter, which defaults to
 *   `undefined` and is not narrowed by the axis being absent. One assertion here, rather than one
 *   at each call.
 */
// eslint-disable-next-line typescript/no-unsafe-type-assertion -- stands for the absent axis, which the type parameter defaults to undefined for
export const ABSENT = undefined as never;

/**
 * Writes a cell's caption as one line, including the prop where the axis names one.
 *
 * @remarks
 *   Read by a caller that needs the caption as a string rather than as markup, such as the matrix
 *   keying its cells.
 */
export function captionOf<Value>(axis: Axis<Value>, value: Value): string {
  const named = nameOf(axis, value);

  return axis.knob === undefined ? named : `${axis.knob} = ${named}`;
}
