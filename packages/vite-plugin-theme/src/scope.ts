/**
 * Rewrites a theme's extensions so they only apply while the theme attribute selects that theme.
 *
 * @remarks
 *   Tokens switch themes without help: they compile to custom properties and a selector can
 *   redefine them. Recipe extensions and compositions cannot. They compile to declarations inside a
 *   rule, and no selector reaches into a rule. Nesting each one under `[data-theme=<name>] &` makes
 *   the compiler emit a second rule carrying one attribute more than the rule it extends, so it
 *   wins while the attribute is set and matches nothing while it is not. Only the declarations a
 *   theme actually states are emitted, so the added CSS scales with the theme and not with the
 *   recipe layer.
 */

import { THEME_ATTRIBUTE } from "#options.ts";

/**
 * A style object as the compiler reads one: CSS properties against their values, nested selectors
 * against the styles beneath them.
 */
type Styles = Readonly<Record<string, unknown>>;

/**
 * One entry of a recipe's `compoundVariants`: the variant values to match on, and the styles to
 * apply where they all match.
 */
export interface Compound {
  /**
   * The value this axis has to take for the compound to apply. A list matches any value in it.
   */
  [axis: string]: unknown;

  /**
   * The class to emit the styles under. Without one the compiler derives a class from the
   * selection.
   */
  className?: string | undefined;

  /**
   * The styles to apply, keyed by slot where the recipe styles more than one element.
   */
  css?: Styles | undefined;
}

/**
 * Every compound the published recipes declare, keyed by recipe under the same keys the compiler
 * uses.
 */
export interface Compounds {
  /**
   * The compounds of each recipe that styles one element.
   */
  recipes: Readonly<Record<string, readonly Compound[]>>;

  /**
   * The compounds of each slot recipe.
   */
  slotRecipes: Readonly<Record<string, readonly Compound[]>>;
}

/**
 * A theme's override of one recipe. Only the parts it names change; the rest falls through to the
 * published recipe.
 */
export interface Extension {
  /**
   * The styles to merge into every instance of the recipe.
   */
  base?: Styles | undefined;

  /**
   * The styles to merge into the selections these compounds match.
   */
  compoundVariants?: readonly Compound[] | undefined;

  /**
   * The styles to merge into one value of one axis, keyed by axis and then by value.
   */
  variants?: Readonly<Record<string, Readonly<Record<string, Styles>>>> | undefined;
}

/**
 * The five kinds of `theme.extend` entry this module knows how to scope.
 *
 * @remarks
 *   Tokens, keyframes and global styles are left out deliberately, because none of them can be
 *   scoped this way. The compiler already switches tokens on the attribute. Keyframes and global
 *   styles have no rule to nest a selector inside, so whichever theme compiles first reaches the
 *   page and the rest never do.
 */
export interface Extensions {
  /**
   * The animation styles to add, keyed by name.
   */
  animationStyles?: Styles | undefined;

  /**
   * The layer styles to add, keyed by name.
   */
  layerStyles?: Styles | undefined;

  /**
   * The overrides for recipes that style one element, keyed by recipe.
   */
  recipes?: Readonly<Record<string, Extension>> | undefined;

  /**
   * The overrides for slot recipes, keyed by recipe.
   */
  slotRecipes?: Readonly<Record<string, Extension>> | undefined;

  /**
   * The text styles to add, keyed by name.
   */
  textStyles?: Styles | undefined;
}

/**
 * The part of a preset this module reads: the extensions it declares and the presets nested under
 * it.
 *
 * @remarks
 *   Declared here rather than imported from the compiler. A theme package ships into an
 *   application's bundle and so must not depend on a build tool, which leaves structural agreement
 *   as the only contract the two can share.
 */
export interface SwitchablePreset {
  /**
   * The preset's name, as the compiler reports it in diagnostics.
   */
  name?: string | undefined;

  /**
   * The presets this one builds on, a parent theme's preset among them.
   */
  presets?: readonly unknown[] | undefined;

