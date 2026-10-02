/**
 * Loads the module for an index entry and applies the hot updates reported for its page.
 */

import { useEffect, useState } from "react";

import { declared } from "#catalogue/declared.ts";
import { type Indexed } from "#catalogue/types.ts";
import { useUpdated } from "#catalogue/updated.ts";
import { type Specimen } from "#page.ts";

/**
 * Describes the page {@link useDeclared} loaded, or the error that stopped it.
 */
export interface Loaded {
  /**
   * The error the module rejected with. Undefined while the module is pending and after it
   * resolves.
   */
  readonly failure: Error | undefined;

  /**
   * The page the module declares. Undefined while the module is pending, after a failure, and when
   * the module declares none.
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
 * The result returned before the module resolves and when no entry is given.
 */
const NOTHING: Loaded = { failure: undefined, page: undefined };

/**
 * Converts the reason a rejected import supplied into an Error.
 */
function failed(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason));
}

/**
 * Loads the page an entry names and replaces it when the index reports a hot update.
 *
 * @remarks
 *   The index reaches every page through a dynamic import, so the bundler emits one chunk per page
 *   and opening a page is the first fetch of its components. The result is stored against the entry
 *   it was loaded for and read back only while that entry is current, so changing the entry returns
 *   no page without a state reset in the effect. A rejected module is reported as its error and not
 *   as a page with no scenes, because a chunk the current deployment does not serve would otherwise
 *   be indistinguishable from an empty page.
 * @param entry - The index entry for the page, or undefined when no page is selected.
 * @returns The page the module declares, the error it rejected with, or neither while the module is
 *   pending.
 */
export function useDeclared(entry: Indexed | undefined): Loaded {
  const [loaded, setLoaded] = useState<Declared | undefined>();

  useEffect(() => {
    let watching = true;

    /**
     * Stores the page the module declares, unless the effect was already cleaned up.
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
