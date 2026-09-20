/**
 * Publishes many of a thing: the lists, tables and grids that render a set of records. Each
 * component binds a recipe a theme can extend and draws nothing of its own. The recipes reach an
 * application's compiler through the preset under `./theme`, and the components reach its bundle
 * through here. A component with parts is published as a namespace, `Table.Root`.
 *
 * @packageDocumentation
 */

export * from "#collection/index.ts";
export * as Listbox from "#listbox/index.ts";
export * from "#status-matrix/index.ts";
export * as Table from "#table/index.ts";
export * from "#transfer/index.ts";
