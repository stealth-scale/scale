/**
 * Exports the components that report system state: notices, empty results, loading placeholders
 * and loading indicators. Each binds a recipe that the preset at `./theme` registers with an
 * application's style compiler.
 *
 * @packageDocumentation
 */

export * as Alert from "#alert/index.ts";
export * as EmptyState from "#empty-state/index.ts";
export * from "#skeleton-text/index.ts";
export * from "#skeleton/index.ts";
export * from "#spinner/index.ts";
