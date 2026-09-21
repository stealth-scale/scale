/**
 * Publishes the base every bundler plugin in this repository is built on, which
 * runs under Vite, under rolldown, and under anything that accepts a
 * rollup-shaped plugin.
 *
 * @packageDocumentation
 */

export { dependencies, type Dependency, packageAt, resolvedOnGraph } from "#dependencies.ts";
export { exportTarget } from "#exports.ts";
export { emptyDir, syncDir, writeIfChanged } from "#fs.ts";
export { type Imported, imported, type Importer, importer, type Loading } from "#load.ts";
export { type Locking, withLock } from "#lock.ts";
export { type Installed, installedOf, locked } from "#locked.ts";
export { type Bundling, type Plugin, plugin, type Stated } from "#plugin.ts";
export {
  licensed,
  type Licensed,
  type Manifest,
  manifestAt,
  owning,
  type Reached,
  reached,
  text,
} from "#reached.ts";
export { scratchDir } from "#scratch.ts";
export { literal, quoted } from "#serialize.ts";
