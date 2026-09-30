/**
 * Exposes the comparison of two versions of a graph to the package barrel, which publishes it by
 * name.
 */

export {
  diffGraphs,
  type GraphChange,
  type GraphChangeType,
  type GraphDiff,
  type GraphVersion,
} from "#diff/diff.ts";
