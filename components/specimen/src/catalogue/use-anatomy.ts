/**
 * Loads what a page's components accept, the first time the props band is opened.
 */

import { useEffect, useState } from "react";

import { type Part, parted } from "#catalogue/parted.ts";
import { type Indexed } from "#catalogue/types.ts";

/**
 * Describes what {@link useAnatomy} returns.
 */
export interface Anatomised {
  /**
   * The error the props loader rejected with. Undefined while the loader is pending and after it
   * resolves.
   */
  readonly failure: Error | undefined;

  /**
   * Every part of the page, its props split by kind. Undefined until the loader resolves.
   */
  readonly parts: readonly Part[] | undefined;
}

/**
 * The result returned before the loader is called and while it is pending.
 */
const PENDING: Anatomised = { failure: undefined, parts: undefined };

/**
 * Converts the reason a rejected loader supplied into an Error.
 */
function failed(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason));
}

/**
 * Returns what the page's components accept, loading it once.
 *
 * @remarks
 *   The index puts a page's props behind a loader instead of in the entry, because one page's
 *   props run to tens of kilobytes and a rail listing a hundred pages would otherwise fetch all of
 *   them. The loader is called while the props band is open and not before. An entry with no
 *   loader resolves to an empty array, which is an answer. A loader that rejects is reported as
 *   its error, so the caller can tell a missing table from an empty one.
 * @param entry - The index entry for the page.
 * @param wanted - Whether the props band is open.
 * @returns The parts, the error the loader rejected with, or neither while the loader is pending.
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
