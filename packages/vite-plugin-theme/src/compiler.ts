/**
 * Drives the Panda compiler for the plugin: starts it on a rendered config, generates the runtime,
 * and cleans up the stylesheet it produces.
 *
 * @remarks
 *   The plugin passes the config path explicitly rather than letting the driver search for one. The
 *   config the plugin renders lives under the package's scratch directory, which is not where the
 *   search would look.
 */

import { createNodeDriver, type NodeDriver } from "@pandacss/compiler";
import { createRequire } from "node:module";
import { dirname, join, resolve, sep } from "node:path";

import {
  compilerConfig,
  type Renamed,
  renameSelectors,
  rewriteRuntime,
} from "@stealthscale/pandacss-compiler";
import {
  emptyDir,
  exportTarget,
  manifestAt,
  syncDir,
  writeIfChanged,
} from "@stealthscale/vite-plugin-base";

import { scratchDir, SEPARATOR, THEME_ATTRIBUTE } from "#options.ts";

/**
 * The path segment that tells an installed file apart from one the workspace owns.
 */
const VENDOR = `${sep}node_modules${sep}`;

/**
 * The directory under a package's scratch that codegen writes the runtime into before the sync.
 *
 * @remarks
 *   Codegen rewrites every file on every run, changed or not. Going through a scratch directory and
 *   syncing from it leaves unchanged files with their original mtimes, so a watcher over the
 *   package only wakes for the files a change actually reached.
 */
const STAGING = "runtime";

/**
 * The declaration file for the recipe runtime, which the compiler emits untyped.
 *
 * @remarks
 *   The declaration is written against the recipe types codegen emits alongside it, so a package
 *   that binds a recipe passes the variants it was written with and gets back a function typed the
 *   way the compiler types its own `cva` and `sva`.
 */
const RUNTIME_DECLARATION = [
  "/*",
  " * Declares the compiler's recipe runtime, which it emits without a declaration.",
  " */",
  "",
  "import type {",
  "  RecipeCompoundSelection,",
  "  RecipeConfigVariantMap,",
  "  RecipeRuntimeFn,",
  "  RecipeSelection,",
  "  RecipeVariantRecord,",
  "  SlotRecipeRuntimeFn,",
  "  SlotRecipeVariantRecord,",
  "  SlotRecord,",
  '} from "../types/recipe.d.mts";',
  'import type { SystemStyleObject } from "../types/system.d.mts";',
  "",
  "/**",
  " * Describes the configuration the runtime builds a recipe from.",
  " */",
  "export interface RecipeRuntimeConfig<Variants extends RecipeVariantRecord> {",
  "  className?: string;",
  "  compoundVariants?: ReadonlyArray<",
  "    RecipeCompoundSelection<Variants> & { className?: string | undefined; css: SystemStyleObject }",
  "  >;",
  "  defaultVariants?: RecipeSelection<Variants>;",
  "  name: string;",
  "  variantMap?: RecipeConfigVariantMap<Variants>;",
  "}",
  "",
  "/**",
  " * Describes the configuration the runtime builds a slot recipe from, with the slots it styles.",
  " */",
  "export interface SlotRecipeRuntimeConfig<",
  "  Slot extends string,",
  "  Variants extends SlotRecipeVariantRecord<Slot>,",
  "> {",
  "  className?: string;",
  "  compoundVariants?: ReadonlyArray<",
  "    RecipeCompoundSelection<Variants> & {",
  "      className?: string | undefined;",
  "      classNames?: SlotRecord<Slot, string> | undefined;",
  "      css: SlotRecord<Slot, SystemStyleObject>;",
  "    }",
  "  >;",
  "  defaultVariants?: RecipeSelection<Variants>;",
  "  name: string;",
  "  slots: readonly Slot[];",
  "  variantMap?: RecipeConfigVariantMap<Variants>;",
  "}",
  "",
  "export declare function createRecipe<Variants extends RecipeVariantRecord>(",
  "  config: RecipeRuntimeConfig<Variants>,",
  "): RecipeRuntimeFn<RecipeSelection<Variants>, RecipeConfigVariantMap<Variants>>;",
  "",
  "export declare function createSlotRecipe<",
  "  Slot extends string,",
  "  Variants extends SlotRecipeVariantRecord<Slot>,",
  ">(",
  "  config: SlotRecipeRuntimeConfig<Slot, Variants>,",
  "): SlotRecipeRuntimeFn<Slot, RecipeSelection<Variants>, RecipeConfigVariantMap<Variants>>;",
  "",
].join("\n");

/**
 * The attribute selector the compiler hard-codes for a theme's values.
 */
const ATTRIBUTE = "[data-panda-theme=";

