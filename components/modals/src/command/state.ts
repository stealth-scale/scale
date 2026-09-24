/**
 * Tracks the query and the actions that match it.
 *
 * @remarks
 *   The field renders the query, the list renders the matches, and the field announces how many
 *   match, so both parts read one state from the root.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  type ListCollection,
  useFilter,
  useListCollection,
} from "@stealthscale/component-collections";
import { createRequiredContext, useAnnounce, useCallbackRef } from "@stealthscale/hooks";

import { type CommandAction, labelOf, valueOf } from "#command/action.ts";

/**
 * Describes the state every part of a palette reads from the root.
 */
export interface CommandState {
  /**
   * The actions that match the current query, in the order they were given.
   */
  collection: ListCollection<CommandAction>;

  /**
   * The accessible name of the list.
   *
   * @remarks
   *   The list sets it as `aria-label`. The machine points the list's `aria-labelledby` at a label
   *   the palette does not render, so the name has to be set on the list itself.
   */
  label: string;

  /**
   * Narrows the collection to the actions that match a query.
   */
  narrow: (typed: string) => void;

  /**
   * The query typed so far, which the field renders.
   */
  typed: string;
}

/**
 * Creates the context through which the root provides the palette state to its parts.
 */
export const [CommandProvider, useCommand] = createRequiredContext<CommandState>("Command");

/**
 * Describes the options of `useCommandState`.
 */
export interface CommandOptions {
  /**
   * Every command the palette can run.
   */
  actions: readonly CommandAction[];

  /**
   * Formats the announcement made after each keystroke, given the number of remaining matches.
   */
  count: (matches: number) => string;

  /**
   * The accessible name of the list.
   */
  label: string;

  /**
   * The query the palette opens with. Empty when absent.
   */
  query?: string | undefined;
}

/**
 * Filters the actions against the query and announces how many match.
 *
 * @remarks
 *   The hook announces the number of matches after each keystroke, because a screen reader reads
 *   the typed character and not the list's new length. It announces in an effect, after the
 *   collection has settled, so the number matches the rows on screen. Matching ignores case and
 *   accents and reads each action's keywords, so `add` finds `New document`.
 *   A palette that opens with a query narrows the collection to it in an effect.
 * @param options - The actions, the count formatter, the list's name and the opening query.
 * @returns The state the palette's parts read.
 */
export function useCommandState(options: CommandOptions): CommandState {
  const { actions, count, label, query = "" } = options;
  const [typed, setTyped] = useState(query);
  const announce = useAnnounce();
  const folded = useFilter();

  const matching = useCallback(
    (words: string, sought: string, action: CommandAction): boolean =>
      folded.contains(words, sought) || folded.contains(action.keywords ?? "", sought),
    [folded],
  );

  const { collection, narrow } = useListCollection<CommandAction>({
    filter: matching,
    itemToString: labelOf,
    itemToValue: valueOf,
    rows: actions,
  });

  const matches = collection.size;

  useEffect(() => {
    if (query === "") return;

    narrow(query);
  }, [narrow, query]);

  useEffect(() => {
    if (typed === "") return;

    announce(count(matches));
  }, [announce, count, matches, typed]);

  const narrowed = useCallbackRef((next: string): void => {
    setTyped(next);
    narrow(next);
  });

  return useMemo(
    () => ({ collection, label, narrow: narrowed, typed }),
    [collection, label, narrowed, typed],
  );
}
