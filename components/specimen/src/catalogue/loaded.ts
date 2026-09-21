/**
 * Loads a page's module for the entry the index holds, and follows the hot updates the index
 * reports for the page.
 */

import { useEffect, useState } from "react";

import { declared } from "#catalogue/declared.ts";
import { type Indexed } from "#catalogue/types.ts";
import { useUpdated } from "#catalogue/updated.ts";
import { type Specimen } from "#page.ts";

/**
 * Describes what {@link useDeclared} returns: the page, or why there is none.
 */
export interface Loaded {
  /**
   * Why the page could not be loaded, or nothing where it loaded or is still loading.
   */
  readonly failure: Error | undefined;

  /**
   * The page as declared, or nothing until it has loaded, where it failed, or where the module
   * declares none.
   */
  readonly page: Specimen | undefined;
}

/**
 * Pairs a loaded page with the entry it was loaded for, so a page loaded for one entry is never
 * read as another's.
 */
interface Declared extends Loaded {
  /**
   * The entry the page was loaded for.
   */
  readonly entry: Indexed;
}

/**
 * Nothing loaded, which is what a reader sees until the module arrives and where no entry is named.
 */
const NOTHING: Loaded = { failure: undefined, page: undefined };

/**
 * Turns whatever a rejected import carried into an error a reader can be shown.
 */
function failed(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason));
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
 *   module in place. A module that fails to load is reported as the failure it was, and not as a
 *   page with nothing on it: a chunk a deployment no longer serves reads the same as an empty page
 *   otherwise, and a reader cannot tell the two apart.
 * @param entry - The entry the index holds for the page, or nothing where no page is named yet.
 * @returns The page as declared, or the failure, or neither until the module has loaded.
 */
export function useDeclared(entry: Indexed | undefined): Loaded {
  const [loaded, setLoaded] = useState<Declared | undefined>();

  useEffect(() => {
    let watching = true;

    /**
     * Loads the module and keeps what it declares, unless the entry has moved on.
     */
    async function open(named: Indexed): Promise<void> {
      try {
        const module = await named.load();

        if (watching) setLoaded({ entry: named, failure: undefined, page: declared(module) });
      } catch (error) {
        if (watching) setLoaded({ entry: named, failure: failed(error), page: undefined });
      }
    }

    if (entry !== undefined) void open(entry);

    return (): void => {
      watching = false;
    };
  }, [entry]);

  useUpdated(entry?.id ?? "", (update) => {
    if (entry !== undefined && update.module !== undefined) {
      setLoaded({ entry, failure: undefined, page: declared(update.module) });
    }
  });

  return loaded !== undefined && loaded.entry === entry ? loaded : NOTHING;
}
