/**
 * Splits the recipe's variants from the element's props, so a submenu takes the variants of the
 * menu it opens from.
 *
 * @remarks
 *   A slot recipe resolves its variants from the props its root receives. A submenu is a root of
 *   its own, so it would take the recipe's defaults, and a small menu would open a medium submenu.
 *   The root passes the variants down the nest, and a submenu that sets its own overrides them.
 */

import { type RecipeProps } from "@stealthscale/theme/authoring";

import { recipe } from "#menu/recipe.ts";

/**
 * Describes the variants a caller sets on a menu.
 */
export type MenuVariants = RecipeProps<typeof recipe>;

/**
 * Axes of the recipe, read from its variants.
 *
 * @remarks
 *   The compiler types a recipe's variants as optional. This recipe declares them, so the
 *   assertion cannot meet an absent object.
 */
// eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
const AXES = new Set<string>(Object.keys(recipe.variants as object));

/**
 * Splits the recipe's variants from a root's other props.
 *
 * @param props - The root's props without the machine's options.
 * @returns The variants the caller set, and the element's props.
 */
export function splitMenuVariants<Props extends object>(
  props: Props,
): readonly [MenuVariants, Props] {
  const picked: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const [name, value] of Object.entries(props)) {
    if (AXES.has(name)) picked[name] = value;
    else rest[name] = value;
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every key kept is one the caller wrote, split by whether the recipe names it as an axis
  return [picked, rest as Props];
}
