/**
 * Configures an application composed from plugins and the standalone page of a plugin, and lints
 * the contract and web packages of a plugin.
 *
 * @packageDocumentation
 */

export { composed } from "#composed.ts";
export { layers } from "#layers.ts";
export * as lint from "#lint/index.ts";
export { standalone, type StandaloneOptions } from "#standalone.ts";
export type { ProductOptions, StandalonePage } from "#types.ts";
