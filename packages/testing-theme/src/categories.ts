/**
 * The vocabulary a recipe is checked against: the category each property draws its values from, the
 * conditions that exist, and the token paths each category defines.
 *
 * @remarks
 *   Categories come from the compiler's base preset at run time; tokens and conditions come from
 *   the preset the recipe is written against, which is the foundation unless a specification names
 *   another. Four properties have to be listed by hand, because the compiler resolves the three
 *   compositions and the virtual palette itself and no utility declares them.
 */

import base from "@pandacss/preset-base";

import { type Preset } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import { leaves } from "#tokens.ts";

/**
 * The three kinds of composition a theme declares. A recipe references any of them by name alone.
 */
export const COMPOSITIONS = ["animationStyles", "layerStyles", "textStyles"] as const;

/**
 * The four properties the compiler resolves itself and no utility declares, against the categories
 * they read: the three compositions and the virtual palette.
 */
const RESOLVED: Readonly<Record<string, string>> = {
  animationStyle: "animationStyles",
  colorPalette: "colors",
  layerStyle: "layerStyles",
  textStyle: "textStyles",
};

/**
 * The key a token group's own value is written under. A recipe leaves it off the path.
 */
const ITSELF = ".DEFAULT";

/**
 * The part of a base-preset utility this module reads: its other names, and where its values come
 * from.
 */
interface Utility {
  /**
   * The property's other names.
   */
  shorthand?: string | string[] | undefined;

  /**
   * The category, either named outright or behind a function that asks the theme for one.
   */
  values?: unknown;
}

/**
 * A utility's values written as a function that asks the theme for one or more categories.
 */
type Asking = (theme: (category: string) => Record<string, string>) => unknown;

/**
 * Narrows a utility's values to the function form.
 */
function isAsking(values: unknown): values is Asking {
  return typeof values === "function";
}

/**
 * Works out which categories one utility takes its values from.
 *
 * @remarks
 *   A utility either names its category outright or asks the theme for it inside a function that
 *   adds further values. To handle the second form the function is called with a stub theme that
 *   records each category asked for and returns an empty record, so the recorded asks are the
 *   categories the utility reads.
 */
function categoriesOf(utility: Utility): readonly string[] {
  if (typeof utility.values === "string") return [utility.values];
  if (!isAsking(utility.values)) return [];

  const asked: string[] = [];

  utility.values((category) => {
    asked.push(category);

    return {};
  });

  return asked;
}

/**
 * The two lookups built from the compiler's base preset, one narrower than the other.
 */
interface Vocabulary {
  /**
   * Every property and shorthand that reads a token, against the category it reads.
   */
  categories: ReadonlyMap<string, string>;

  /**
   * Every property and shorthand the compiler resolves, whether or not it reads a token.
   */
  properties: ReadonlySet<string>;
}

/**
 * Every name a utility answers to: the property itself and each shorthand for it.
 */
function namesOf(property: string, utility: Utility): readonly string[] {
  const shorthand = utility.shorthand ?? [];

  return [property, ...(typeof shorthand === "string" ? [shorthand] : shorthand)];
}

/**
 * Walks the base preset's utilities once and builds both lookups, seeded with the resolved four.
 */
function read(): Vocabulary {
  const categories = new Map<string, string>(Object.entries(RESOLVED));
  const properties = new Set<string>(Object.keys(RESOLVED));

  for (const [property, utility] of Object.entries({ ...base.utilities })) {
    const names = namesOf(property, { ...utility });
    const [category] = categoriesOf({ ...utility });

    for (const name of names) {
      properties.add(name);

      if (category !== undefined) categories.set(name, category);
    }
  }

  return { categories, properties };
}

/**
 * The lookups, once something has asked for them.
 */
let vocabulary: undefined | Vocabulary;

/**
 * Returns the vocabulary, building it on the first call.
 *
 * @remarks
 *   Built lazily rather than at import, so a specification that only reads the classes a recipe
 *   emits does not pay for walking the whole utility map.
 */
function known(): Vocabulary {
  vocabulary ??= read();

  return vocabulary;
}

/**
 * The category a property draws its values from, or undefined where the property reads no token.
 */
export function categoryOf(property: string): string | undefined {
  return known().categories.get(property);
}

/**
 * True where a key is a property the compiler resolves, and false for a condition, a selector, a
 * slot or a breakpoint.
 *
 * @remarks
 *   The test runs positively, against the property set, rather than negatively against a list of
 *   condition names. The compiler derives a condition from every breakpoint, `smDown` and `smToLg`
 *   alongside `sm`, so any such list would go stale the moment a theme declares one more
 *   breakpoint. The property set does not.
 */
export function isProperty(key: string): boolean {
  return known().properties.has(key);
}

/**
 * Every condition a recipe can nest under: the base preset's, plus the ones the given preset
 * extends them with.
 *
 * @param preset - The preset the recipe is written against, the foundation unless named.
 */
export function conditionNames(preset: Preset = foundation): ReadonlySet<string> {
  return new Set(Object.keys({ ...base.conditions, ...preset.conditions?.extend }));
}

/**
 * The token paths of each category, per preset, once something has asked for them.
 */
const PATHS = new WeakMap<Preset, Map<string, ReadonlySet<string>>>();

/**
 * Every path one block of tokens defines. A group's own value gets a second path without the
 * `DEFAULT` suffix, which is how a recipe writes it.
 */
function pathsIn(block: unknown): readonly string[] {
  return leaves(block).flatMap(({ path }) =>
    path.endsWith(ITSELF) ? [path, path.slice(0, -ITSELF.length)] : [path],
  );
}

/**
 * The cache for one preset, created on the first read.
 */
function cacheOf(preset: Preset): Map<string, ReadonlySet<string>> {
  const found = PATHS.get(preset);

  if (found !== undefined) return found;

  const created = new Map<string, ReadonlySet<string>>();

  PATHS.set(preset, created);

  return created;
}

/**
 * Every token path a preset defines in one category, taking the reference tokens, the semantic
 * tokens and any composition sharing the category name.
 *
 * @remarks
 *   The three sources are unioned because a recipe naming a path does not say which of them it came
 *   from.
 */
export function tokenPaths(category: string, preset: Preset = foundation): ReadonlySet<string> {
  const cache = cacheOf(preset);
  const cached = cache.get(category);

  if (cached !== undefined) return cached;

  const extend = { ...preset.theme?.extend };
  const paths = new Set([
    ...pathsIn(Reflect.get({ ...extend.tokens }, category)),
    ...pathsIn(Reflect.get({ ...extend.semanticTokens }, category)),
    ...pathsIn(Reflect.get(extend, category)),
  ]);

  cache.set(category, paths);

  return paths;
}

/**
 * The key the semantic colors are cached under, sharing the per-preset cache with the categories.
 */
const SEMANTIC_COLORS = "semanticTokens.colors";

/**
 * Every semantic color path a preset defines, which is the whole set a recipe may name: family
 * members and palette roles, and nothing from the ramps.
 *
 * @param preset - The preset the recipe is written against, the foundation unless named.
 */
export function semanticColorPaths(preset: Preset = foundation): ReadonlySet<string> {
  const cache = cacheOf(preset);
  const cached = cache.get(SEMANTIC_COLORS);

  if (cached !== undefined) return cached;

  const paths = new Set(pathsIn(preset.theme?.extend?.semanticTokens?.colors));

  cache.set(SEMANTIC_COLORS, paths);

  return paths;
}
