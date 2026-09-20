/**
 * Loads what a page's components accept, the first time a reader asks to see it.
 */

import { useEffect, useState } from "react";

import { type Part, parted } from "#catalogue/parted.ts";
import { type Indexed } from "#catalogue/types.ts";

/**
 * Describes what {@link useAnatomy} returns.
 */
export interface Anatomised {
  /**
   * Every part of the page, its props split by kind, or nothing until they have loaded.
   */
  readonly parts: readonly Part[] | undefined;
}

/**
 * Returns what the page's components accept, loading it once.
 *
 * @remarks
 *   The index holds the props behind a loader rather than in the entry, because what one page's
 *   components accept runs to tens of kilobytes and a rail that lists a hundred pages would carry
 *   all of it. The loader is called while the panel that shows them is open and not before.
 *   A page whose props fail to load draws none rather than throwing, and so does a page the index
 *   holds no loader for. The two are the same answer to a reader: there is nothing to show. The
 *   catalogue is a reference, and a reference that will not open because one table is missing is
 *   worse than the missing table.
 * @param entry - The entry the index holds for the page.
 * @param wanted - Whether a reader is looking at the props.
 * @returns The parts, or nothing until they have loaded.
 */
export function useAnatomy(entry: Indexed, wanted: boolean): Anatomised {
  const [parts, setParts] = useState<readonly Part[] | undefined>();
  const load = entry.props;
  const { title } = entry;

  useEffect(() => {
    let held = wanted;

    if (held) {
      void (async (): Promise<void> => {
        const read = await load?.().catch(() => {});

        if (held) setParts(read === undefined ? [] : parted(read, title));
      })();
    }

    return (): void => {
      held = false;
    };
  }, [load, title, wanted]);

  return { parts };
}
