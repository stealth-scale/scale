/**
 * Walks every style a recipe writes and reports each string with the property it is written
 * under and the category that property reads.
 *
 * @remarks
 *   A key is a property where the compiler resolves one of that name, and nests otherwise, so a
 *   breakpoint, a condition, a selector and a slot each carry the property above them down to the
 *   value. The compiler derives a condition from every breakpoint, so a value written under
 *   `smDown` is read against the same property as one written under `sm`.
 */

import { categoryOf, isProperty } from "#categories.ts";
import { type Declared } from "#recipe.ts";

/**
 * Describes one string a recipe writes, and where.
 */
export interface Written {
  /**
   * The category the nearest property reads, or undefined where no property above reads one.
   */
  category: string | undefined;

  /**
   * The dotted keys from the recipe to the string.
   */
  path: string;

  /**
   * The nearest property above the string, or undefined where there is none.
   */
  property: string | undefined;

  /**
   * The string itself.
   */
  value: string;
}

/**
 * Describes one condition a recipe nests styles under, and where.
 */
export interface Nested {
  /**
   * The condition, as the recipe wrote it, with its underscore.
   */
  condition: string;

  /**
   * The dotted keys from the recipe to the condition.
   */
  path: string;
}

/**
 * Carries everything a walk found.
 */
export interface Walked {
  /**
   * Every condition the recipe nests under.
   */
  conditions: readonly Nested[];

  /**
   * Every string the recipe writes.
   */
  strings: readonly Written[];
}

/**
 * Describes where the walk is: the property and category in force, and the path so far.
 */
interface Site {
  /**
   * The category in force.
   */
  category: string | undefined;

  /**
   * The path so far.
   */
  path: string;

  /**
   * The property in force.
   */
  property: string | undefined;
}

/**
 * Joins one more key onto a path.
 *
 * @remarks
 *   Every walk starts at a named path: `base`, one compound's `css`, or one value of one axis. No
 *   key is ever joined onto nothing.
 */
function under(path: string, key: string): string {
  return `${path}.${key}`;
}

/**
 * Walks one node, collecting into the two lists.
 */
function walk(node: unknown, site: Site, strings: Written[], conditions: Nested[]): void {
  if (typeof node === "string") {
    strings.push({
      category: site.category,
      path: site.path,
      property: site.property,
      value: node,
    });

    return;
  }

  if (typeof node !== "object" || node === null) return;

  for (const [key, child] of Object.entries(node)) {
    const path = under(site.path, key);

    if (key.startsWith("_")) conditions.push({ condition: key, path });

    const property = isProperty(key) ? key : site.property;
    const category = isProperty(key) ? categoryOf(key) : site.category;

    walk(child, { category, path, property }, strings, conditions);
  }
}

/**
 * Reads the styles of one compound variant, or undefined where the entry is not an object.
 */
function cssOf(compound: unknown): unknown {
  return typeof compound === "object" && compound !== null
    ? Reflect.get(compound, "css")
    : undefined;
}

/**
 * Walks everything a recipe writes: its base, its variants, and the styles of its compound
 * variants.
 *
 * @remarks
 *   The axis and the value of a variant are walked by name rather than as styles, because a value
 *   is free to be called anything and some of the names a recipe reaches for are also properties
 *   the compiler resolves. A highlight called `fill` read as the SVG property of that name, and
 *   every value under it that the compiler has no category for was then measured as a color:
 *   `outlineStyle: "solid"` was reported as a color token that no theme defines.
 */
export function walked(recipe: Declared): Walked {
  const strings: Written[] = [];
  const conditions: Nested[] = [];

  /**
   * Walks one style object from a path, with no property carried in from above it.
   */
  const styles = (node: unknown, path: string): void => {
    walk(node, { category: undefined, path, property: undefined }, strings, conditions);
  };

  styles(recipe.base, "base");

  (recipe.compoundVariants ?? []).forEach((compound, index) => {
    styles(cssOf(compound), `compoundVariants.${String(index)}.css`);
  });

  for (const [axis, values] of Object.entries(recipe.variants ?? {})) {
    if (typeof values !== "object" || values === null) continue;

    for (const [value, written] of Object.entries(values)) {
      styles(written, `variants.${axis}.${value}`);
    }
  }

  return { conditions, strings };
}