/**
 * The custom property the compiler stamps on the root element of every stylesheet it writes.
 */
const SIGNATURE = /\s*--made-with-panda:[^;}]*;?/gu;

/**
 * A started compiler and the workspace files its config was bundled from.
 */
export interface Compiler {
  /**
   * Absolute paths of the workspace files the config was bundled from.
   *
   * @remarks
   *   Absolute because the watcher these paths are handed to reports absolute paths, while the
   *   driver reports them relative to the package. Installed files are dropped: a config that
   *   imports a library drags in every module that library ships, and nobody is going to edit one.
   */
  dependencies: readonly string[];

  /**
   * The driver, already started on the config.
   */
  driver: NodeDriver;
}

/**
 * Starts a driver on a config file and collects the workspace files the config was bundled from.
 *
 * @remarks
 *   The driver bundles the config before reading it, writing the bundle to the nearest
 *   `node_modules` above the file, or to the system temporary directory when there is none, and
 *   deleting it afterwards. Keeping the rendered config under the package's scratch directory keeps
 *   that bundle out of the workspace.
 */
export async function startCompiler(root: string, configPath: string): Promise<Compiler> {
  const driver = await createNodeDriver({ configPath, cwd: root });
  const scratch = scratchDir(root);
  const dependencies = [...new Set(driver.configDependencies)]
    .map((path) => resolve(root, path))
    .filter((path) => !path.includes(VENDOR) && !path.startsWith(scratch));

  return { dependencies, driver };
}

/**
 * Runs codegen into a scratch directory, adds the missing runtime declaration, rewrites the class
 * names the runtime emits, and syncs the result into `outdir`.
 *
 * @remarks
 *   Emptying the scratch directory first means the sync sees exactly what this run produced: files
 *   codegen no longer writes are deleted from `outdir`, and files whose content did not change keep
 *   their mtimes. Rewriting in the scratch directory keeps a runtime that emits the compiler's own
 *   class names from ever landing in `outdir`.
 * @returns The started compiler, whose dependencies name the files behind its config.
 */
export async function generateRuntime(
  root: string,
  configPath: string,
  outdir: string,
): Promise<Compiler> {
  const compiler = await startCompiler(root, configPath);
  const scratch = join(scratchDir(root), STAGING);

  emptyDir(scratch);
  compiler.driver.codegen({ cwd: root, outdir: scratch });
  writeIfChanged(join(scratch, "recipes", "runtime.d.mts"), RUNTIME_DECLARATION);
  rewriteRuntime(scratch, SEPARATOR);
  syncDir(scratch, outdir);
  emptyDir(scratch);

  return compiler;
}

/**
 * Rewrites the compiler's theme attribute to `data-theme` and drops the property it stamps on the
 * root element.
 *
 * @remarks
 *   The compiler has no option for either. Its `cssgen:done` hook does see the stylesheet, but
 *   `cssgen` returns the unedited string regardless, so the edit has to happen here, on what the
 *   plugin appends.
 */
export function cleaned(css: string): string {
  return css.replaceAll(ATTRIBUTE, `[${THEME_ATTRIBUTE}=`).replaceAll(SIGNATURE, "");
}

/**
 * Cleans a compiled stylesheet and renames every class selector in it to match what the generated
 * runtime emits.
 *
 * @remarks
 *   The recipes and separator the rename works from come out of the driver's resolved config, which
 *   is the same config codegen ran against, so the stylesheet and the runtime cannot disagree.
 * @returns The stylesheet, plus a diagnostic per collision, one for classes whose rules were
 *   dropped, and one for classes kept under a raw condition.
 */
export function rewritten(compiler: Compiler, css: string): Renamed {
  return renameSelectors(cleaned(css), compilerConfig(compiler.driver.config));
}

/**
 * Locates the directory `@pandacss/preset-base` is installed in next to this package.
 *
 * @throws {@link Error} When the preset is not installed next to this package.
 */
function installedBase(): string {
  return dirname(createRequire(import.meta.url).resolve("@pandacss/preset-base/package.json"));
}

/**
 * Resolves the module entry of `@pandacss/preset-base` to an absolute path.
 *
 * @remarks
 *   The rendered config imports the preset by this path. Resolution happens against this package,
 *   not against the application, because the application depends on the plugin and never on the
 *   preset directly. The directory is a parameter so a spec can point at a manifest of its own.
 * @throws {@link Error} When the preset is not installed next to this package or publishes no
 *   entry.
 */
export function basePreset(at: string = installedBase()): string {
  const entry = exportTarget(manifestAt(at) ?? {}, ".", ["import"]);

  if (entry === undefined) throw new Error("@pandacss/preset-base publishes no entry");

  return join(at, entry);
}
