/**
 * Keeps the instant a timestamp measures its distance from.
 */

import { useEffect, useState } from "react";

/**
 * Returns the instant a distance is measured from: `now` when stated, else the clock.
 *
 * @remarks
 *   A stated `now` is returned as given, so rows that share one never drift apart and a server
 *   render matches its hydration. Without it the clock is read at mount, and again every `interval`
 *   milliseconds when one is given. The clock reading is state, because a read during render is a
 *   value the compiler memoizes.
 * @param now - The instant the caller measures from, or nothing.
 * @param interval - The milliseconds between two reads of the clock, or nothing for one read.
 */
export function useNow(now?: Date | number, interval?: number): Date {
  const [read, setRead] = useState(() => new Date());

  useEffect(() => {
    const ticking =
      now === undefined && interval !== undefined
        ? setInterval(() => {
            setRead(new Date());
          }, interval)
        : undefined;

    return (): void => {
      clearInterval(ticking);
    };
  }, [interval, now]);

  return now === undefined ? read : new Date(now);
}
