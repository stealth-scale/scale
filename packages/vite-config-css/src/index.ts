/**
 * Publishes the Stylelint check a package adds to the tier its Vite
 * configuration extends.
 *
 * @packageDocumentation
 */

export { layers } from "#layers.ts";
export { type Checked } from "#plugin/check.ts";
export * as rules from "#rules/index.ts";
export { warn, type Warned } from "#warn.ts";
export { workspace } from "#workspace.ts";
