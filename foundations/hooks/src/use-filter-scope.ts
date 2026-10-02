/**
 * Filters rows by the query a search in their scope sets.
 *
 * @remarks
 *   A scope contains a query and the words of the rows registered in it. A scope inside another
 *   registers its rows with the outer scope too, and keeps a row only when the row's words contain
 *   both queries. A row registers the text it renders, read from its element after each render, so
 *   the caller repeats no words in a prop. The scope is an external store: a row reads whether it
 *   is kept and an empty message reads whether anything is, through `useSyncExternalStore`, so a
 *   query re-renders the parts that depend on it and nothing else.
 */

import { createContext, type RefObject, use, useId, useRef, useSyncExternalStore } from "react";

import { useConst } from "#use-const.ts";
import { useSafeLayoutEffect } from "#use-safe-layout-effect.ts";

/**
 * Describes one scope a search filters.
 */
export interface FilterScope {
  /**
   * Returns whether this scope or a scope around it has a query.
   */
  readonly active: () => boolean;

  /**
   * Removes a row from this scope and from every scope around it.
   */
  readonly drop: (id: string) => void;

  /**
   * Returns whether words contain the query of this scope and of every scope around it.
   */
  readonly keeps: (words: string) => boolean;

  /**
   * Registers a row's words in this scope and in every scope around it, or replaces them.
   */
  readonly list: (id: string, words: string) => void;

  /**
   * Returns the number of rows registered in this scope, kept or not.
   */
  readonly listed: () => number;

  /**
   * Returns the number of registered rows whose words this scope keeps.
   */
  readonly matched: () => number;

  /**
   * Sets the query, which the scope matches without regard to case or surrounding spaces.
   */
  readonly setQuery: (query: string) => void;

  /**
   * Registers a listener called on every change to this scope or a scope around it.
   *
   * @returns A function that removes the listener.
   */
  readonly subscribe: (listener: () => void) => () => void;

  /**
   * Returns the words a row registered, or an empty string for a row that has not.
   */
  readonly wordsOf: (id: string) => string;
}

/**
 * Context that provides a scope to the rows, the searches and the messages inside it.
 */
export const FilterContext = createContext<FilterScope | undefined>(undefined);

/**
 * Returns whether words contain a query, without regard to case.
 */
function contains(words: string, query: string): boolean {
  return query === "" || words.toLocaleLowerCase().includes(query);
}

/**
 * Subscribes to nothing, for a part outside every scope.
 *
 * @returns A no-op unsubscribe function.
 */
function detached(): () => void {
  return () => {};
}

/**
 * Creates a scope, inside another scope when one is passed.
 *
 * @param around - The scope this one is inside, if any.
 * @returns The scope, empty and without a query.
 */
export function createFilterScope(around?: FilterScope): FilterScope {
  const words = new Map<string, string>();
  const listeners = new Set<() => void>();
  let query = "";

  /**
   * Calls every listener of this scope.
   */
  const notify = (): void => {
    for (const listener of listeners) listener();
  };

  /**
   * Returns whether words contain this scope's query and every query around it.
   */
  const keeps = (text: string): boolean => contains(text, query) && (around?.keeps(text) ?? true);

  return {
    active: (): boolean => query !== "" || (around?.active() ?? false),
    drop: (id): void => {
      if (!words.delete(id)) return;

      around?.drop(id);
      notify();
    },
    keeps,
    list: (id, text): void => {
      if (words.get(id) === text) return;

      words.set(id, text);
      around?.list(id, text);
      notify();
    },
    listed: (): number => words.size,
    matched: (): number => [...words.values()].filter((text) => keeps(text)).length,
    setQuery: (next): void => {
      const trimmed = next.trim().toLocaleLowerCase();

      if (trimmed === query) return;

      query = trimmed;
      notify();
    },
    subscribe: (listener): (() => void) => {
      listeners.add(listener);

      const outer = around?.subscribe(listener);

      return (): void => {
        listeners.delete(listener);
        outer?.();
      };
    },
    wordsOf: (id): string => words.get(id) ?? "",
  };
}

/**
 * Creates a scope for the life of the component, inside the nearest scope around it.
 *
 * @returns The scope, which the caller provides through `FilterContext`.
 */
export function useFilterScope(): FilterScope {
  const around = use(FilterContext);

  return useConst(() => createFilterScope(around));
}

/**
 * Describes what a row reads from its scope.
 *
 * @typeParam Element - The element the row renders.
 */
export interface FilteredRow<Element extends HTMLElement> {
  /**
   * Whether the scope's query leaves the row out.
   */
  readonly hidden: boolean;

  /**
   * Ref the row puts on its element, whose text the row registers.
   */
  readonly ref: RefObject<Element | null>;
}

/**
 * Registers a row's text with the nearest scope and returns whether the scope keeps it.
 *
 * @remarks
 *   A row outside every scope registers nothing and is never hidden.
 * @typeParam Element - The element the row renders.
 * @returns Whether to hide the row, and the ref for its element.
 */
export function useFilteredRow<Element extends HTMLElement>(): FilteredRow<Element> {
  const scope = use(FilterContext);
  const id = useId();
  const ref = useRef<Element>(null);
  const hidden = useSyncExternalStore(
    scope?.subscribe ?? detached,
    () => scope !== undefined && !scope.keeps(scope.wordsOf(id)),
    () => false,
  );

  useSafeLayoutEffect(() => {
    scope?.list(id, ref.current?.textContent ?? "");
  });

  useSafeLayoutEffect(
    () => (): void => {
      scope?.drop(id);
    },
    [id, scope],
  );

  return { hidden, ref };
}

/**
 * Returns whether the nearest scope or a scope around it has a query.
 *
 * @returns Whether a search filters the caller's rows, and false outside every scope.
 */
export function useFilterActive(): boolean {
  const scope = use(FilterContext);

  return useSyncExternalStore(
    scope?.subscribe ?? detached,
    () => scope?.active() ?? false,
    () => false,
  );
}

/**
 * Returns whether the nearest scope keeps zero rows.
 *
 * @remarks
 *   A scope without a query keeps every registered row, so it is empty only while zero rows are
 *   registered. A row registers after the render that mounts it, so a scope is empty during that
 *   render. Pair the hook with `useFilterActive` to tell a search that matched nothing from a scope
 *   with zero rows.
 * @returns Whether the queries leave zero registered rows, true outside every scope, and false on
 *   the server.
 */
export function useFilterEmpty(): boolean {
  const scope = use(FilterContext);

  return useSyncExternalStore(
    scope?.subscribe ?? detached,
    () => scope === undefined || scope.matched() === 0,
    () => false,
  );
}
