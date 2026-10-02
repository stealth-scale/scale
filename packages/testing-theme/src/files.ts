/**
 * Finds the recipe files and the extension files under a package's source by reading them as text.
 *
 * @remarks
 *   A file is matched on the line that exports its recipe or its extension, so a specification
 *   about a preset never evaluates a recipe. A file that exports neither is skipped.
 */

import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

import { camelCased } from "#tokens.ts";

/**
 * Describes one recipe file under a component package's source.
 */
export interface RecipeFile {
  /**
   * Gives the path of the file, relative to the directory searched.
   */
  file: string;

  /**
   * Gives the key the preset lists the recipe under: the file's name in camel case, or the
   * directory's where the file is named `recipe.ts`.
   */
  key: string;

  /**
   * Reports whether the file defines a slot recipe rather than a plain one.
   */
  slotted: boolean;
}

/**
 * Describes one extension file under a theme package's source.
 */
export interface ExtensionFile {
  /**
   * Gives the path of the file, relative to the directory searched.
   */
  file: string;

  /**
   * Gives the key the theme lists the extension under, the file name in camel case.
   */
  key: string;
}

/**
 * Matches the line a recipe file exports its recipe on.
 *
 * @remarks
 *   The pattern stops at the name, because the export can declare a type and put the definition on
 *   the next line. A pattern reaching the definition would leave such a file unread, and the preset
 *   check would then report the registered key as backed by no file and skip a second recipe file.
 */
const RECIPE = /^export const recipe\b/mu;

/**
 * Matches the `defineSlotRecipe` call, wherever in the file it sits.
 */
const SLOTTED = /\bdefineSlotRecipe\s*\(/u;

/**
 * Matches the line an extension file exports its extension on.
 */
const EXTENSION = /^export const extension\b/mu;

/**
 * Gives the suffix of a recipe file named after its own recipe.
 */
const RECIPE_SUFFIX = ".recipe.ts";

/**
 * Gives the name of a recipe file whose directory is named after the recipe.
 */
const RECIPE_FILE = "recipe.ts";

/**
 * Lists the two directories a theme keeps its extensions in.
 */
const EXTENSION_DIRECTORIES = ["recipes", "slot-recipes"];

/**
 * Lists every `.ts` file under a directory in sorted order, relative to it, leaving out the
 * specifications, and returns nothing for a directory that cannot be read.
 */
function sourcesUnder(at: string): readonly string[] {
  try {
    return readdirSync(at, { recursive: true, withFileTypes: true })
      .filter(
        (entry) => entry.isFile() && entry.name.endsWith(".ts") && !entry.name.includes(".spec."),
      )
      .map((entry) => relative(at, join(entry.parentPath, entry.name)))
      .toSorted();
  } catch {
    return [];
  }
}

/**
 * Returns true when a file is named `*.recipe.ts` or `recipe.ts`.
 */
function isRecipeFile(file: string): boolean {
  return file.endsWith(RECIPE_SUFFIX) || basename(file) === RECIPE_FILE;
}

/**
 * Returns the camel-cased key a recipe file registers under, taken from its directory where the
 * file is named `recipe.ts`.
 */
function keyOf(file: string): string {
  const name = basename(file);

  return camelCased(name === RECIPE_FILE ? basename(dirname(file)) : basename(file, RECIPE_SUFFIX));
}

/**
 * Lists every file under a directory named `*.recipe.ts` or `recipe.ts` that exports `recipe`,
 * with the key it registers under and whether it defines slots.
 */
export function recipeFiles(at: string): readonly RecipeFile[] {
  return sourcesUnder(at)
    .filter((file) => isRecipeFile(file))
    .flatMap((file) => {
      const source = readFileSync(join(at, file), "utf8");

      if (!RECIPE.test(source)) return [];

      return [{ file, key: keyOf(file), slotted: SLOTTED.test(source) }];
    });
}

/**
 * Lists every file under a theme's `recipes/` and `slot-recipes/` that exports `extension`, with
 * the key it registers under.
 */
export function extensionFiles(at: string): readonly ExtensionFile[] {
  return EXTENSION_DIRECTORIES.flatMap((directory) =>
    sourcesUnder(join(at, directory)).flatMap((file) => {
      if (!EXTENSION.test(readFileSync(join(at, directory, file), "utf8"))) return [];

      return [{ file: join(directory, file), key: camelCased(basename(file, ".ts")) }];
    }),
  );
}