  /**
   * The preset's additions to the compiler's theme.
   */
  theme?:
    | {
        /**
         * The additions to merge into what the presets beneath declare, rather than replace it.
         */
        extend?: Extensions | undefined;
      }
    | undefined;
}

/**
 * The part of a theme this module reads: the attribute value that selects it and the preset
 * carrying its extensions.
 */
export interface Switchable {
  /**
   * The attribute value that switches the page to this theme.
   */
  name: string;

  /**
   * The preset declaring the theme's extensions, with a parent theme's preset nested under it
   * where the theme derives from another.
   */
  preset?: SwitchablePreset | undefined;
}

/**
 * One level of one theme's extensions, rewritten to apply only under that theme's selector.
 */
export interface ScopedPreset {
  /**
   * The preset's name, as the compiler reports it in diagnostics.
   */
  name: string;

  /**
   * The scoped extensions. Tokens never appear here, because the compiler would install them
   * whatever the attribute reads.
   */
  theme: {
    /**
     * The additions to merge into what the presets beneath declare, rather than replace it.
     */
    extend: Extensions;
  };
}

/**
 * One set of extensions from a theme's lineage, together with where it came from.
 */
interface Level {
  /**
   * The recipe and composition overrides declared at this level.
   */
  extensions: Extensions;

  /**
   * True where the level came from a theme beneath the one being scoped.
   */
  inherited: boolean;

  /**
   * The name of the preset that declared the level, where it gives one.
   */
  name: string | undefined;
}

/**
 * The two compound keys that are not axes. Every other key counts towards the selection the
 * compound matches.
 */
const UNMATCHED = new Set(["className", "css"]);

/**
 * Empty compound tables, for a caller that has not read the published presets. Nothing adopts a
 * class.
 */
const NONE: Compounds = { recipes: {}, slotRecipes: {} };

/**
 * Narrows a value to a style object, which structurally means any non-null object.
 */
function isStyles(value: unknown): value is Styles {
  return typeof value === "object" && value !== null;
}

/**
 * Puts one selection value into the form two authors of the same selection both produce.
 *
 * @remarks
 *   An axis given a list matches any value in it, so the list is really a set. Sorting it makes
 *   `["sm", "lg"]` and `["lg", "sm"]` compare equal. Anything that is not a list is already
 *   canonical.
 */
function canonical(value: unknown): unknown {
  return Array.isArray(value)
    ? value.toSorted((one, other) => JSON.stringify(one).localeCompare(JSON.stringify(other)))
    : value;
}

/**
 * Keys a compound by the selection it matches. Two compounds share a key when they match on the
 * same axes and values, and differ otherwise.
 */
function selectionOf(compound: Compound): string {
  return JSON.stringify(
    Object.entries(compound)
      .filter(([axis]) => !UNMATCHED.has(axis))
      .map(([axis, value]): readonly [string, unknown] => [axis, canonical(value)])
      .toSorted(([one], [other]) => one.localeCompare(other)),
  );
}

/**
 * Finds the class a published recipe emits for one selection, or undefined where it declares no
 * compound for that selection.
 *
 * @remarks
 *   A `slot` narrows the search to a published compound that styles that slot. A recipe styling one
 *   element passes none.
 */
function classOf(
  published: readonly Compound[],
  selection: string,
  slot?: string,
): string | undefined {
  return published.find(
    (each) =>
      selectionOf(each) === selection &&
      (slot === undefined || (isStyles(each.css) && slot in each.css)),
  )?.className;
}

/**
 * Builds the per-slot half of a theme's compound: the same axes, the styles for one slot, and the
 * published class where there is one.
 */
function forSlot(
  axes: Compound,
  slot: string,
  styles: unknown,
  className: string | undefined,
): Compound {
  return { ...axes, css: { [slot]: styles }, ...(className === undefined ? {} : { className }) };
}

