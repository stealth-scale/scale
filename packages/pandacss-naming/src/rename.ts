/**
 * Rewrites a class the compiler wrote, in a stylesheet or at run time, into the scheme.
 *
 * @remarks
 *   A class is read against every recipe first, because the compiler's variant form and an atomic
 *   class share their characters and only the recipes tell them apart. A recipe claims its own
 *   class, one class per slot, and everything written after two hyphens: a variant is rewritten, a
 *   compound the author named passes through, and a slot named in camel case is written in kebab
 *   case as the runtime writes it. A class no recipe claims is an atomic class where it carries the
 *   separator a declaration is written with, and an author's class otherwise, which is left as the
 *   markup carries it. Where one axis name prefixes another, the longest axis that fits is read, so
 *   `on-off` wins over `on` for `card--on-off-true` whatever their order.
 */

import { atomicClass, isAtomic } from "#atomic.ts";
import { type CompilerConfig, type Recipe, variantClass } from "#recipe.ts";
import { kebab, sanitise } from "#sanitise.ts";

/**
 * Separates a recipe's class from an axis in the compiler's variant form.
 */
const VARIANT = "--";

/**
 * Lists the classes a recipe writes rules under: its own, and one per slot.
 */
function owners(recipe: Recipe): string[] {
  return [recipe.className, ...(recipe.slots ?? []).map((slot) => `${recipe.className}__${slot}`)];
}

/**
 * Rewrites a class one recipe owns.
 *
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
 * Rewrites a class the compiler wrote into the scheme, reading it as a recipe's where a recipe
 * claims it, as an atomic class where it carries the separator, and as an author's otherwise.
 *
 * @returns The class in the scheme, an empty string for a boolean axis at `false`, which no
 *   element carries, or the class as written where no compiler wrote it.
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
