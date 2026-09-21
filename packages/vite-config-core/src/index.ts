/**
 * Defines a layer and composes a list of them into one Vite config.
 *
 * @remarks
 *   Three passes settle the result: every preset merges, then every
 *   contribution appends, then every override rewrites. Two layers of
 *   different kinds never compete on their position in the array, and only a
 *   removal reads that position at all.
 * @packageDocumentation
 */

export { resolvingMetadata } from "#compose.ts";
export { type Context, contextOf, type Manifest } from "#context.ts";
export { configuring, type Defining } from "#defaults.ts";
export { type Config, type ConfigFn, defineConfig } from "#define.ts";
export {
  type Apply,
  contribute,
  type Contribution,
  type Extendable,
  type Layer,
  named,
  override,
  type Override,
  owned,
  type Preset,
  preset,
  type Removal,
  remove,
  type Stated,
} from "#layer.ts";
export { located } from "#located.ts";
export { appended } from "#path.ts";
