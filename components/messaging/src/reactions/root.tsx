/**
 * Renders the row of reactions under a message.
 *
 * @remarks
 *   The element is a `fieldset`, the native group of controls, named by `label`, so a screen
 *   reader announces the reactions as one set and can skip past it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#reactions/context.ts";

/**
 * Renders the `fieldset` with the reactions' root class.
 */
const Grouped = withProvider("fieldset", "root");

/**
 * Describes the props of the row: its name and the props of a `fieldset`.
 */
export interface RootProps extends ComponentProps<typeof Grouped> {
  /**
   * Accessible name of the row, "Reactions" unless stated.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the row, named by `label`.
 *
 * @param props - The row's name and the props of a `fieldset`.
 * @returns The `fieldset` element.
 */
export function Root({ label = "Reactions", ...props }: RootProps): ReactElement {
  return <Grouped aria-label={label} {...props} />;
}
