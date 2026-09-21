/**
 * Reads a recipe's declarations without rendering it.
 *
 * @remarks
 *   A recipe is a plain object, so a specification can read it directly: which variants it offers,
 *   what it defaults to, which slots it styles. These helpers are typed structurally and loosely
 *   rather than against the authoring types, because the authoring types preserve every literal a
 *   recipe was declared with, and a function typed against them accepts one recipe and rejects the
 *   next.
 */

/**
 * The parts of a recipe a specification asks about.
 */
export interface Declared {
  /**
   * The styles every element the recipe applies to starts from.
   */
  base?: unknown;

  /**
   * The prefix on every class the recipe emits.
   */
  className: string;

  /**
   * The variant combinations that style what no single variant styles.
   */
  compoundVariants?: readonly unknown[] | undefined;

  /**
   * The variant values applied when the caller picks none.
   */
  defaultVariants?: unknown;

  /**
   * The tags the compiler extracts variants from, as names or patterns.
   */
  jsx?: ReadonlyArray<RegExp | string> | undefined;

  /**
   * The parts the recipe styles. Absent on a recipe that styles a single element.
   */
  slots?: readonly string[] | undefined;

  /**
   * The values the compiler emits whether or not a JSX literal writes them.
   */
  staticCss?: readonly unknown[] | undefined;

  /**
   * The values each variant axis takes, keyed by axis.
   */
  variants?: Readonly<Record<string, unknown>> | undefined;
}

/**
 * A recipe that styles several parts rather than a single element.
 */
export interface Slotted extends Declared {
  /**
   * The parts the recipe styles.
   */
  slots: readonly string[];
}

/**
 * Returns one variant's values, keyed by value name.
 *
 * @throws {@link Error} When the recipe offers no variant under that name.
 */
function offered(recipe: Declared, axis: string): Readonly<Record<string, unknown>> {
  const values: unknown = recipe.variants?.[axis];

  if (typeof values !== "object" || values === null) {
    throw new Error(`The recipe ${recipe.className} offers no variant called ${axis}.`);
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the object is read by its keys, whatever their types
  return values as Readonly<Record<string, unknown>>;
}

/**
 * Returns the value names one variant offers, sorted.
 *
 * @throws {@link Error} When the recipe offers no variant under that name.
 */
export function valuesOf(recipe: Declared, axis: string): readonly string[] {
  return Object.keys(offered(recipe, axis)).toSorted();
}

/**
 * Returns the name of every variant axis a recipe offers, sorted.
 */
export function axesOf(recipe: Declared): readonly string[] {
  return Object.keys(recipe.variants ?? {}).toSorted();
}

/**
 * Returns the variant values a recipe applies when the caller picks none, keyed by axis, or an
 * empty object when it declares no defaults.
 */
export function defaultsOf(recipe: Declared): Readonly<Record<string, unknown>> {
  const defaults = recipe.defaultVariants;

  if (typeof defaults !== "object" || defaults === null) return {};

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the object is read by its keys, whatever their types
  return defaults as Readonly<Record<string, unknown>>;
}

/**
 * Returns every slot a slot recipe styles, sorted.
 */
export function slotsOf(recipe: Slotted): readonly string[] {
  return [...recipe.slots].toSorted();
}

/**
 * Reads one property off each of a variant's values, in the order given.
 *
 * @remarks
 *   Fixing the order lets a specification assert the shape of a scale, that it rises or that it
 *   has no repeats, without restating the numbers it is made of.
 * @throws {@link Error} When the recipe offers no variant under that name, or the order names a
 *   value the variant does not offer.
 */
export function scaleOf(
  recipe: Declared,
  axis: string,
  property: string,
  order: readonly string[],
): readonly unknown[] {
  const values = offered(recipe, axis);

  return order.map((value) => {
    const styles: unknown = values[value];

    if (typeof styles !== "object" || styles === null) {
      throw new Error(`The variant ${axis} of ${recipe.className} offers no value ${value}.`);
    }

    const read: unknown = Reflect.get(styles, property);

    return read;
  });
}

/**
 * Compares two scale steps numerically, so `2.5` sorts before `10` rather than after it.
 *
 * @returns A negative number when the first step is the smaller.
 */
export function byStep(one: unknown, other: unknown): number {
  return Number(one) - Number(other);
}
