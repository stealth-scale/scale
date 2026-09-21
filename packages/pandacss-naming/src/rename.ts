/**
 * Rewrites a class the compiler emitted, in a stylesheet or at run time, into the scheme.
 *
 * @remarks
 *   A class is matched against every recipe before anything else, because the compiler's variant
 *   form and an atomic class use the same characters and only the recipes tell them apart. Where
 *   one axis name prefixes another, the longest matching axis wins, so `card--on-off-true`
 *   resolves to the `on-off` axis whichever order the recipe declares the two in.
 */

import { atomicClass, isAtomic } from "#atomic.ts";
import { type CompilerConfig, type Recipe, variantClass } from "#recipe.ts";
import { kebab, sanitise } from "#sanitise.ts";

/**
 * The delimiter the compiler's variant form puts between a recipe's class and an axis.
 */
const VARIANT = "--";

/**
 * Enumerates the classes a recipe writes rules under: the recipe's class, then one class per slot.
 *
 * @returns The recipe's own class alone where it declares no slots.
 */
function owners(recipe: Recipe): string[] {
  return [recipe.className, ...(recipe.slots ?? []).map((slot) => `${recipe.className}__${slot}`)];
}

/**
 * Rewrites a class against one recipe.
 *
 * @remarks
 *   A class that carries the recipe's prefix but names no axis the recipe declares is rewritten as
 *   an atomic class rather than as a variant of the recipe.
 * @returns The class in the scheme, an empty string for a boolean axis at `false`, or undefined
 *   where the recipe does not own the class.
 */
function owned(pandaClass: string, recipe: Recipe, config: CompilerConfig): string | undefined {
  const owner = owners(recipe).find(
    (each) => pandaClass === each || pandaClass.startsWith(`${each}${VARIANT}`),
  );

  if (owner === undefined) return undefined;
  if (pandaClass === owner) return sanitise(kebab(owner));

  const rest = pandaClass.slice(owner.length + VARIANT.length);
  const axis = recipe.axes
    .toSorted((one, other) => other.length - one.length)
    .find((each) => rest.startsWith(`${each}${config.separator}`));

  if (axis === undefined) return atomicClass(pandaClass, config.separator);

  const written = variantClass(owner, axis, rest.slice(axis.length + config.separator.length));

  return written === "" ? "" : atomicClass(written, config.separator);
}

/**
 * Rewrites a class the compiler emitted into the scheme.
 *
 * @remarks
 *   The recipes are tried in the order the configuration declares them, and the first that owns
 *   the class answers. A class no recipe owns is read as an atomic class where it contains the
 *   separator, and as an author's own class otherwise.
 * @returns The class in the scheme, an empty string for a boolean axis at `false`, or the class
 *   unchanged where the compiler did not emit it.
 */
export function rename(pandaClass: string, config: CompilerConfig): string {
  for (const recipe of config.recipes) {
    const written = owned(pandaClass, recipe, config);

    if (written !== undefined) return written;
  }

  return isAtomic(pandaClass, config.separator)
    ? atomicClass(pandaClass, config.separator)
    : pandaClass;
}
