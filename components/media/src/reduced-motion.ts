/**
 * Reads whether the reader asks the system for reduced motion, correct from the first render.
 *
 * @remarks
 *   The read goes through `useSyncExternalStore`, so a client render reads the media query before
 *   the first paint, and a clip or a rotation that must not start by itself never mounts started. A
 *   server render has no window and reports reduced motion, so its markup starts nothing. A change
 *   of the setting renders again.
 */

import { useSyncExternalStore } from "react";

/**
 * Media query a reader matches by asking the system for reduced motion.
 */
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Listens for a change of the setting.
 *
 * @param change - The callback React runs to read the setting again.
 * @returns The function that stops listening.
 */
function subscribe(change: () => void): () => void {
  const query = globalThis.matchMedia(REDUCED_MOTION);

  query.addEventListener("change", change);

  return () => {
    query.removeEventListener("change", change);
  };
}

/**
 * Returns whether the query matches in the window.
 */
function clientSnapshot(): boolean {
  return globalThis.matchMedia(REDUCED_MOTION).matches;
}

/**
 * Returns true, because a server cannot read the setting and motion must not start unasked.
 */
function serverSnapshot(): boolean {
  return true;
}

/**
 * Returns whether the reader asks for reduced motion.
 *
 * @returns `true` while `prefers-reduced-motion: reduce` matches, and on the server.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
}
