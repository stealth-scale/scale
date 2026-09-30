/**
 * Publishes what holds and narrows the rows a list draws.
 *
 * @remarks
 *   `ListCollection` is the engine's own type, re-exported rather than retyped, so a consumer
 *   naming it in a declaration file resolves it without declaring the engine themselves. A tree
 *   view takes the engine's `TreeCollection` as it is: a caller creates one with `new` and replaces
 *   it with the collection that `replace`, `remove`, `insertAfter` or `filter` returns.
 */

export {
  type GridCollection,
  type ListCollection,
  TreeCollection,
  type TreeNode,
} from "@zag-js/collection";
export {
  type Collection,
  type CollectionOptions,
  useListCollection,
} from "#collection/collection.ts";
export { type Filter, type FilterOptions, useFilter } from "#collection/filter.ts";
export { type Grid, type GridOptions, useGridCollection } from "#collection/grid.ts";
