/**
 * Runs a sidebar action when its shortcut is pressed anywhere in the document.
 *
 * @remarks
 *   The listener is on the document, because focus is in the page when the reader presses the
 *   shortcut. It is added once and reads the action through a ref, so an action that changes on
 *   every render does not re-register it.
 */

import { useEffect } from "react";

import { useLiveRef } from "@stealthscale/hooks";

import { chorded } from "#app-shell/keys.ts";

/**
 * Returns the value of `aria-keyshortcuts` for a shortcut: the key with Control, and with Meta.
 *
 * @param shortcut - The key, or `undefined` for no shortcut.
 * @returns The attribute's value, or `undefined` for no shortcut.
 */
export function keysOf(shortcut?: string): string | undefined {
  if (shortcut === undefined) return undefined;

  const key = shortcut.toUpperCase();

  return `Control+${key} Meta+${key}`;
}

/**
 * Runs an action when the shortcut is pressed with Control or Command held.
 *
 * @param shortcut - The key, or `undefined` for no shortcut.
 * @param run - The action.
 */
export function useShortcut(shortcut: string | undefined, run: () => void): void {
  const live = useLiveRef({ run, shortcut });

  useEffect((): (() => void) => {
    /**
     * Runs the action on the shortcut and stops the browser's own use of the keys.
     *
     * @param event - The key press.
     */
    function onKeyDown(event: KeyboardEvent): void {
      if (!chorded(event, live.current.shortcut)) return;

      event.preventDefault();
      live.current.run();
    }

    document.addEventListener("keydown", onKeyDown);

    return (): void => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [live]);
}
