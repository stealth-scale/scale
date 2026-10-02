/**
 * Declares a plugin's `./theme` preset by the members the recipe case reads.
 */

/**
 * Describes a recipe by the member the case reads.
 */
export interface PresetRecipe {
  /**
   * The class the recipe's elements take.
   */
  readonly className?: string | undefined;
}

/**
 * Describes the recipes one layer of a preset registers, by name.
 */
export interface PresetRecipes {
  /**
   * The recipes of one element each.
   */
  readonly recipes?: Readonly<Record<string, PresetRecipe>> | undefined;

  /**
   * The recipes of several slots each.
   */
  readonly slotRecipes?: Readonly<Record<string, PresetRecipe>> | undefined;
}

/**
 * Describes a preset's theme: the recipes it registers, and the ones it extends the theme with.
 */
export interface PresetTheme extends PresetRecipes {
  /**
   * The recipes the preset extends the theme with.
   */
  readonly extend?: PresetRecipes | undefined;
}

/**
 * Describes a plugin's `./theme` preset by the members the case reads.
 */
export interface ThemePreset {
  /**
   * The preset's theme.
   */
  readonly theme?: PresetTheme | undefined;
}