/**
 * Splits one theme compound into the compounds it has to compile to, each adopting the class the
 * published recipe already emits for the same selection.
 *
 * @remarks
 *   The compiler emits one class per compound and writes it on every slot that compound styles. A
 *   theme's compound over a slot recipe therefore has to split, one compound per slot, so each part
 *   can take the class of the published compound covering that slot. Where nothing published
 *   matches, the compound passes through and the compiler names it.
 * @returns One compound for a recipe that styles one element, and one per styled slot otherwise.
 */
function adopted(
  compound: Compound,
  published: readonly Compound[],
  slotted: boolean,
): readonly Compound[] {
  const selection = selectionOf(compound);
  const { css, ...axes } = compound;

  if (!slotted) {
    const className = classOf(published, selection);

    return [className === undefined ? compound : { ...compound, className }];
  }
  if (!isStyles(css)) return [compound];

  return Object.entries(css).map(([slot, styles]) =>
    forSlot(axes, slot, styles, classOf(published, selection, slot)),
  );
}

/**
 * Wraps styles in a selector so they apply only under it.
 *
 * @remarks
 *   A slot recipe keys its styles by slot, so the selector has to go inside each slot. Wrapping the
 *   whole map would leave slot names where the compiler expects CSS properties.
 */
function nested(held: Styles, slotted: boolean, selector: string): Styles {
  if (!slotted) return { [selector]: held };

  return Object.fromEntries(
    Object.entries(held).map(([slot, styles]) => [
      slot,
      isStyles(styles) ? { [selector]: styles } : styles,
    ]),
  );
}

/**
 * Puts one compound variant's styles under the selector and leaves the axes it matches on alone.
 */
function nestedCompound(compound: Compound, slotted: boolean, selector: string): Compound {
  const { css, ...axes } = compound;

  return css === undefined ? compound : { ...axes, css: nested(css, slotted, selector) };
}

/**
 * Rewrites one extension: base, variant and compound styles all move under the selector, and each
 * compound adopts the published class for its selection.
 */
function scoped(
  extension: Extension,
  slotted: boolean,
  selector: string,
  published: readonly Compound[],
): Extension {
  const { base, compoundVariants, variants } = extension;

  return {
    ...(base === undefined ? {} : { base: nested(base, slotted, selector) }),
    ...(compoundVariants === undefined
      ? {}
      : {
          compoundVariants: compoundVariants.flatMap((compound) =>
            adopted(compound, published, slotted).map((each) =>
              nestedCompound(each, slotted, selector),
            ),
          ),
        }),
    ...(variants === undefined
      ? {}
      : {
          variants: Object.fromEntries(
            Object.entries(variants).map(([axis, values]) => [
              axis,
              Object.fromEntries(
                Object.entries(values).map(([value, styles]) => [
                  value,
                  nested(styles, slotted, selector),
                ]),
              ),
            ]),
          ),
        }),
  };
}

/**
 * Scopes every extension in one map of recipes, matching each against the published compounds for
 * its key.
 */
function all(
  held: Readonly<Record<string, Extension>>,
  slotted: boolean,
  selector: string,
  compounds: Readonly<Record<string, readonly Compound[]>>,
): Record<string, Extension> {
  return Object.fromEntries(
    Object.entries(held).map(([key, extension]) => [
      key,
      scoped(extension, slotted, selector, compounds[key] ?? []),
    ]),
  );
}

/**
 * Scopes one node of a composition tree, whether it is a leaf or a group of them.
 *
 * @remarks
 *   A text, layer or animation style is a tree of names whose leaves carry their styles under
 *   `value`. A node without such an object is a group, so it gets walked rather than nested and the
 *   compiler still reads a tree. Anything that is not an object passes through untouched.
 */
function composition(node: unknown, selector: string): unknown {
  if (!isStyles(node)) return node;

  const value = node["value"];

  return isStyles(value) ? { ...node, value: { [selector]: value } } : compositions(node, selector);
}

/**
 * Walks a composition tree and scopes every leaf under it.
 */
function compositions(held: Styles, selector: string): Styles {
  return Object.fromEntries(
    Object.entries(held).map(([name, node]) => [name, composition(node, selector)]),
  );
}

