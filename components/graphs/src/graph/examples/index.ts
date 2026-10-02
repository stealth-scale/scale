/**
 * Collects the graph kit's example modules, each under its file's name, for the specimen to import
 * as one module.
 *
 * @remarks
 *   The review example is left out. The specimen imports it directly for the generated ratio scene,
 *   and the props reader follows a specimen's own imports and the example files they name, not the
 *   modules a barrel re-exports.
 */

export * as changes from "#graph/examples/changes.example.tsx";
export * as editor from "#graph/examples/editor.example.tsx";
export * as judge from "#graph/examples/judge.example.tsx";
export * as pipeline from "#graph/examples/pipeline.example.tsx";
export * as services from "#graph/examples/services.example.tsx";
export * as versions from "#graph/examples/versions.example.tsx";
export * as workflow from "#graph/examples/workflow.example.tsx";
