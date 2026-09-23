/**
 * Defines the cursor for each kind of control.
 *
 * @remarks
 *   A recipe writes `cursor: "button"` in place of `pointer`, so a theme that wants native controls
 *   shown with the arrow, as a desktop application does, changes one token. The defaults follow the
 *   web: a button and a switch take the hand, a form control keeps the arrow, and a box around a
 *   text field takes the I-beam over its marks and padding.
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
  disabled: { value: "not-allowed" },
  field: { value: "text" },
  menuitem: { value: "default" },
  option: { value: "default" },
  radio: { value: "default" },
  slider: { value: "default" },
  switch: { value: "pointer" },
};
