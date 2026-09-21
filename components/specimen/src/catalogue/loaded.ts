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
 * Pairs a loaded page with the entry it was loaded for, so a page loaded for one entry is never
 * read as another's.
 */
interface Declared {
  /**
   * The entry the page was loaded for.
   */
  readonly entry: Indexed;

  /**
   * The page as declared, or nothing where it failed to load or declares none.
   */
  readonly page: Specimen | undefined;
}

/**
 * Loads the page an entry names, and keeps what the index later reports as replaced.
 *
 * @remarks
 *   The module is loaded rather than imported, because the index reaches every page through a
 *   dynamic import and the bundler emits one chunk for each. Opening a page is the first time its
 *   components are fetched. The page is kept beside the entry it was loaded for and read back only
 *   while the entry is the same, so a change of entry shows nothing rather than the page before it,
 *   without a state reset in the effect. A hot update the index reports for the page replaces its
 *   module in place.
 * @param entry - The entry the index holds for the page, or nothing where no page is named yet.
 * @returns The page as declared, or nothing until it has loaded or where it fails.
 */
export function useDeclared(entry: Indexed | undefined): Specimen | undefined {
  const [loaded, setLoaded] = useState<Declared | undefined>();

  useEffect(() => {
    let watching = true;

    /**
     * Loads the module and keeps what it declares, unless the entry has moved on.
     */
    async function open(named: Indexed): Promise<void> {
      try {
        const module = await named.load();

        if (watching) setLoaded({ entry: named, page: declared(module) });
      } catch {
        if (watching) setLoaded({ entry: named, page: undefined });
      }
    }

    if (entry !== undefined) void open(entry);

    return (): void => {
      watching = false;
    };
  }, [entry]);

  useUpdated(entry?.id ?? "", (update) => {
    if (entry !== undefined && update.module !== undefined) {
      setLoaded({ entry, page: declared(update.module) });
    }
  });

  return loaded !== undefined && loaded.entry === entry ? loaded.page : undefined;
}

/**
 * Loads the sources of the page an entry names, and keeps what the index later reports as
 * replaced.
 *
 * @remarks
 *   A page whose sources fail to load, or whose loader answers with something that is not a
 *   page's sources, is drawn without them.
 * @param entry - The entry the index holds for the page.
 * @returns The sources, or nothing until they arrive or where they fail.
 */
function useFragments(entry: Indexed): Fragments | undefined {
  const [fragments, setFragments] = useState<Fragments | undefined>();

  useEffect(() => {
    let watching = true;

    /**
     * Loads the sources and keeps them, unless the page has left the screen.
     */
    async function cut(): Promise<void> {
      try {
        const loaded = await entry.fragments?.();

        if (watching) setFragments(fragmentsOf(loaded));
      } catch {
        if (watching) setFragments(undefined);
      }
    }

    void cut();

    return (): void => {
      watching = false;
    };
  }, [entry]);

  useUpdated(entry.id, (update) => {
    if (update.fragments !== undefined) setFragments(fragmentsOf(update.fragments));
  });

  return fragments;
}

/**
 * Loads the page's module and its sources, and keeps what the index later reports as replaced.
 *
 * @remarks
 *   The sources are loaded beside the module, so an edit to a specimen redraws the page and its
 *   sources and nothing else.
 * @param entry - The entry the index holds for the page.
 * @returns The page and its sources, each nothing until it arrives.
 */
export function useLoadedPage(entry: Indexed): Loaded {
  return { fragments: useFragments(entry), page: useDeclared(entry) };
}
