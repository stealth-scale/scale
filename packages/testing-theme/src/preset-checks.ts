/**
 * Checks the preset a component package publishes against the recipe files under its source.
 *
 * @remarks
 *   The preset is written by hand, and a recipe file it leaves out emits no rules and reports no
 *   error. The files are read as text for the line that exports the recipe, so the check never
 *   evaluates one.
 */

import { existsSync } from "node:fs";

import { type Preset } from "@stealthscale/theme/authoring";

import { recipeFiles } from "#files.ts";
import { gated } from "#gate.ts";
import { camelCased } from "#tokens.ts";

/**
 * Enumerates every check a preset specification can select or skip.
 */
export type PresetCheck = "preset.keys" | "preset.registered" | "preset.slots";

/**
 * Options a preset specification passes alongside the preset.
 */
export interface PresetChecks {
  /**
   * Package's source directory, searched for every `*.recipe.ts` under it.
   */
  at: string;

  /**
   * Checks to skip, each against the reason a reviewer can weigh.
   */
  skip?: Readonly<Partial<Record<PresetCheck, string>>> | undefined;
}

/**
 * One registered recipe, as the checks read it.
 */
interface Registered {
  /**
   * Prefix of every class the recipe emits, where it declares one.
   */
  className?: string | undefined;

  /**
   * Parts the recipe styles, where it is a slot recipe.
   */
  slots?: readonly string[] | undefined;
}

/**
 * Returns the recipes a preset registers, each with the section it is registered under.
 */
function registered(
  preset: Preset,
): ReadonlyArray<readonly [key: string, recipe: Registered, section: string]> {
  const extend = preset.theme?.extend;

  return [
    ...Object.entries(extend?.recipes ?? {}).map(
      ([key, recipe]) => [key, recipe, "recipes"] as const,
    ),
    ...Object.entries(extend?.slotRecipes ?? {}).map(
      ([key, recipe]) => [key, recipe, "slotRecipes"] as const,
    ),
  ];
}

/**
 * Reports every recipe file the preset does not register, and every key no recipe file defines.
 */
function unregistered(preset: Preset, at: string): readonly string[] {
  const files = recipeFiles(at);
  const listed = registered(preset).map(([key]) => key);
  const unlisted = files
    .filter((file) => !listed.includes(file.key))
    .map((file) => `${preset.name} registers no recipe for ${file.file}`);
  const unbacked = listed
    .filter((key) => !files.some((file) => file.key === key))
    .map((key) => `${preset.name} registers ${key}, which no recipe file defines`);

  return unlisted.concat(unbacked);
}

/**
 * Reports every recipe registered under a key that is not its class name in camel case.
 */
function misnamed(preset: Preset): readonly string[] {
  return registered(preset).flatMap(([key, recipe]) =>
    recipe.className === undefined || camelCased(recipe.className) === key
      ? []
      : [`${preset.name} registers ${recipe.className} under ${key}`],
  );
}

/**
 * Reports every slot recipe registered under `recipes`, and every recipe without slots registered
 * under `slotRecipes`.
 */
function slotted(preset: Preset): readonly string[] {
  return registered(preset).flatMap(([key, recipe, section]) => {
    const slots = recipe.slots !== undefined;

    if (section === "recipes" && slots) {
      return [`${preset.name} registers ${key} under recipes, and it has slots`];
    }

    if (section === "slotRecipes" && !slots) {
      return [`${preset.name} registers ${key} under slotRecipes, and it has no slots`];
    }

    return [];
  });
}

/**
 * Runs one check and reports what it found.
 */
type Runner = (preset: Preset, options: PresetChecks) => readonly string[];

/**
 * Each check against the call that performs it, in the order they report.
 */
const RUNNERS: ReadonlyArray<readonly [PresetCheck, Runner]> = [
  ["preset.registered", (preset, options) => unregistered(preset, options.at)],
  ["preset.keys", (preset) => misnamed(preset)],
  ["preset.slots", (preset) => slotted(preset)],
];

/**
 * Runs every check the specification does not skip over one preset.
 *
 * @returns Each violation, prefixed with the check that reported it; one violation on its own
 *   where the source directory does not exist; an empty array for a preset that registers every
 *   recipe file once under its class name.
 */
export function presetViolations(preset: Preset, options: PresetChecks): readonly string[] {
  if (!existsSync(options.at)) return [`${preset.name} has no source directory at ${options.at}`];

  return gated(
    RUNNERS.map(([check, run]) => [check, () => run(preset, options)] as const),
    options,
  );
}
