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
