/**
 * Provides a fieldset's state to its parts and to the fields inside it.
 */

import { createContext, useContext } from "react";

import { type Ids, idsOf } from "#field/ids.ts";

/**
 * Describes the state a group's parts and the fields inside it read.
 */
export interface FieldsetState {
  /**
   * Whether every control in the group is disabled.
   */
  disabled: boolean;

  /**
   * Identifiers of the group's legend and texts.
   */
  ids: Ids;

  /**
   * Whether the group's value is invalid.
   */
  invalid: boolean;

  /**
   * Size of the group, which a field inside it takes unless it states its own.
   */
  size?: "lg" | "md" | "sm" | undefined;

  /**
   * Status the group reports, or nothing where it reports none.
   */
  status?: string | undefined;
}

/**
 * State a field reads outside any group: nothing disabled, invalid, sized or reported.
 */
const LOOSE: FieldsetState = { disabled: false, ids: idsOf("fieldset"), invalid: false };

/**
 * Context that provides the group's state, with the loose state outside a group.
 */
const FieldsetContext = createContext<FieldsetState>(LOOSE);

/**
 * Provides the group's state to its parts and to the fields inside it.
 */
export const FieldsetProvider = FieldsetContext;

/**
 * Returns the state of the group around a part or a field.
 *
 * @returns The group's state, or the loose state outside a group.
 */
export function useFieldset(): FieldsetState {
  return useContext(FieldsetContext);
}

/**
 * Returns the state of the group around a part, for a part that names itself after the group's
 * legend.
 *
 * @returns The group's state, or nothing outside a group.
 */
export function useOptionalFieldset(): FieldsetState | undefined {
  const state = useContext(FieldsetContext);

  return state === LOOSE ? undefined : state;
}
