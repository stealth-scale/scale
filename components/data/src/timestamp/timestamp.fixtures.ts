/**
 * Fixtures for the timestamp specs: a clock stopped at one instant.
 */

import { vi } from "vitest";

/**
 * Runs a case's steps with the fake clock at an instant, and restores the real clock after them.
 *
 * @param at - The instant the clock reads.
 * @param run - The steps, which return what the case asserts.
 * @returns What the steps return.
 */
export function clocked<T>(at: Date, run: () => T): T {
  vi.useFakeTimers({ now: at });

  try {
    return run();
  } finally {
    vi.useRealTimers();
  }
}
