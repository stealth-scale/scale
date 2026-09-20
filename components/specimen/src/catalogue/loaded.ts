/**
 * Loads a page's module and its sources for the entry the index holds, and follows the hot
 * updates the index reports for the page.
 */

import { useEffect, useState } from "react";

import { declared } from "#catalogue/declared.ts";
import { type Fragments, type Indexed } from "#catalogue/types.ts";
import { fragmentsOf, useUpdated } from "#catalogue/updated.ts";
import { type Specimen } from "#page.ts";

/**
 * Describes what a page has loaded so far.
 */
export interface Loaded {
  /**
   * The page's sources, once they arrived, or nothing where they failed.
   */
  readonly fragments: Fragments | undefined;

  /**
   * The page as declared, once its module arrived, or nothing where it failed or declares none.
   */
  readonly page: Specimen | undefined;
}

/**
 * Loads the page's module and its sources, and keeps what the index later reports as replaced.
 *
 * @remarks
 *   The module is loaded rather than imported, because the index reaches every page through a
 *   dynamic import and the bundler emits one chunk for each. Opening a page is the first time its
 *   components are fetched. The sources are loaded beside it; a page whose sources fail to load is
 *   drawn without them. A hot update the index reports for the page replaces its module or its
 *   sources in place, so an edit to a specimen redraws the page and nothing else.
 * @param entry - The entry the index holds for the page.
 * @returns The page and its sources, each nothing until it arrives.
 */
export function useLoadedPage(entry: Indexed): Loaded {
  const [page, setPage] = useState<Specimen | undefined>();
  const [fragments, setFragments] = useState<Fragments | undefined>();

  useEffect(() => {
    let watching = true;

    /**
     * Loads the module and keeps what it declares, unless the page has left the screen.
     */
    async function open(): Promise<void> {
      try {
        const module = await entry.load();

        if (watching) setPage(declared(module));
      } catch {
        if (watching) setPage(undefined);
      }
    }

    /**
     * Loads the sources and keeps them, unless the page has left the screen or they fail, or
     * what arrived is not a page's sources.
     */
    async function cut(): Promise<void> {
      try {
        const loaded = await entry.fragments?.();

        if (watching) setFragments(fragmentsOf(loaded));
      } catch {
        if (watching) setFragments(undefined);
      }
    }

    void open();
    void cut();

    return (): void => {
      watching = false;
    };
  }, [entry]);

  useUpdated(entry.id, (update) => {
    if (update.module !== undefined) setPage(declared(update.module));
    if (update.fragments !== undefined) setFragments(fragmentsOf(update.fragments));
  });

  return { fragments, page };
}
