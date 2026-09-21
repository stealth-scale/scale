/**
 * Rewrites the class the compiler writes for one style declaration into the scheme.
 *
 * @remarks
 *   A class is the conditions, outer to inner, then the utility, joined by a colon. A named
 *   condition is written in kebab-case. A raw selector or at-rule condition, which the compiler
 *   wraps in brackets, is kept as written, because a scheme for a selector would not read better
 *   than the selector. The utility is the property's class, the compiler's separator and the
 *   value, and it is split at the first separator on its own, since two in a row are a negative
 *   value under `-` or a recipe's slot under `_`. The property's class is written in kebab-case,
 *   without the hyphens a custom property opens with, the separator becomes a hyphen, and the
 *   value is sanitised and written in lower kebab-case. A class name resolves no token, so its
 *   case is free, and one case reads as one scheme. A utility without the separator is a recipe's
 *   class, which the scheme wrote already, and is written in kebab-case, so a slot named in camel
 *   case reads the same on both sides.
 */

import { type Separator } from "#recipe.ts";
import { kebab, sanitise } from "#sanitise.ts";

/**
 * Joins the conditions and the utility of a class, and appears inside a raw condition as well.
 */
const JOIN = ":";

/**
 * Opens a raw selector or at-rule condition, and closes it with `]`.
 */
const OPEN = "[";

/**
 * Matches the first separator on its own in a utility, for each separator the compiler accepts.
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
 * Describes a class split into its conditions and its utility.
 */
interface Segments {
  /**
   * The conditions, outer to inner, as the compiler wrote them.
   */
  conditions: string[];
  /**
   * The property's class and the value, as the compiler wrote them.
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
 * Lists the conditions of a class, outer to inner, as the compiler wrote them.
 *
 * @returns Each condition, a raw one in its brackets, or an empty array for a class without one.
 */
export function conditionsOf(pandaClass: string): string[] {
  return segments(pandaClass).conditions;
}

/**
 * Reports whether a class is one the compiler wrote for a style declaration.
 *
 * @remarks
 *   Every class the compiler writes for a declaration carries the separator between the property's
 *   class and the value, because a declaration has both. A class without one that no recipe claims
 *   was written by an author, in a selector or a global style, and the markup carries it as
 *   written.
 */
export function isAtomic(pandaClass: string, separator: Separator): boolean {
  return segments(pandaClass).utility.includes(separator);
}

/**
 * Rewrites a condition: a raw selector or at-rule stays as written, and a named condition is
 * written in kebab-case.
 */
function condition(segment: string): string {
  return segment.startsWith(OPEN) ? segment : kebab(segment);
}

/**
 * Rewrites a utility: the property's class in kebab-case, a hyphen and the value sanitised and in
 * lower kebab-case, or a recipe's class in kebab-case where the separator is absent.
 */
function utility(segment: string, separator: Separator): string {
  const at = segment.search(SPLITS[separator]);

  if (at === -1) return sanitise(kebab(segment));

  const property = kebab(segment.slice(0, at)).replace(DASHES, "");

  return `${property}-${kebab(sanitise(segment.slice(at + 1)))}`;
}

/**
 * Rewrites the class the compiler writes for one declaration, conditions included, into the
 * scheme.
 *
 * @remarks
 *   A class with nothing to replace is returned as it is, so a recipe class the scheme has already
 *   written passes through unchanged.
 * @param pandaClass - The class as the compiler wrote it, conditions included.
 * @param separator - The separator the compiler was configured with, between the property's
 *   class and the value.
 */
export function atomicClass(pandaClass: string, separator: Separator): string {
  const split = segments(pandaClass);

  return [
    ...split.conditions.map((segment) => condition(segment)),
    utility(split.utility, separator),
  ].join(JOIN);
}
