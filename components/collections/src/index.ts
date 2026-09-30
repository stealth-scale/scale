/**
 * Components that render a set of records: data lists, listboxes, tables, grids, timelines,
 * transfer lists, trees, a status matrix, and lists and boards a person reorders by dragging.
 * Every component takes its styling from a slot recipe
 * that a theme can override, and carries no styling of its own. An application installs the recipes
 * by adding the preset at `./theme` to its compiler configuration, and imports the components from
 * here. A component built from parts is exported as a namespace, so its root is `Table.Root`.
 *
 * @packageDocumentation
 */

export * from "#collection/index.ts";
export * as DataList from "#data-list/index.ts";
export * as Listbox from "#listbox/index.ts";
export * as Sortable from "#sortable/index.ts";
export * from "#status-matrix/index.ts";
export * as Table from "#table/index.ts";
export * as Timeline from "#timeline/index.ts";
export * from "#transfer/index.ts";
export * as TreeView from "#tree-view/index.ts";
