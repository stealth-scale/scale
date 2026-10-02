/**
 * Decides where a released swipe settles.
 */

/**
 * Returns whether a released swipe leaves the actions open: at or past half their width it stays
 * open, and short of half it closes.
 *
 * @param revealed - The width of the actions the swipe revealed, in pixels.
 * @param width - The width of the actions, in pixels.
 * @returns `open` or `closed`. A row without actions, 0px wide, always closes.
 */
export function settleSwipe(revealed: number, width: number): "closed" | "open" {
  return width > 0 && revealed >= width / 2 ? "open" : "closed";
}
