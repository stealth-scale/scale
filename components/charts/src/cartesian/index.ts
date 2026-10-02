/**
 * Exports what the cartesian presets share: their props, their series, their curves, their
 * annotations, and the merge of two periods a comparison plots.
 */

export { type Annotation } from "#cartesian/annotations.ts";
export { type AlignOptions, alignPeriods } from "#cartesian/periods.ts";
export type {
  BarSeries,
  BulletProps,
  CartesianProps,
  CartesianSeries,
  ComboSeries,
  Curve,
  Mark,
  RangeBand,
  ValueAxis,
} from "#cartesian/types.ts";
