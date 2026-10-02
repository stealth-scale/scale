/**
 * Stubs the media query the video and the carousel read for reduced motion.
 */

import { vi } from "vitest";

/**
 * Describes the media query list the stub returns.
 */
export interface Setting {
  /**
   * Changes the setting and runs the listeners, as the system does.
   */
  readonly change: (reduced: boolean) => void;
}

/**
 * Replaces `window.matchMedia` with a stub that reports `prefers-reduced-motion: reduce` as set or
 * not, and runs its listeners when a case changes it.
 *
 * @remarks
 *   The shared test preset restores the spy after every case.
 * @param reduced - Whether the reader asks for reduced motion at the start.
 * @returns The handle that changes the setting.
 */
export function reducedMotion(reduced: boolean): Setting {
  const listeners = new Set<() => void>();
  const state = { matches: reduced };

  vi.spyOn(globalThis, "matchMedia").mockImplementation(
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the stub implements the members the hook reads: matches and the two listener calls
    () =>
      ({
        addEventListener: (_type: string, listener: () => void) => {
          listeners.add(listener);
        },
        get matches() {
          return state.matches;
        },
        removeEventListener: (_type: string, listener: () => void) => {
          listeners.delete(listener);
        },
      }) as unknown as MediaQueryList,
  );

  return {
    change: (next) => {
      state.matches = next;

      for (const listener of listeners) listener();
    },
  };
}
