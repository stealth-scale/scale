/**
 * Collects the layers that configure a production build of an application.
 *
 * @remarks
 *   Every layer here configures an artefact a browser downloads: how the bundler splits it, where
 *   the deployment serves it from, and what the build reports about it. The packer configures what
 *   a library publishes.
 */

export { base } from "#build/base.ts";
export { chunks } from "#build/chunks.ts";
export { inventory } from "#build/inventory.ts";
export { licences } from "#build/licences.ts";
export { manifest } from "#build/manifest.ts";
export { preload } from "#build/preload.ts";
export * as preset from "#build/preset.ts";
export { sourcemaps } from "#build/sourcemaps.ts";