/**
 * Scopes one level's extensions, sending each kind of entry to the rewrite it needs.
 */
function scopedExtensions(
  extensions: Extensions,
  selector: string,
  compounds: Compounds,
): Extensions {
  const { animationStyles, layerStyles, recipes, slotRecipes, textStyles } = extensions;

  return {
    ...(animationStyles === undefined
      ? {}
      : { animationStyles: compositions(animationStyles, selector) }),
    ...(layerStyles === undefined ? {} : { layerStyles: compositions(layerStyles, selector) }),
    ...(recipes === undefined ? {} : { recipes: all(recipes, false, selector, compounds.recipes) }),
    ...(slotRecipes === undefined
      ? {}
      : { slotRecipes: all(slotRecipes, true, selector, compounds.slotRecipes) }),
    ...(textStyles === undefined ? {} : { textStyles: compositions(textStyles, selector) }),
  };
}

/**
 * Appends each recipe's compounds to whatever has already been collected for that recipe.
 */
function compoundsOf(
  held: Readonly<Record<string, Extension>> | undefined,
  into: Record<string, readonly Compound[]>,
): void {
  for (const [key, extension] of Object.entries(held ?? {})) {
    into[key] = [...(into[key] ?? []), ...(extension.compoundVariants ?? [])];
  }
}

/**
 * The mutable accumulator {@link gathered} fills in place as it walks the presets.
 */
interface Gathering {
  /**
   * The compounds collected so far for each recipe that styles one element.
   */
  recipes: Record<string, readonly Compound[]>;

  /**
   * The compounds collected so far for each slot recipe.
   */
  slotRecipes: Record<string, readonly Compound[]>;
}

/**
 * Collects the compounds of one preset and everything nested under it, nested presets first.
 */
function gathered(preset: unknown, into: Gathering): void {
  if (!isPreset(preset)) return;

  for (const under of preset.presets ?? []) gathered(under, into);

  compoundsOf(preset.theme?.extend?.recipes, into.recipes);
  compoundsOf(preset.theme?.extend?.slotRecipes, into.slotRecipes);
}

/**
 * Collects the compounds every published preset declares, so a theme's compound can adopt the class
 * the compiler already emits for the same selection.
 *
 * @remarks
 *   The presets are read structurally, which keeps the plugin free of any design-system dependency.
 *   A recipe two presets declare contributes the compounds of both, and a nested preset contributes
 *   first, matching the order the compiler installs them.
 * @param presets - Every preset installed ahead of the themes: the packages' and the application's
 *   own.
 */
export function publishedCompounds(presets: readonly unknown[]): Compounds {
  const into: Gathering = { recipes: {}, slotRecipes: {} };

  for (const preset of presets) gathered(preset, into);

  return into;
}

/**
 * The slots one compound styles. A recipe that styles one element yields a single undefined slot,
 * so a caller can loop over either kind.
 */
function slotsOf(compound: Compound, slotted: boolean): ReadonlyArray<string | undefined> {
  if (!slotted) return [undefined];

  return isStyles(compound.css) ? Object.keys(compound.css) : [];
}

/**
 * Finds the compounds in one map of extensions that no published compound matches.
 */
function unmatchedIn(
  theme: string,
  held: Readonly<Record<string, Extension>> | undefined,
  published: Readonly<Record<string, readonly Compound[]>>,
  slotted: boolean,
): string[] {
  return Object.entries(held ?? {}).flatMap(([key, extension]) =>
    (extension.compoundVariants ?? [])
      .filter((compound) => compound.className === undefined)
      .flatMap((compound) => {
        const selection = selectionOf(compound);

        return slotsOf(compound, slotted)
          .filter((slot) => classOf(published[key] ?? [], selection, slot) === undefined)
          .map((slot) => `${theme}: ${key}${slot === undefined ? "" : `.${slot}`} ${selection}`);
      }),
  );
}

