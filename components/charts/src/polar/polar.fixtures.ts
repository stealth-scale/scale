import { type PieSlice } from "#polar/types.ts";

/**
 * Lists three plans by customers, smallest first: 10%, 30% and 60% of 1,000.
 */
export const SLICES: readonly PieSlice[] = [
  { key: "scale", label: "Scale", value: 100 },
  { key: "starter", label: "Starter", value: 600 },
  { key: "growth", label: "Growth", value: 300 },
];

/**
 * Returns the `name` of every sector inside a container, in document order.
 */
export function sectorsOf(container: Element): string[] {
  return [...container.querySelectorAll(".recharts-pie-sector path")].map(
    (sector) => sector.getAttribute("name") ?? "",
  );
}

/**
 * Returns the text of every share written on a slice inside a container, in document order.
 */
export function sharesOf(container: Element): string[] {
  return [...container.querySelectorAll(".recharts-label-list text")].map(
    (share) => share.textContent,
  );
}

/**
 * Returns the number of arcs in the path of every sector inside a container: one for a slice of a
 * whole pie, two for a slice of a ring.
 */
export function arcsOf(container: Element): number[] {
  return [...container.querySelectorAll(".recharts-pie-sector path")].map(
    (sector) => (sector.getAttribute("d") ?? "").match(/A/gu)?.length ?? 0,
  );
}
