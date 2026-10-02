/**
 * Defines recipes and slot recipes typed against the theme's tokens, and names their compounds.
 *
 * @remarks
 *   Each definition returns the recipe typed over the compiler's generated recipe types, so a
 *   recipe file imports no compiler code and loads both in a component at run time and in a Node
 *   configuration. The generated types check every value against the foundation's tokens. The
 *   definitions write each compound's `className`, because the compiler emits the compound's styles
 *   under that class and the runtime reads it from the same object.
 */

import { compoundClass, slotClass } from "@stealthscale/pandacss-naming";

import type {
  RecipeCompoundSelection,
  RecipeSelection,
  RecipeVariantRecord,
  SlotRecipeVariantRecord,
  SlotRecord,
} from "#generated/types/recipe.d.mts";
import type { SystemStyleObject } from "#generated/types/system.d.mts";
import { type RecipeRule } from "#pandacss.ts";
import { recordOf } from "#record.ts";

/**
 * Describes the recipe fields other than styles.
 */
interface Meta {
  /**
   * Prefix of every class the recipe emits.
   */
  className: string;

  /**
   * Purpose of the recipe, copied into the generated documentation.
   */
  description?: string;

  /**
   * JSX tags that take the recipe's variant props, as names or patterns. Without it the compiler
   * extracts only a tag named after the recipe.
   */
  jsx?: Array<RegExp | string>;

  /**
   * Variant values emitted whether source code references them or not, for values a component
   * picks at run time.
   */
  staticCss?: RecipeRule[];
}

/**
 * Describes the name of a compound and the class its styles are emitted under.
 */
interface Named {
  /**
   * Class of the compound. `defineRecipe` and `defineSlotRecipe` write it as `<class>--<name>`,
   * and the compiler emits the compound's styles under it.
   */
  className?: string | undefined;

  /**
   * Author's name for the compound, applied to the element as `button--hero`. The definitions
   * remove it after writing the class, because the compiler and the runtime read every other key
   * of a compound as an axis.
   */
  name?: string | undefined;
}

/**
 * Describes the styles of a compound in a recipe with one element.
 */
interface Styled {
  /**
   * Styles applied where every axis the compound names matches.
   */
  css: SystemStyleObject;
}

/**
 * Describes the styles of a compound in a slot recipe, keyed by slot.
 *
 * @typeParam Slots - Every slot the recipe styles.
 */
interface SlotStyled<Slots extends string> {
  /**
   * Styles applied where every axis the compound names matches, keyed by slot.
   */
  css: SlotRecord<Slots, SystemStyleObject>;
}

/**
 * Describes one compound of a recipe with one element: the values it matches, its class and its
 * styles.
 *
 * @typeParam Variants - Each axis of the recipe and its values.
 */
export type Compound<Variants extends RecipeVariantRecord> = Named &
  RecipeCompoundSelection<Variants> &
  Styled;

/**
 * Describes one compound of a slot recipe.
 *
 * @typeParam Slots - Every slot the recipe styles.
 * @typeParam Variants - Each axis of the recipe and its values.
 */
export type SlotCompound<
  Slots extends string,
  Variants extends SlotRecipeVariantRecord<Slots>,
> = Named & RecipeCompoundSelection<Variants> & SlotStyled<Slots>;

/**
 * Describes a recipe for a component with one element.
 *
 * @typeParam Variants - Each axis of the recipe and its values.
 */
export interface Recipe<Variants extends RecipeVariantRecord = RecipeVariantRecord> extends Meta {
  /**
   * Styles of every instance.
   */
  base?: SystemStyleObject | undefined;

  /**
   * Styles applied where a combination of values matches, each under its own class.
   */
  compoundVariants?: Array<Compound<Variants>> | undefined;

  /**
   * Value of each axis when the caller passes none.
   */
  defaultVariants?: RecipeSelection<Variants> | undefined;

  /**
   * Each axis, its values and the styles of each value.
   */
  variants?: undefined | Variants;
}

/**
 * Describes a recipe for a component with several slots.
 *
 * @typeParam Slots - Every slot the recipe styles.
 * @typeParam Variants - Each axis of the recipe and its values.
 */
