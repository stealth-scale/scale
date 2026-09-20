/**
 * Describes what a theme changes about a recipe, which is anything but the two keys that belong to
 * the component.
 *
 * @remarks
 *   `className` decides what every class a recipe emits is called, and the classes are already in
 *   the markup when a theme is read, so renaming it orphans every one of them. `slots` is a list,
 *   and a list under `extend` is appended to rather than replaced, so a restated one names every
 *   slot twice. `defaultVariants`, `jsx` and `staticCss` decide what is emitted and what a tag
 *   carries, which happens once for every theme rather than under the attribute one theme is
 *   switched by: the build scopes a theme's base, variants and compounds and carries none of the
 *   three. Each of them fails without a report, so each is refused by type. A compound is typed
 *   apart from the recipe's own, because a theme does not carry the component's variant types, and
 *   the compiler's selection over every axis is an index signature that admits no `css` key beside
 *   it.
 */

import { type Recipe, type SlotRecipe } from "#authoring/recipe.ts";
import type { SlotRecord } from "#generated/types/recipe.d.mts";
import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Lists the values a compound matches an axis on, which are the ones a class name carries.
 */
type Matched = boolean | number | ReadonlyArray<boolean | number | string> | string;

/**
 * Refuses the two keys a theme never restates.
 */
interface Owned {
  /**
   * Never stated. The component decides what its classes are called.
   */
  className?: never;

  /**
   * Never stated. The value a caller gets where they pick none is the component's, and it is
   * emitted once rather than under the attribute a theme is switched by.
   */
  defaultVariants?: never;

  /**
   * Never stated. The tags that carry a recipe's props are the component's.
   */
  jsx?: never;

  /**
   * Never stated. The component's anatomy decides what its slots are.
   */
  slots?: never;

  /**
   * Never stated. What a recipe emits whether or not a source file reads it is the component's,
   * and a theme's own list would reach every theme.
   */
  staticCss?: never;
}

/**
 * Describes a compound a theme adds to a recipe: the values it matches on, by axis, and the
 * styles.
 *
 * @remarks
 *   The axes are open, so the index signature has to admit the styles as well. The recipe
 *   helpers and the testing kit hold a value to what a class name carries.
 * @typeParam Styles - The styles the compound applies, for one element or keyed by slot.
 */
export interface ExtensionCompound<Styles = SystemStyleObject> {
  /**
   * The value each axis has to hold for the styles to apply.
   */
  [axis: string]: Matched | Styles | undefined;

  /**
   * Never stated. The class comes from the component's compound for the same selection.
   */
  className?: never;

  /**
   * The styles that apply where every axis the compound names matches.
   */
  css: Styles;
}

/**
 * Carries the compounds a theme adds.
 *
 * @typeParam Styles - The styles each compound applies, for one element or keyed by slot.
 */
interface Compounded<Styles> {
  /**
   * The styles that apply where a combination of values matches, each in the class the component
   * emits for the same selection.
   */
  compoundVariants?: Array<ExtensionCompound<Styles>> | undefined;
}

/**
 * Describes a theme's change to a recipe that draws one element.
 */
export type RecipeExtension = Compounded<SystemStyleObject> &
  Omit<Partial<Recipe>, "className" | "compoundVariants" | "slots"> &
  Owned;

/**
 * Describes a theme's change to a recipe that draws several parts, keyed by slot where the change
 * is a style.
 */
export type SlotRecipeExtension = Compounded<SlotRecord<string, SystemStyleObject>> &
  Omit<Partial<SlotRecipe>, "className" | "compoundVariants" | "slots"> &
  Owned;
