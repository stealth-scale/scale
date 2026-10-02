/**
 * Entry point for the layers a package that renders adds to a tier from
 * `@stealthscale/vite-config`. A package calls {@link layers} and the repository root calls
 * {@link workspace}.
 *
 * @packageDocumentation
 */

export * as federation from "#federation/index.ts";
export * as fmt from "#fmt/index.ts";
export { layers } from "#layers.ts";
export * as lint from "#lint/index.ts";
export * as plugin from "#plugin/index.ts";
export * as test from "#test/index.ts";
export { workspace } from "#workspace.ts";
