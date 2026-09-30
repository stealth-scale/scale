/**
 * Fixtures for the truncate specs: a layout in which the text measures as clipped.
 */

import { vi } from "vitest";

/**
 * Makes every element's content measure taller than its box, as a clamped text does.
 *
 * @remarks
 *   The shared test setup restores both getters after each case.
 */
export function clipping(): void {
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(60);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(20);
}
