/**
 * Renders the control that empties the query.
 *
 * @remarks
 *   It draws nothing until something has been typed. A control that empties an empty field is a
 *   target a reader can reach and press to no effect, and one standing at the end of every palette
 *   ever opened reads as part of the furniture rather than as something to do.
 *   Pressing it returns the reader to the field. A palette is worked from the keyboard, and a clear
 *   that left focus on itself put the reader one stop away from the field they were typing in with
 *   nothing to say so.
 */

import { type ComponentProps, type ReactElement, useCallback } from "react";

import { withContext } from "#command/context.ts";
import { useCommand } from "#command/state.ts";

/**
 * The styled element carrying the recipe's clear slot, which sits at the end of the query bar.
 */
const Emptied = withContext("button", "clear", { defaultProps: { type: "button" } });

/**
 * Props accepted by `Clear`, which are the props of a styled button.
 */
export type ClearProps = ComponentProps<typeof Emptied>;

/**
 * Empties the query and returns the reader to the field.
 *
 * @param props - Everything a styled button takes, the accessible name among them.
 * @returns The control, or nothing while the field is empty.
 */
export function Clear(props: ClearProps): ReactElement | undefined {
  const palette = useCommand();

  const empty = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      palette.narrow("");
      event.currentTarget.parentElement?.querySelector("input")?.focus();
    },
    [palette],
  );

  if (palette.typed === "") return undefined;

  return <Emptied onClick={empty} {...props} />;
}