/**
 * Reports every theme compound written against a selection no published recipe declares, one line
 * each naming the theme, the recipe, the slot and the selection.
 *
 * @remarks
 *   The runtime only ever writes the class of the published compound, so a theme's compound for an
 *   undeclared selection compiles to a rule no element matches. A compound that names its own class
 *   is left out, because the author picked that class.
 */
export function unmatchedCompounds(
  themes: readonly Switchable[],
  compounds: Compounds,
): readonly string[] {
  return themes.flatMap((theme) =>
    lineage(theme.preset).flatMap(({ extensions }) =>
      unmatchedIn(theme.name, extensions.recipes, compounds.recipes, false).concat(
        unmatchedIn(theme.name, extensions.slotRecipes, compounds.slotRecipes, true),
      ),
    ),
  );
}

/**
 * Narrows a nested preset to one this module can read structurally.
 *
 * @remarks
 *   The compiler also takes a preset by name or as a promise, and a theme nests neither.
 */
function isPreset(held: unknown): held is SwitchablePreset {
  return typeof held === "object" && held !== null;
}

/**
 * Flattens a theme's preset chain into one level per set of extensions, ancestors first and the
 * theme itself last.
 *
 * @remarks
 *   A derived theme nests its parent's preset beneath its own, and the compiler installs the nested
 *   one first, so an extension the child restates wins over its parent's. This keeps the same
 *   order.
 */
function lineage(preset: SwitchablePreset | undefined, inherited = false): readonly Level[] {
  if (preset === undefined) return [];

  const above = (preset.presets ?? []).flatMap((each) =>
    isPreset(each) ? lineage(each, true) : [],
  );
  const own = preset.theme?.extend;

  return own === undefined ? above : [...above, { extensions: own, inherited, name: preset.name }];
}

/**
 * Builds the selector that reaches an element under one theme and stops at the boundary of any
 * theme nested inside it.
 *
 * @remarks
 *   The attribute on its own still matches inside a subtree switched to another theme. Tokens stop
 *   at that boundary because the inner element redeclares them, and rules have no equivalent.
 *   Naming the attribute a second time in the exclusion admits only an element with no theme in
 *   between, which also stops a theme nested inside itself.
 * @param name - The theme's name, as a page writes it into the attribute.
 */
function scopeFor(name: string): string {
  const own = `[${THEME_ATTRIBUTE}=${name}]`;

  return `${own} &:not(${own} [${THEME_ATTRIBUTE}] *)`;
}

/**
 * Scopes one theme's extensions into presets the compiler can install.
 *
 * @remarks
 *   The compiler already merges presets, so each level of the lineage becomes a preset of its own
 *   and no merge is repeated here. A level that extends nothing produces no preset.
 * @param theme - The theme whose extensions are being scoped.
 * @param compounds - The compounds the published recipes declare, whose classes the theme's
 *   compounds adopt for the same selections.
 * @returns One preset per level that extends anything, oldest ancestor first.
 */
export function scopedPreset(
  theme: Switchable,
  compounds: Compounds = NONE,
): readonly ScopedPreset[] {
  const selector = scopeFor(theme.name);
  const own = `theme:${theme.name}:switched`;

  return lineage(theme.preset).flatMap(({ extensions, inherited, name }) => {
    const extend = scopedExtensions(extensions, selector, compounds);

    if (Object.keys(extend).length === 0) return [];

    return [
      {
        name: inherited ? `${own} from ${name ?? "an unnamed preset"}` : own,
        theme: { extend },
      },
    ];
  });
}

/**
 * Scopes every theme's extensions, the first theme included.
 *
 * @remarks
 *   The first theme's extensions are also emitted unscoped, so that theme applies while no
 *   attribute is set. Scoping it as well lets a subtree inside another theme switch back to it.
 */
export function scopedPresets(
  themes: readonly Switchable[],
  compounds: Compounds = NONE,
): readonly ScopedPreset[] {
  return themes.flatMap((each) => scopedPreset(each, compounds));
}
