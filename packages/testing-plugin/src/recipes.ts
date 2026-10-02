/**
 * Derives the case of a plugin's recipes: each class name starts with the plugin's id, so no
 * plugin's recipe renames to another plugin's class.
 */

import { type Check } from "#check.ts";
import { type ThemePreset } from "#preset.ts";
import { checking, validateEmpty } from "#resolution.ts";

/**
 * Returns the case that fails where a recipe's class name, or its name where it states no class
 * name, does not start with the plugin's id and a hyphen.
 *
 * @param pluginId - The prefix every class name starts with, before a hyphen.
 * @param preset - The plugin's `./theme` preset, as its web package publishes it.
 */
export function recipeCase(pluginId: string, preset: ThemePreset): Check {
  return {
    name: "every recipe starts with the plugin id",
    run: () =>
      checking(() => {
        const layers = [preset.theme, preset.theme?.extend];
        const names = layers.flatMap((layer) =>
          [
            ...Object.entries(layer?.recipes ?? {}),
            ...Object.entries(layer?.slotRecipes ?? {}),
          ].map(([name, recipe]) => recipe.className ?? name),
        );

        validateEmpty(
          names
            .filter((name) => !name.startsWith(`${pluginId}-`))
            .map((name) => `The recipe ${name} does not start with ${pluginId}-.`),
        );
      }),
  };
}
