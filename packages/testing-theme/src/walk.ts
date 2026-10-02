/**
 * Walks every style a recipe writes and reports each string alongside the property it sits under
 * and the category that property reads.
 *
 * @remarks
 *   A key counts as a property where the compiler resolves one of that name, and as a group
 *   otherwise, so a breakpoint, a condition, a selector and a slot each keep the property declared
 *   above them in force all the way down to the value. The compiler derives a condition from every
 *   breakpoint, which is why a value under `smDown` is read against the same property as one under
 *   `sm`.
 */

import { categoryOf, isProperty } from "#categories.ts";
import { type Declared } from "#recipe.ts";

/**
 * One string the walk found, with where it was written and what it is read as.
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
 * One condition the recipe nests styles under, with the path it was found at.
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
 * The result of one walk: every condition and every string it found.
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
 * The walk's position: the path so far, and the property and category inherited from above it.
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
 * Appends one key to a path.
 *
 * @remarks
 *   Every walk starts from a named path: `base`, one compound's `css`, or one value of one axis, so
 *   a key is never joined onto an empty string.
 */
function under(path: string, key: string): string {
  return `${path}.${key}`;
}

/**
 * Recurses through one node, pushing what it finds onto the two lists.
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
 * Reads the `css` off one compound variant, or undefined where the entry is not an object.
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
 *   An axis and its values are entered by name rather than walked as styles, because a value can be
 *   called anything and some of those names are properties the compiler resolves. A value named
 *   `fill` reads as the SVG property, which makes the walk treat every string beneath it as a
 *   color. That is how `outlineStyle: "solid"` came to be reported as a color token no theme
 *   defines.
 */
export function walked(recipe: Declared): Walked {
  const strings: Written[] = [];
  const conditions: Nested[] = [];

  /**
   * Starts a walk at one path, with nothing inherited from above it.
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
