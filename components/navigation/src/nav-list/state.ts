/**
 * Provides the defaults a list below a provider starts from, and the state a list gives its rows.
 *
 * @remarks
 *   A sidebar collapsed to a rail sets `iconic` once through the provider, and every list in it
 *   renders its rows as icons. A list's own prop overrides the provider. A row reads whether its
 *   list is iconic to decide whether it shows its tooltip.
 */

import { createContext, use } from "react";

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the defaults a provider sets for every list below it.
 */
export interface Defaults {
  /**
   * Whether the lists render their rows as icons.
   */
  readonly iconic?: boolean | undefined;

  /**
   * Size of the lists' rows.
   */
  readonly size?: "lg" | "md" | "sm" | undefined;
}

/**
 * Context through which a provider sets the defaults of the lists below it.
 */
export const DefaultsContext = createContext<Defaults>({});

/**
 * Reads the defaults the nearest provider sets, or none outside a provider.
 */
export function useDefaults(): Defaults {
  return use(DefaultsContext);
}

/**
 * Describes the state a list gives its rows.
 */
export interface ListState {
  /**
   * Whether the list renders its rows as icons.
   */
  readonly iconic: boolean;
}

/**
 * Creates the context through which a list provides its state to its rows.
 */
export const [ListProvider, useList] = createRequiredContext<ListState>("NavList");
