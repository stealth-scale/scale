/**
 * Extracts the recipes and the separator the naming scheme needs from the compiler's resolved
 * configuration.
 *
 * @remarks
 *   The driver types `config` as a record of unknown values, so every field is read behind a
 *   guard. A recipe that declares no class name takes its key, as the generated runtime does, and
 *   a configuration that sets no separator gets the compiler's default `_`.
 */

import { type CompilerConfig, type Recipe, type Separator } from "@stealthscale/pandacss-naming";

import { type SerializedConfig } from "#pandacss.ts";

/**
 * The separator the compiler applies where the configuration sets none.
 */
const DEFAULT_SEPARATOR: Separator = "_";

/**
 * The three separators the compiler accepts, as a set for the guard to test against.
 */
const SEPARATORS: ReadonlySet<string> = new Set<Separator>(["_", "=", "-"]);

/**
 * The theme field the recipes are declared under.
 */
const RECIPES = "recipes";

/**
 * The theme field the slot recipes are declared under.
 */
const SLOT_RECIPES = "slotRecipes";

/**
 * Narrows a value to a record of unknown values when it is a plain object.
 *
 * @remarks
 *   An array is rejected, since indexing one by a field name reads nothing useful.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Narrows a value to a separator when it is one of the three the compiler accepts.
 */
function isSeparator(value: unknown): value is Separator {
  return typeof value === "string" && SEPARATORS.has(value);
}

/**
 * Filters an array down to its strings, and returns an empty array for a value that is not an
 * array.
 */
function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const list: unknown[] = value;

  return list.filter((each): each is string => typeof each === "string");
}

/**
 * Converts one recipe definition into the form the naming scheme reads.
 *
 * @remarks
 *   A definition that is not an object is treated as an empty one, so the recipe comes back with
 *   its key as the class name and no axes, rather than throwing.
 * @param key - The name the recipe is declared under, used as the class name where the definition
 *   states none.
 * @param definition - The recipe as the configuration declares it.
 * @param slotted - Whether to read a `slots` list, which only a slot recipe has.
 */
function recipeOf(key: string, definition: unknown, slotted: boolean): Recipe {
  const fields = isRecord(definition) ? definition : {};
  const name = fields["className"];
  const variants = fields["variants"];
  const className = typeof name === "string" ? name : key;
  const axes = isRecord(variants) ? Object.keys(variants) : [];

  return slotted ? { axes, className, slots: strings(fields["slots"]) } : { axes, className };
}

/**
 * Reads every recipe declared under one theme field, in declaration order.
 *
 * @returns One recipe per key, or an empty array when the field is absent or is not an object.
 */
function recipesOf(
  theme: Readonly<Record<string, unknown>>,
  field: string,
  slotted: boolean,
): Recipe[] {
  const definitions = theme[field];

  if (!isRecord(definitions)) return [];

  return Object.entries(definitions).map(([key, definition]) => recipeOf(key, definition, slotted));
}

/**
 * Reads the recipes and the separator out of the compiler's resolved configuration.
 *
 * @param config - The driver's `config`, with every preset merged.
 * @returns Every recipe under `theme.recipes`, then every slot recipe under `theme.slotRecipes`,
 *   and the separator, `_` where the configuration sets none. A configuration with no readable
 *   theme yields no recipes rather than an error.
 */
export function compilerConfig(config: SerializedConfig): CompilerConfig {
  const theme = config["theme"];
  const separator = config["separator"];
  const fields = isRecord(theme) ? theme : {};

  return {
    recipes: [...recipesOf(fields, RECIPES, false), ...recipesOf(fields, SLOT_RECIPES, true)],
    separator: isSeparator(separator) ? separator : DEFAULT_SEPARATOR,
  };
}
