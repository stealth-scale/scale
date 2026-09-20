/**
 * Renders every color stated in both modes as one `light-dark()` value, so a subtree switched to
 * either mode reads every color from that mode.
 *
 * @remarks
 *   A color stated as a pair compiles to its light value on the root and its dark value under
 *   the dark attribute and the dark preference. That declares the dark side on the element that
 *   switches to it, so dark inside light works, and declares the light side nowhere but the root,
 *   so light inside dark does not. Written as `light-dark(light, dark)`, a color is declared once
 *   and evaluated where it is used, against the `color-scheme` of that element, which the
 *   foundation's global styles set from the mode attribute and the reader's preference. A custom
 *   property holding the function is inherited unevaluated, so an alias of one and a chain of
 *   aliases evaluate at the use site too. Measured in Chromium 153 and Firefox 155: a light
 *   subtree inside a dark one inside a light page reads each side's value, aliases included.
 *   Only the colors are rendered this way. A shadow states its mode in the color it is drawn in,
 *   and every other category states no mode.
 */

/**
 * The group whose tokens are rendered.
 */
const COLORS = "colors";

/**
 * The two sides a color states, light first.
 */
const SIDES = ["base", "_dark"] as const;

/**
 * Reports whether a value is a plain object, which a regular expression a recipe names is not.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  if (typeof value !== "object" || value === null) return false;

  const prototype: unknown = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

/**
 * Reads the two sides of a token's value, or nothing where the value states anything else.
 */
function sidesOf(value: unknown): [light: string, dark: string] | undefined {
  if (!isRecord(value) || Object.keys(value).length !== SIDES.length) return undefined;

  const [light, dark] = SIDES.map((side) => value[side]);

  return typeof light === "string" && typeof dark === "string" ? [light, dark] : undefined;
}

/**
 * Renders one token's value: a pair as `light-dark()`, an equal pair as the one value, and
 * anything else as written.
 */
function rendered(value: unknown): unknown {
  const sides = sidesOf(value);

  if (sides === undefined) return value;

  const [light, dark] = sides;

  return light === dark ? light : `light-dark(${light}, ${dark})`;
}

/**
 * Walks a tree, rendering every token under a `colors` group.
 */
function walked(tree: unknown, inColors: boolean): unknown {
  if (Array.isArray(tree)) return tree.map((each) => walked(each, inColors));
  if (!isRecord(tree)) return tree;
  if (inColors && "value" in tree) return { ...tree, value: rendered(tree["value"]) };

  return Object.fromEntries(
    Object.entries(tree).map(([key, value]) => [key, walked(value, inColors || key === COLORS)]),
  );
}

/**
 * Renders every color a tree states in both modes as one `light-dark()` value.
 *
 * @remarks
 *   The tree is a preset, a variant or anything the compiler reads. A token is an object carrying
 *   `value`, and one under a `colors` group whose value names exactly `base` and `_dark` as
 *   strings is rendered. A value under any other group, or naming any other condition, is kept as
 *   written.
 * @typeParam Tree - The shape of the tree, which the rendering keeps.
 * @returns A copy of the tree with the colors rendered.
 */
export function lightDarked<Tree>(tree: Tree): Tree {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the walk keeps every key and replaces a pair with a string the compiler reads in the pair's place, which the tree's type already allows
  return walked(tree, false) as Tree;
}
