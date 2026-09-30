/**
 * Completes a theme's variant with the foundation's values for every token another theme states
 * and this one leaves unstated, so a subtree switched to the theme takes its values from that theme
 * alone.
 *
 * @remarks
 *   The compiler emits a theme's variant under its attribute as the custom properties the variant
 *   states, and a custom property inherits, so a theme that stated no font took the font of the
 *   theme around it. A token no theme states has the foundation's value everywhere already, and a
 *   token every theme states needs nothing, so the fill is the foundation's value for the tokens
 *   the themes disagree on, which keeps the stylesheet within a few lines of its size without it.
 *   A token is the deepest object that contains a `value`, and a theme's token replaces the
 *   foundation's whole, modes included.
 */

import { type Preset, type ThemeVariant } from "#pandacss.ts";

/**
 * Reports whether a value is a group of tokens rather than a token or a leaf value.
 */
function isGroup(value: unknown): value is Readonly<Record<string, unknown>> {
  return (
    typeof value === "object" && value !== null && !Array.isArray(value) && !("value" in value)
  );
}

/**
 * Merges one tree over another, group by group, with the first tree's token applied wherever both
 * state one.
 */
function merged(own: unknown, base: unknown): unknown {
  if (!isGroup(own) || !isGroup(base)) return own === undefined ? base : own;

  const keys = new Set([...Object.keys(base), ...Object.keys(own)]);

  return Object.fromEntries([...keys].map((key) => [key, merged(own[key], base[key])]));
}

/**
 * Keeps, of one tree, the tokens another tree states, and nothing where the trees share none.
 */
function pruned(base: unknown, shape: unknown): unknown {
  if (base === undefined || shape === undefined) return undefined;
  if (!isGroup(base) || !isGroup(shape)) return base;

  const entries = Object.keys(shape)
    .map((key) => [key, pruned(base[key], shape[key])] as const)
    .filter(([, value]) => value !== undefined);

  return entries.length === 0 ? undefined : Object.fromEntries(entries);
}

/**
 * Builds a variant out of two trees, leaving out a category neither states.
 */
function variantOf(tokens: unknown, semanticTokens: unknown): ThemeVariant {
  const variant = {
    ...(tokens === undefined ? {} : { tokens }),
    ...(semanticTokens === undefined ? {} : { semanticTokens }),
  };

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- both trees are typed by the compiler, and a merge of two keeps their shape
  return variant as ThemeVariant;
}

/**
 * Lists every token any of the variants states, as one variant.
 *
 * @returns The union of the variants' trees, whose values are the last variant's and are read for
 *   their shape alone.
 */
export function stated(variants: readonly ThemeVariant[]): ThemeVariant {
  return variants.reduce<ThemeVariant>(
    (union, each) =>
      variantOf(
        merged(each.tokens, union.tokens),
        merged(each.semanticTokens, union.semanticTokens),
      ),
    {},
  );
}

/**
 * Completes a theme's variant with the foundation's value for every token the shape states and
 * the variant does not.
 *
 * @param variant - The theme's own values.
 * @param foundation - The preset of the system package, read for the tokens under its `extend`.
 * @param shape - The tokens any theme states, from `stated`.
 * @returns The variant with the foundation's values for the tokens it leaves unstated among those
 *   the shape names.
 */
export function completed(
  variant: ThemeVariant,
  foundation: Preset,
  shape: ThemeVariant,
): ThemeVariant {
  const extend = foundation.theme?.extend;

  return variantOf(
    merged(variant.tokens, pruned(extend?.tokens, shape.tokens)),
    merged(variant.semanticTokens, pruned(extend?.semanticTokens, shape.semanticTokens)),
  );
}
