/**
 * Assembles the layers and the tiers every package in this repository
 * configures Vite with. A tier is chosen by what a package is rather than by
 * what it contains, every tier carries the house layers underneath, and the
 * keys a repository states for itself are merged over whatever those layers
 * contributed.
 *
 * @packageDocumentation
 */

export {
  type Apply,
  type Config,
  type ConfigFn,
  configuring,
  contribute,
  type Contribution,
  defineConfig,
  type Defining,
  type Extendable,
  type Layer,
  located,
  type Manifest,
  named,
  override,
  type Override,
  owned,
  type Preset,
  preset,
  type Removal,
  remove,
  resolvingMetadata,
  type Stated,
} from "@stealthscale/vite-config-core";

export * as build from "#build/index.ts";
export * as define from "#define/index.ts";
export * as deps from "#deps/index.ts";
export * as federation from "#federation/index.ts";
export * as fmt from "#fmt/index.ts";
export * as lint from "#lint/index.ts";
export * as pack from "#pack/index.ts";
export * as preview from "#preview/index.ts";
export * as resolve from "#resolve/index.ts";
export * as run from "#run/index.ts";
export * as server from "#server/index.ts";
export * as serving from "#serving/index.ts";
export * as ssr from "#ssr/index.ts";
export * as staged from "#staged/index.ts";
export * as test from "#test/index.ts";
export * as worker from "#worker/index.ts";
