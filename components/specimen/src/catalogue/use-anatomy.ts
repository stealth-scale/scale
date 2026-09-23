/**
 * Loads the props of a page's components the first time the props band opens.
 */

import { useEffect, useState } from "react";

import { namespaceOf, type Part, parted } from "#catalogue/parted.ts";
import { type Indexed } from "#catalogue/types.ts";

/**
 * Result of {@link useAnatomy}.
 */
export interface Anatomised {
  /**
   * Error the props loader rejected with. Undefined while the loader is pending and after it
   * resolves.
   */
  readonly failure: Error | undefined;

  /**
   * Every part of the page with its props split by kind. Undefined until the loader resolves.
   */
  readonly parts: readonly Part[] | undefined;
}

/**
 * Result before the loader runs and while it is pending.
 */
const PENDING: Anatomised = { failure: undefined, parts: undefined };

/**
 * Converts the reason of a rejected loader into an Error.
 */
function failed(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason));
}

/**
 * Returns the props of a page's components, loaded once.
 *
 * @remarks
 *   The index keeps the props of a page behind a loader, because the props of one page run to tens
 *   of kilobytes and a rail of a hundred pages would otherwise fetch all of them. The hook calls
 *   the loader only while the props band is open. An entry without a loader resolves to an empty
 *   array. A rejected loader returns its error, so the caller can tell a missing table from an
 *   empty one. Parts are named after the namespace {@link namespaceOf} derives from the page ID.
 * @param entry - Index entry of the page.
 * @param wanted - Whether the props band is open.
 * @returns The parts, the error the loader rejected with, or neither while the loader is pending.
 */
export function useAnatomy(entry: Indexed, wanted: boolean): Anatomised {
  const [held, setHeld] = useState<Anatomised>(PENDING);
  const load = entry.props;
  const namespace = namespaceOf(entry.id);

  useEffect(() => {
    let watching = wanted;

    if (watching) {
      void (async (): Promise<void> => {
        try {
          const read = await load?.();

          if (watching) {
            setHeld({
              failure: undefined,
              parts: read === undefined ? [] : parted(read, namespace),
            });
          }
        } catch (error) {
          if (watching) setHeld({ failure: failed(error), parts: undefined });
        }
      })();
    }

    return (): void => {
      watching = false;
    };
  }, [load, namespace, wanted]);

  return held;
}
