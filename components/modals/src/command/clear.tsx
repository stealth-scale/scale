/**
 * Renders the control that empties the query.
 *
 * @remarks
 *   The control renders only while the field has a query, because clearing an empty field does
 *   nothing. Pressing it empties the query and moves focus back to the field.
 */

import { type ComponentProps, type ReactElement, useCallback } from "react";

import { withContext } from "#command/context.ts";
import { useCommand } from "#command/state.ts";

/**
 * Renders the `button` with the recipe's clear class, at the end of the bar.
 */
const Emptied = withContext("button", "clear", { defaultProps: { type: "button" } });

/**
 * Describes the props of the clear control: the props of a `button`.
 */
export type ClearProps = ComponentProps<typeof Emptied>;

/**
 * Empties the query and moves focus back to the field.
 *
 * @param props - The props of a `button`, the accessible name among them.
 * @returns The `button` element, or nothing while the field is empty.
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
