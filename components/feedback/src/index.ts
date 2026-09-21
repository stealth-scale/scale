/**
 * Exposes the components a surface reports its own state with: a notice, an empty result, a
 * placeholder for content still loading. Each one binds a recipe the theme owns and declares no
 * styles of its own, so an application installs the recipes through the preset at `./theme` and
 * imports the components from here.
 *
 * @packageDocumentation
 */

export * as Alert from "#alert/index.ts";
export * as EmptyState from "#empty-state/index.ts";
export * from "#skeleton-text/index.ts";
export * from "#skeleton/index.ts";
