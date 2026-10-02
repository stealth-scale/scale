/**
 * Exports what every heat grid shares: the domain of its values, how its scale reads them, the two
 * colors of a diverging scale, and the shapes and sizes of its cells.
 */

export { type HeatShape, type HeatSize } from "#heat/grid.ts";
export {
  type HeatmapColors,
  heatmapDomain,
  type HeatmapDomain,
  type HeatmapScale,
  type Valued,
} from "#heat/scale.ts";
