/**
 * Exports the JSON tree view's parts, composed as `JsonTreeView.Root` around `JsonTreeView.Tree`,
 * and the type of the node the tree's functions receive.
 */

export { type JsonNode } from "@zag-js/json-tree-utils";

export { Root, type RootProps } from "#json-tree-view/root.tsx";
export { Tree, type TreeProps } from "#json-tree-view/tree.tsx";