export interface SlotRecipe<
  Slots extends string = string,
  Variants extends SlotRecipeVariantRecord<Slots> = SlotRecipeVariantRecord<Slots>,
> extends Meta {
  /**
   * Styles of every instance, keyed by slot.
   */
  base?: SlotRecord<Slots, SystemStyleObject> | undefined;

  /**
   * Styles applied where a combination of values matches, each under its own class per slot.
   */
  compoundVariants?: Array<SlotCompound<Slots, Variants>> | undefined;

  /**
   * Value of each axis when the caller passes none.
   */
  defaultVariants?: RecipeSelection<Variants> | undefined;

  /**
   * Every slot the recipe styles.
   */
  slots: Slots[];

  /**
   * Each axis, its values and the styles of each value by slot.
   */
  variants?: undefined | Variants;
}

/**
 * Derives the props a recipe's variants give a component.
 *
 * @remarks
 *   The binding derives these for the components it creates. A component the binding cannot type,
 *   such as a list with its own type parameter, declares its props and takes the variant props
 *   from this type.
 * @typeParam Bound - The recipe to read.
 */
export type RecipeProps<Bound> =
  Bound extends SlotRecipe<string, infer Variants>
    ? RecipeSelection<Variants>
    : Bound extends Recipe<infer Variants>
      ? RecipeSelection<Variants>
      : never;

/**
 * Separator the compiler writes between an axis and its value in a class name.
 *
 * @remarks
 *   The build plugin configures the compiler with the same character, so the class the runtime
 *   writes matches the stylesheet's selector. It is the compiler's default underscore, which no
 *   axis or value contains, so the first underscore splits the axis from the value.
 */
export const SEPARATOR = "_";

/**
 * Infix the compiler writes between a class and the selection of an unnamed compound.
 */
const COMPOUND = "--compound__";

/**
 * Keys of a compound that are not axes.
 */
const UNMATCHED = new Set(["className", "css", "name"]);

/**
 * Formats one matched value as a class name segment, or returns undefined for a value that is not
 * a string, a number, a boolean or an array of them.
 *
 * @remarks
 *   An array lists the values the axis may take, joined by a bar.
 */
function written(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    const each = value.map((one: unknown) => written(one));

    return each.includes(undefined) ? undefined : each.join("|");
  }

  return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
    ? String(value)
    : undefined;
}

/**
 * Lists the axes a compound matches, sorted, with the value of each.
 */
function matched(compound: object): ReadonlyArray<readonly [axis: string, value: unknown]> {
  return Object.keys(compound)
    .filter((axis) => !UNMATCHED.has(axis))
    .toSorted()
    .map((axis) => [axis, Reflect.get(compound, axis)] as const);
}

/**
 * Formats the selection of a compound in the compiler's naming scheme, or returns undefined when a
 * matched value cannot be part of a class name.
 *
 * @remarks
 *   The axes are sorted, each pair is written as axis, separator and value, array values are joined
 *   by a bar, and the pairs are joined by two underscores.
 * @param compound - The compound. Every key except `css` and `className` is read as an axis.
 */
export function compoundSelection(compound: object): string | undefined {
  const pairs = matched(compound).map(([axis, value]) => {
    const one = written(value);

    return one === undefined ? undefined : `${axis}${SEPARATOR}${one}`;
  });

  return pairs.includes(undefined) ? undefined : pairs.join("__");
}

/**
 * Returns the class the compiler emits an unnamed compound's styles under.
 *
 * @remarks
 *   A named compound takes its class from the naming scheme instead. The build plugin gives a
 *   theme's compound with the same selection the same class, so the testing kit reports an unnamed
 *   compound in this form.
 * @param className - The recipe's class, or the slot's class for a slot recipe.
 * @param compound - The compound. Every key except `css`, `className` and `name` is read as an
 *   axis.
 * @throws {@link Error} When the compound matches an axis on an object.
 */
export function compoundClassName(className: string, compound: object): string {
  const pairs = matched(compound).map(([axis, value]) => {
    const one = written(value);

    if (one === undefined) {
      throw new Error(
        `${axis} is matched on a value of type ${typeof value}, which cannot be part of a class name`,
      );
    }

    return `${axis}${SEPARATOR}${one}`;
  });

  return `${className}${COMPOUND}${pairs.join("__")}`;
}

