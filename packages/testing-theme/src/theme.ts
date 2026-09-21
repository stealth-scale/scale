/**
 * Reads a theme's declarations: colors resolved through the references they name, the palettes the
 * theme fills, the recipes it extends, and the font packages it pulls in.
 *
 * @remarks
 *   A theme writes a reference wherever it means a step of a ramp or another semantic token, and a
 *   theme built on another only declares what differs. Resolving a value therefore follows the
 *   reference through the theme's own tokens and then through the preset it is layered on. The
 *   caller supplies that preset: the same theme over a different base resolves to different colors.
 */

import { type Mode, oklab, type Preset, type Theme } from "@stealthscale/theme/authoring";

import { type Declared } from "#recipe.ts";
import { nodeAt } from "#tokens.ts";

/**
 * The base a theme's references resolve against, for scales the theme itself does not restate.
 */
export interface Resolving {
  /**
   * The preset underneath the theme. Left out when the theme declares every scale itself.
   */
  base?: Preset | undefined;
}

/**
 * The key a token group's own value is written under, and what a reference to the bare group
 * resolves to.
 */
const ITSELF = "DEFAULT";

/**
 * Reads one property off a config value whose type is too loose to index.
 */
function at(value: unknown, name: string): unknown {
  return typeof value === "object" && value !== null ? Reflect.get(value, name) : undefined;
}

/**
 * Walks a dotted path into a block of tokens, taking DEFAULT when the path lands on a group.
 */
function walked(block: unknown, path: readonly string[]): unknown {
  const node = nodeAt(block, path.join("."));

  return node === undefined ? undefined : (at(node, ITSELF) ?? node);
}

/**
 * Picks the color semantic tokens out of a theme, or undefined when it declares none.
 */
export function colorsOf(theme: Theme): unknown {
  return at(theme.variant.semanticTokens, "colors");
}

/**
 * Looks a reference up in the theme's ramps, then its semantic tokens, then the same two on the
 * base preset.
 *
 * @returns The token, or undefined when none of the four holds it, or when the reference is not a
 *   color reference at all.
 */
function pointed(theme: Theme, reference: string, base: Preset | undefined): unknown {
  const [category, ...path] = reference.slice(1, -1).split(".");

  if (category !== "colors" || path.length === 0) return undefined;

  const beneath = base?.theme?.extend;

  return (
    walked(at(theme.variant.tokens, "colors"), path) ??
    walked(colorsOf(theme), path) ??
    walked(at(beneath?.tokens, "colors"), path) ??
    walked(at(beneath?.semanticTokens, "colors"), path)
  );
}

/**
 * Resolves a token's value in one mode, following references until it reaches a color.
 *
 * @remarks
 *   A chain that comes back to a reference it has already followed stops there, so two tokens
 *   pointing at each other resolve to undefined rather than blowing the stack.
 * @returns The color as written, or undefined when the token has no value in that mode or a
 *   reference along the chain points at nothing.
 */
export function resolved(
  theme: Theme,
  value: unknown,
  mode: Mode,
  options: Resolving = {},
): string | undefined {
  /**
   * Resolves one value, carrying the references already followed on this chain.
   */
  function follow(token: unknown, followed: ReadonlySet<string>): string | undefined {
    const stated = at(token, "value") ?? token;
    const chosen = typeof stated === "object" && stated !== null ? at(stated, mode) : stated;

    if (typeof chosen !== "string") return undefined;
    if (!chosen.startsWith("{")) return chosen;
    if (followed.has(chosen)) return undefined;

    return follow(pointed(theme, chosen, options.base), new Set(followed).add(chosen));
  }

  return follow(value, new Set());
}

/**
 * Resolves the color a dotted path names in one mode, or undefined when it resolves to nothing.
 *
 * @remarks
 *   Paths the theme declares are read straight off the theme, taking DEFAULT where the path lands
 *   on a group. Paths the theme leaves to the preset beneath it are turned back into a reference,
 *   which the resolver then follows into that preset.
 */
export function colorAt(
  theme: Theme,
  path: string,
  mode: Mode,
  options: Resolving,
): string | undefined {
  const node = nodeAt(colorsOf(theme), path);
  const token =
    typeof node === "object" && node !== null && !("value" in node)
      ? nodeAt(node, "DEFAULT")
      : node;

  return resolved(theme, token ?? { value: `{colors.${path}}` }, mode, options);
}

/**
 * Resolves the color a dotted path names in one mode and takes its OKLab lightness.
 *
 * @returns The lightness, or undefined when the path resolves to nothing or the color will not
 *   parse.
 */
export function lightnessAt(
  theme: Theme,
  path: string,
  mode: Mode,
  options: Resolving,
): number | undefined {
  const color = colorAt(theme, path, mode, options);

  return color === undefined ? undefined : oklab(color)?.l;
}

/**
 * The role that marks a group of colors as a palette rather than a family of surfaces or inks.
 */
const FILL = "solid";

/**
 * Lists the palettes a theme fills, sorted: every color group that declares a solid.
 */
export function palettesOf(theme: Theme): readonly string[] {
  const colors = colorsOf(theme);

  return Object.keys(typeof colors === "object" && colors !== null ? colors : {})
    .filter((name) => at(at(colors, name), FILL) !== undefined)
    .toSorted();
}

/**
 * Collects the recipes the given presets register, slot recipes included, keyed by registration
 * key.
 *
 * @remarks
 *   A preset is what a component package hands the compiler, so this is the same set of recipes an
 *   application installs. A theme spec passes the result to `violations` as `options.recipes`,
 *   which checks the theme's extensions against what the workspace actually publishes. Entries
 *   without a class name are a theme's own extensions rather than recipes, and are skipped.
 * @param presets - The preset of each package whose recipes the theme may extend.
 */
export function publishedRecipes(
  ...presets: readonly Preset[]
): Readonly<Record<string, Declared>> {
  const found: Record<string, Declared> = {};

  for (const preset of presets) {
    const extend = preset.theme?.extend;

    for (const block of [extend?.recipes, extend?.slotRecipes]) {
      for (const [key, recipe] of Object.entries({ ...block })) {
        const className: unknown = Reflect.get(recipe, "className");

        if (typeof className === "string") found[key] = { ...recipe, className };
      }
    }
  }

  return found;
}

/**
 * Lists the recipe keys a theme's preset extends, sorted, slot recipes included.
 */
export function extendedRecipes(theme: Theme): readonly string[] {
  const extend = theme.preset.theme?.extend;

  return [
    ...Object.keys(extend?.recipes ?? {}),
    ...Object.keys(extend?.slotRecipes ?? {}),
  ].toSorted();
}

/**
 * Lists the packages a theme draws its font faces from, sorted.
 */
export function fontsOf(theme: Theme): readonly string[] {
  return [...theme.fonts].toSorted();
}
