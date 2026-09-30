/**
 * Builds the tree collection a JSON value renders from, and lists the branches a depth opens.
 *
 * @remarks
 *   The utilities wrap the value in a node at the key path `$`, under a root node with no key, and
 *   key every node below it by its path. They read two of the preview options while they build the
 *   nodes: an array longer than `groupArraysAfterLength` is split into groups, and
 *   `showNonenumerable` adds or leaves out the properties an object does not enumerate.
 */

import {
  getRootNode,
  type JsonNode,
  type JsonNodePreviewOptions,
  jsonPathToValue,
  nodeToString,
} from "@zag-js/json-tree-utils";

import { TreeCollection } from "@stealthscale/component-collections";

/**
 * Returns a node's value in the collection: a hash of its key path written as JSON.
 *
 * @remarks
 *   The path is written as JSON, so a key that contains a dot and the nested keys it spells are two
 *   values. The hash contains letters and digits alone, so the value is a valid part of an ID.
 */
export function valueOf(node: JsonNode): string {
  return jsonPathToValue(JSON.stringify(node.keyPath));
}

/**
 * Returns the collection a value of any type renders from, with the preview options applied to its
 * nodes.
 */
export function collectionOf(
  data: unknown,
  preview: JsonNodePreviewOptions,
): TreeCollection<JsonNode> {
  return new TreeCollection<JsonNode>({
    nodeToString,
    nodeToValue: valueOf,
    rootNode: getRootNode(data, preview),
  });
}

/**
 * Returns the value of every branch at a level of `depth` or less. The value's own node is at level
 * 1, so a depth of 0 returns no value.
 */
export function expandedTo(collection: TreeCollection<JsonNode>, depth: number): string[] {
  return collection.getBranchValues(collection.rootNode, { depth: (level) => level <= depth });
}
