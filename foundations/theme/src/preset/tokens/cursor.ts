/**
 * Defines the cursor for each kind of control.
 *
 * @remarks
 *   A recipe writes `cursor: "button"` in place of `pointer`, so a theme that wants native controls
 *   shown with the arrow, as a desktop application does, changes one token. The defaults follow the
 *   web: a button and a switch take the hand, a form control keeps the arrow, a box around a text
 *   field takes the I-beam over its marks and padding, and a part the pointer moves, such as a crop
 *   selection, takes the move cursor, and the grabbing hand while it moves. A surface the pointer
 *   pans, such as a graph's canvas, takes the open hand, and a port a connection is drawn from
 *   takes the crosshair. A separator the pointer drags to change a column's width takes the column
 *   resize cursor.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the cursors a theme states.
 */
type Cursors = NonNullable<Tokens["cursor"]>;

/**
 * Lists the cursors, one per kind of control.
 */
export const cursor: Cursors = {
  button: { value: "pointer" },
  checkbox: { value: "default" },
  connect: { value: "crosshair" },
  disabled: { value: "not-allowed" },
  drag: { value: "move" },
  dragging: { value: "grabbing" },
  field: { value: "text" },
  menuitem: { value: "default" },
  option: { value: "default" },
  pan: { value: "grab" },
  radio: { value: "default" },
  resizeColumn: { value: "col-resize" },
  slider: { value: "default" },
  switch: { value: "pointer" },
};
