/**
 * Supplies the scratch workspaces, manifests, measurements and plugin drivers a specification runs
 * against.
 *
 * @packageDocumentation
 */

export {
  type Change,
  changed,
  type Command,
  type Configured,
  configured,
  created,
  generated,
  type Graphed,
  type HookContext,
  hookContext,
  loaded,
  removed,
  resolved,
  started,
  transformed,
  updated,
} from "#hook.ts";
export { manifest, type ManifestFields, packageFiles, workspaceFiles } from "#manifest.ts";
export { type Box, type Measured, pixels, seamBetween } from "#measure.ts";
export {
  type ScratchFiles,
  type ScratchWorkspace,
  scratchWorkspace,
  withScratchWorkspace,
  withScratchWorkspaceAsync,
} from "#scratch.ts";
export { declared } from "#stylesheet.ts";
