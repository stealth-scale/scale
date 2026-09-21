/**
 * Rewrites the class the compiler emits for one style declaration into the scheme.
 *
 * @remarks
 *   The compiler joins the conditions and the utility of a class with a colon, and separates the
 *   utility's property from its value with the configured separator. A utility is split at the
 *   first separator standing alone, because two in a row mark a negative value under `-` or a
 *   recipe slot under `_`. A raw selector or at-rule condition is kept as the compiler wrote it,
 *   since the scheme has no shorter form for a selector.
 */

import { type Separator } from "#recipe.ts";
import { kebab, sanitise } from "#sanitise.ts";

/**
 * Separates the conditions from the utility in a class the compiler emitted.
 *
 * @remarks
 *   A raw condition contains this character too, so the split tracks bracket depth.
 */
const JOIN = ":";

/**
 * Character opening a raw selector or at-rule condition, closed by `]`.
 */
const OPEN = "[";

/**
 * Matches the first separator standing alone in a utility, one pattern per separator the compiler
 * accepts.
 */
const SPLITS: Readonly<Record<Separator, RegExp>> = {
  _: /(?<!_)_(?!_)/u,
  "-": /(?<!-)-(?!-)/u,
  "=": /(?<!=)=(?!=)/u,
};

/**
 * Matches the hyphens a custom property's class opens with, which the compiler keeps from the
 * property's name.
 */
const DASHES = /^-+/u;

/**
 * One class split into its conditions and its utility.
 */
interface Segments {
  /**
   * Conditions, outer to inner, as the compiler wrote them.
   */
  conditions: string[];
  /**
   * Property's class and the value, as the compiler wrote them.
   */
  utility: string;
}

/**
 * Splits a class into its conditions and its utility at each colon outside brackets.
 */
function segments(pandaClass: string): Segments {
  const conditions: string[] = [];
  let depth = 0;
  let from = 0;

  for (let at = 0; at < pandaClass.length; at += 1) {
    const char = pandaClass.charAt(at);

    if (char === OPEN) depth += 1;
    else if (char === "]") depth -= 1;
    else if (char === JOIN && depth === 0) {
      conditions.push(pandaClass.slice(from, at));
      from = at + 1;
    }
  }

  return { conditions, utility: pandaClass.slice(from) };
}

/**
 * Returns the conditions of a class, outer to inner, as the compiler wrote them.
 *
 * @returns Each condition, a raw one in its brackets, or an empty array for a class without one.
 */
export function conditionsOf(pandaClass: string): string[] {
  return segments(pandaClass).conditions;
}

/**
 * Reports whether the compiler emitted a class for a style declaration.
 *
 * @remarks
 *   The compiler writes the separator between the property's class and the value, so every class
 *   it emits for a declaration contains one. A class without a separator that no recipe owns is an
 *   author's, written in a selector or a global style.
 */
export function isAtomic(pandaClass: string, separator: Separator): boolean {
  return segments(pandaClass).utility.includes(separator);
}

/**
 * Rewrites one named condition into kebab-case, and returns a raw selector or at-rule condition as
 * the compiler wrote it.
 */
function condition(segment: string): string {
  return segment.startsWith(OPEN) ? segment : kebab(segment);
}

/**
 * Rewrites a utility into the property's class in kebab-case, a hyphen, and the sanitised value in
 * lower kebab-case, or into the recipe's class alone where the separator is absent.
 */
function utility(segment: string, separator: Separator): string {
  const at = segment.search(SPLITS[separator]);

  if (at === -1) return sanitise(kebab(segment));

  const property = kebab(segment.slice(0, at)).replace(DASHES, "");

  return `${property}-${kebab(sanitise(segment.slice(at + 1)))}`;
}

/**
 * Rewrites the class the compiler emitted for one declaration, conditions included, into the
 * scheme.
 *
 * @remarks
 *   A class already written in the scheme maps to itself, so a recipe class passes through
 *   unchanged.
 * @param pandaClass - Class as the compiler wrote it, conditions included.
 * @param separator - Separator the compiler was configured with, between the property's class and
 *   the value.
 */
export function atomicClass(pandaClass: string, separator: Separator): string {
  const split = segments(pandaClass);

  return [
    ...split.conditions.map((segment) => condition(segment)),
    utility(split.utility, separator),
  ].join(JOIN);
}
