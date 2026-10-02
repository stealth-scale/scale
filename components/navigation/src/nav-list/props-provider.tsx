/**
 * Sets the defaults of every navigation list below it.
 *
 * @remarks
 *   A sidebar collapsed to a rail renders the provider with `iconic`, so the caller does not set it
 *   on each list. A list's own prop overrides the provider's value.
 */

import { type ReactElement, type ReactNode } from "react";

import { type Defaults, DefaultsContext } from "#nav-list/state.ts";

/**
 * Describes the props of the provider: the defaults and the tree they apply to.
 */
export interface PropsProviderProps {
  /**
   * The tree whose lists read the defaults.
   */
  readonly children?: ReactNode | undefined;

  /**
   * The defaults: whether the lists are iconic and the size of their rows.
   */
  readonly value: Defaults;
}

/**
 * Renders the tree with the defaults in context.
 *
 * @param props - The defaults and the tree.
 * @returns The tree inside the context.
 */
export function PropsProvider({ children, value }: PropsProviderProps): ReactElement {
  return <DefaultsContext value={value}>{children}</DefaultsContext>;
}
