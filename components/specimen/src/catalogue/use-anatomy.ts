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
   * Why the props could not be read, or nothing where they were read or are still loading.
   */
  readonly failure: Error | undefined;

  /**
   * Every part of the page, its props split by kind, or nothing until they have loaded.
   */
  readonly parts: readonly Part[] | undefined;
}

/**
 * The answer before anything was asked for, and while the props are loading.
 */
const PENDING: Anatomised = { failure: undefined, parts: undefined };

/**
 * Turns whatever a rejected loader carried into an error a reader can be shown.
 */
function failed(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason));
}

/**
 * Returns what the page's components accept, loading it once.
 *
 * @remarks
 *   The index holds the props behind a loader rather than in the entry, because what one page's
 *   components accept runs to tens of kilobytes and a rail that lists a hundred pages would carry
 *   all of it. The loader is called while the panel that shows them is open and not before.
 *   A page the index holds no loader for has no parts, which is an answer: there is nothing to
 *   show. A page whose props fail to load is another matter, and the failure is handed back as
 *   what it is, so a reader sees that the table is missing rather than that it is empty.
 * @param entry - The entry the index holds for the page.
 * @param wanted - Whether a reader is looking at the props.
 * @returns The parts, or the failure, or neither until they have loaded.
 */
export function useAnatomy(entry: Indexed, wanted: boolean): Anatomised {
  const [held, setHeld] = useState<Anatomised>(PENDING);
  const load = entry.props;
  const { title } = entry;

  useEffect(() => {
    let watching = wanted;

    if (watching) {
      void (async (): Promise<void> => {
        try {
          const read = await load?.();

          if (watching) {
            setHeld({ failure: undefined, parts: read === undefined ? [] : parted(read, title) });
          }
        } catch (error) {
          if (watching) setHeld({ failure: failed(error), parts: undefined });
        }
      })();
    }

    return (): void => {
      watching = false;
    };
  }, [load, title, wanted]);

  return held;
}
