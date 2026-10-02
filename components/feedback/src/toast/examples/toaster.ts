/**
 * Creates the one toaster the toast's examples raise into, as an application creates one in a
 * module its pages import.
 */

import * as Toast from "#toast/index.ts";

/**
 * The toaster: at the bottom end of the window, five toasts at a time, overlapping until a
 * pointer rests on them.
 */
export const toaster: Toast.Toaster = Toast.createToaster({
  max: 5,
  overlap: true,
  placement: "bottom-end",
});
