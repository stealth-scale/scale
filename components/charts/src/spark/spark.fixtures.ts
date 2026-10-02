import { vi } from "vitest";

/**
 * Lists a week of daily sign-ups, the fourth day missing.
 */
export const RUN = [12, 18, 15, null, 22, 30, 27];

/**
 * Lists a week of daily changes in seats, two of them falls.
 */
export const CHANGES = [4, -2, 6, 3, -5, 8, 2];

/**
 * Makes every element measure 96 by 24, the middle spark size, where happy-dom lays out nothing.
 */
export function measured(): void {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 96, 24),
  );
}

/**
 * Returns the box of every bar inside a container, in document order.
 */
export function barsOf(
  container: Element,
): Array<{ fill: string; height: number; x: number; y: number }> {
  return [...container.querySelectorAll(".recharts-bar-rectangle path")].map((bar) => ({
    fill: bar.getAttribute("fill") ?? "",
    height: Number(bar.getAttribute("height")),
    x: Number(bar.getAttribute("x")),
    y: Number(bar.getAttribute("y")),
  }));
}