/**
 * Returns a compound's class: from its name when it has one, and from its selection otherwise.
 */
function classOf(className: string, compound: Named & object): string {
  return compound.name === undefined
    ? compoundClassName(className, compound)
    : compoundClass(className, compound.name);
}

/**
 * Returns a compound with its `className` written and its `name` removed.
 *
 * @typeParam Variants - Each axis of the recipe and its values.
 */
function named<Variants extends RecipeVariantRecord>(
  className: string,
  compound: Compound<Variants>,
): Compound<Variants> {
  const built: Compound<Variants> = { ...compound, className: classOf(className, compound) };

  delete built.name;

  return built;
}

/**
 * Returns a compound restricted to one slot, with the slot's `className` written and its `name`
 * removed.
 *
 * @remarks
 *   The slot class comes from `slotClass`, which kebab-cases the slot the way the binding writes
 *   it, so a compound named `contrasted` on the `closeTrigger` slot of `alert` declares
 *   `alert__close-trigger--contrasted`.
 * @typeParam Slots - Every slot the recipe styles.
 * @typeParam Variants - Each axis of the recipe and its values.
 */
function forSlot<Slots extends string, Variants extends SlotRecipeVariantRecord<Slots>>(
  className: string,
  slot: Slots,
  compound: SlotCompound<Slots, Variants>,
  styles: SystemStyleObject,
): SlotCompound<Slots, Variants> {
  const built: SlotCompound<Slots, Variants> = {
    ...compound,
    className: classOf(slotClass(className, slot), compound),
    css: recordOf([slot], () => styles),
  };

  delete built.name;

  return built;
}

/**
 * Splits a compound into one compound per slot it styles, each with the slot's class.
 *
 * @remarks
 *   The compiler applies a compound's one class to every slot the compound styles, so a compound
 *   with styles for two slots under one class applies both slots' declarations to each slot.
 * @typeParam Slots - Every slot the recipe styles.
 * @typeParam Variants - Each axis of the recipe and its values.
 */
function split<Slots extends string, Variants extends SlotRecipeVariantRecord<Slots>>(
  className: string,
  slots: readonly Slots[],
  compound: SlotCompound<Slots, Variants>,
): Array<SlotCompound<Slots, Variants>> {
  return slots.flatMap((slot) => {
    const styles = compound.css[slot];

    return styles === undefined ? [] : [forSlot(className, slot, compound, styles)];
  });
}

/**
 * Returns a recipe for a component with one element, typed, with a class on every compound.
 *
 * @remarks
 *   The `const` type parameter keeps the literal values of each variant, from which the binding
 *   types a component's props. The compiler's own helper widens them to `string`. A recipe without
 *   compounds is returned unchanged.
 * @typeParam Variants - Each axis of the recipe and its values.
 */
export function defineRecipe<const Variants extends RecipeVariantRecord>(
  recipe: Recipe<Variants>,
): Recipe<Variants> {
  const { compoundVariants } = recipe;

  if (compoundVariants === undefined) return recipe;

  return {
    ...recipe,
    compoundVariants: compoundVariants.map((compound) => named(recipe.className, compound)),
  };
}

/**
 * Returns a recipe for a component with several slots, typed, with every compound split per slot
 * and given the slot's class.
 *
 * @typeParam Slots - Every slot the component renders.
 * @typeParam Variants - Each axis of the recipe and its values.
 */
export function defineSlotRecipe<
  const Slots extends string,
  const Variants extends SlotRecipeVariantRecord<Slots>,
>(recipe: SlotRecipe<Slots, Variants>): SlotRecipe<Slots, Variants> {
  const { compoundVariants } = recipe;

  if (compoundVariants === undefined) return recipe;

  return {
    ...recipe,
    compoundVariants: compoundVariants.flatMap((compound) =>
      split(recipe.className, recipe.slots, compound),
    ),
  };
}

/**
 * Returns a style object unchanged and typed, for a fragment two recipes share.
 */
export function defineStyles(styles: SystemStyleObject): SystemStyleObject {
  return styles;
}
