/**
 * Registers the actions a narrow row folds into its menu.
 *
 * @remarks
 *   A folded action renders nothing in its row and registers with the row, so no hidden control
 *   remains in the tab order or in a toolbar's arrow-key order. The row keeps the entries in state
 *   and renders its menu from them. An action folds in a layout effect, so the row and its menu
 *   render before the browser paints the narrow row.
 */

import { createContext, type MouseEvent, type ReactNode, use, useId, useState } from "react";

import { useConst, useSafeLayoutEffect } from "@stealthscale/hooks";

/**
 * Describes an action as the row's menu renders it.
 */
export interface FoldedAction {
  /**
   * Whether the link is the current page, which the menu row marks with `aria-current`.
   */
  readonly current?: boolean | undefined;

  /**
   * Whether the action is disabled.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Target of the link, which renders the menu row as a link.
   */
  readonly href?: string | undefined;

  /**
   * Content of the menu row: the action's icon and words.
   */
  readonly label: ReactNode;

  /**
   * Handler the menu row calls when a reader chooses it.
   */
  readonly onClick?: ((event: MouseEvent<HTMLElement>) => void) | undefined;
}

/**
 * Describes one folded action and the id it registered under.
 */
export interface Entry {
  /**
   * Action as the menu row renders it.
   */
  readonly action: FoldedAction;

  /**
   * Id the action registered under, which is the menu row's value.
   */
  readonly id: string;
}

/**
 * Describes the functions a row provides to the actions in it.
 */
export interface Fold {
  /**
   * Adds an action at the end of the menu, or replaces the one registered under its id in place.
   */
  readonly put: (id: string, action: FoldedAction) => void;

  /**
   * Removes the action registered under an id.
   */
  readonly remove: (id: string) => void;
}

/**
 * Context through which a row provides its fold functions to its actions.
 */
export const FoldContext = createContext<Fold | undefined>(undefined);

/**
 * Returns the entries with an action added at the end, or replaced in place under its id.
 */
function placed(held: readonly Entry[], id: string, action: FoldedAction): readonly Entry[] {
  const at = held.findIndex((entry) => entry.id === id);

  return at === -1 ? [...held, { action, id }] : held.with(at, { action, id });
}

/**
 * Keeps a row's folded actions and the functions that register them.
 *
 * @remarks
 *   The functions keep their identity for the row's lifetime, so an action's registering effect
 *   runs when the action folds or unfolds and not when the row renders.
 * @returns The entries in the order the actions folded, and the functions to provide to them.
 */
export function useFolded(): readonly [entries: readonly Entry[], fold: Fold] {
  const [entries, setEntries] = useState<readonly Entry[]>([]);
  const fold = useConst<Fold>(() => ({
    put: (id, action): void => {
      setEntries((held) => placed(held, id, action));
    },
    remove: (id): void => {
      setEntries((held) => held.filter((entry) => entry.id !== id));
    },
  }));

  return [entries, fold];
}

/**
 * Registers an action with its row while it is folded.
 *
 * @remarks
 *   The first effect adds the entry when the action folds and removes it when the action unfolds or
 *   unmounts. The second runs after every render of a folded action and replaces the entry's data
 *   in place, so an `onClick` written inline keeps the action's place in the menu. An action
 *   outside a row that folds registers nothing.
 * @param folded - Whether the row folds the action into its menu.
 * @param action - The action as the menu row renders it.
 */
export function useFoldable(folded: boolean, action: FoldedAction): void {
  const fold = use(FoldContext);
  const id = useId();

  useSafeLayoutEffect((): (() => void) | undefined => {
    if (!folded || fold === undefined) return undefined;

    return (): void => {
      fold.remove(id);
    };
  }, [fold, folded, id]);

  useSafeLayoutEffect(() => {
    if (folded) fold?.put(id, action);
  });
}
