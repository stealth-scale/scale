/**
 * Handles the keys of a panel anywhere in the document.
 *
 * @remarks
 *   Escape closes an open panel over the page. A shortcut toggles a panel with the platform's
 *   modifier held, such as ⌘B for the navigation. The listener is on the document, because focus
 *   is in the page, not in the panel, when the reader presses the shortcut.
 */

import { useEffect } from "react";

import { useLiveRef } from "@stealthscale/hooks";

/**
 * Describes the panel state the listener reads.
 */
export interface Keyed {
  /**
   * Whether the panel is shown.
   */
  readonly open: boolean;

  /**
   * Whether the panel is over the page, which is when Escape closes it.
   */
  readonly overlaid: boolean;

  /**
   * Shows or hides the panel.
   */
  readonly setOpen: (open: boolean) => void;

  /**
   * Key that toggles the panel with the platform's modifier held, or `undefined`.
   */
  readonly shortcut: string | undefined;
}

/**
 * Returns whether a key press is the shortcut with Control or Command held.
 */
export function chorded(event: KeyboardEvent, shortcut: string | undefined): boolean {
  return shortcut !== undefined && (event.ctrlKey || event.metaKey) && event.key === shortcut;
}

/**
 * Listens for the keys that open and close one panel.
 *
 * @remarks
 *   The listener is added once and reads the panel through a ref, so a panel whose state changes on
 *   every key press does not re-register it.
 * @param panel - The panel's state and setter.
 */
export function useKeys(panel: Keyed): void {
  const live = useLiveRef(panel);

  useEffect((): (() => void) => {
    /**
     * Handles one key press.
     *
     * @param event - The key press.
     */
    function onKeyDown(event: KeyboardEvent): void {
      const { open, overlaid, setOpen, shortcut } = live.current;

      if (overlaid && open && event.key === "Escape") {
        setOpen(false);
      } else if (chorded(event, shortcut)) {
        event.preventDefault();
        setOpen(!open);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return (): void => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [live]);
}
