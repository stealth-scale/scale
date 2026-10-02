/**
 * Stores whether a panel over the page is open, and resets it to closed whenever the shell crosses
 * the panel's fold width.
 *
 * @remarks
 *   A panel over the page is a sheet, and a sheet opens only when the reader asks for it. It starts
 *   closed, and closes again every time the shell becomes narrow, so an application on a phone
 *   does not open with its navigation over the page. The hook stores the width with the state and
 *   compares them during render, which is how React resets state that a prop has made stale. An
 *   effect would show the sheet for one frame before the reset.
 */

import { useCallback, useState } from "react";

/**
 * Describes the stored state: whether the sheet is open, and whether the shell was narrow when the
 * state was set.
 */
interface Revealed {
  /**
   * Whether the shell was narrow when the state was set.
   */
  readonly narrow: boolean;

  /**
   * Whether the sheet is open.
   */
  readonly open: boolean;
}

/**
 * Returns whether the sheet is open during the current narrow period.
 *
 * @param narrow - Whether the shell is too narrow for the panel beside the page.
 * @returns Whether the sheet is open, and its setter.
 */
export function useRevealed(narrow: boolean): readonly [boolean, (open: boolean) => void] {
  const [held, setHeld] = useState<Revealed>({ narrow, open: false });
  const setOpen = useCallback(
    (open: boolean): void => {
      setHeld({ narrow, open });
    },
    [narrow],
  );

  if (held.narrow !== narrow) setHeld({ narrow, open: false });

  return [held.narrow === narrow && held.open, setOpen];
}
