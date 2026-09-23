/**
 * Tracks the query and the actions still matching it.
 *
 * @remarks
 *   The input and the list both read this state and neither owns it. Typing filters the list, and
 *   the size of the filtered list is what the input has to announce, so the two are modelled as one
 *   piece of state rather than as a message passed between siblings.
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
 * The value every part of a palette reads from the root.
 */
export interface CommandState {
  /**
   * The actions matching the current query, in the order they were supplied.
   */
  collection: ListCollection<CommandAction>;

  /**
   * The accessible name of the list.
   *
   * @remarks
   *   Carried through state and applied directly to the list element. The machine otherwise points
   *   the list at a label element the palette never renders, so a name set anywhere else resolves
   *   to nothing and the list is announced without one.
   */
  label: string;

  /**
   * Filters the collection down to the actions matching a query.
   */
  narrow: (typed: string) => void;

  /**
   * The query as typed so far, which the input renders.
   */
  typed: string;
}

/**
 * The provider a root renders and the hook each part calls to read the palette state.
 */
export const [CommandProvider, useCommand] = createRequiredContext<CommandState>("Command");

/**
 * The options the hook takes.
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
   * The query the palette opens holding. Empty when absent.
   */
  query?: string | undefined;
}

/**
 * Filters the actions against the query and announces how many remain.
 *
 * @remarks
 *   The result count is announced rather than left to be noticed. A sighted user watching the list
 *   shrink from eight rows to one gets that information for free; a screen reader user hears only
 *   the character they typed. The announcement is made in an effect, after the collection has
 *   settled, so the number matches what is on screen. Matching folds case and accents according to
 *   the active locale and also searches each action's extra keywords, which is what lets `add` find
 *   `New document`.
 *   A palette may open holding a query, for a page that opens one from something a reader has
 *   already typed. The collection is narrowed to it in an effect rather than built from it, because
 *   the collection is the hook's to filter and the query is only the first thing it is filtered by.
 * @returns The state the palette's parts consume.
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
