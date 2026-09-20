/**
 * Checks a recipe for the values it may not write and the classes it would write with no rule: a
 * color a theme cannot move, a token nothing defines, a condition nothing defines, a pixel length,
 * a color mode, a slot the anatomy does not stamp, a value or a compound that states no styles, a
 * default or a compound that names a value no axis offers, and a tag pattern that misses the
 * component's name.
 *
 * @remarks
 *   A recipe reads semantic tokens, compositions and scale steps, so a theme can move every value
 *   it draws. A value the foundation does not define reaches the page as raw CSS without a word
 *   from the compiler, so the token check is what catches a name typed wrongly. The runtime
 *   writes a class for every value it is handed, and the compiler emits a rule only for a value
 *   that states styles, so a value with none, a default the axis does not offer and a compound
 *   matched on such a value each put a class on the page that no rule reaches.
 */

import { slotClass, variantClass } from "@stealthscale/pandacss-naming";
import { HUES, PALETTES, type Preset, ROLES } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import { COMPOSITIONS, conditionNames, semanticColorPaths, tokenPaths } from "#categories.ts";
import { gated } from "#gate.ts";
import {
  defaultViolations,
  emittedViolations,
  emptyViolations,
  jsxViolations,
  selectionViolations,
} from "#reachable.ts";
import { type Declared } from "#recipe.ts";
import { isSystemColor } from "#system-colors.ts";
import { walked, type Walked, type Written } from "#walk.ts";

/**
 * Enumerates every check a recipe specification can select or skip.
 */
export type RecipeCheck =
  | "recipe.className"
  | "recipe.colors"
  | "recipe.compounds"
  | "recipe.conditions"
  | "recipe.defaults"
  | "recipe.emitted"
  | "recipe.empty"
  | "recipe.jsx"
  | "recipe.lengths"
  | "recipe.modes"
  | "recipe.selections"
  | "recipe.slots"
  | "recipe.tokens"
  | "recipe.values";

/**
 * Describes what a recipe specification states beside the recipe.
 */
export interface RecipeChecks {
  /**
   * Property names whose values are allowed a length with a unit.
   */
  lengths?: readonly string[] | undefined;

  /**
   * The names a consumer writes the component under, `Heading` or `List.Root`, each of which the
   * recipe's `jsx` patterns have to match.
   */
  names?: readonly string[] | undefined;

  /**
   * The parts the anatomy stamps, compared against the recipe's slots.
   */
  parts?: readonly string[] | undefined;

  /**
   * The preset the recipe is written against, read for its tokens and conditions. The foundation
   * unless named.
   */
  preset?: Preset | undefined;

  /**
   * The checks to leave out, each with a reason a reviewer can weigh.
   */
  skip?: Readonly<Partial<Record<RecipeCheck, string>>> | undefined;
}

/**
 * Matches a class name a stylesheet and a specification can both write.
 */
const CLASS_NAME = /^[a-z][a-z0-9-]*$/u;

/**
 * Marks the class the compiler names a compound by where the recipe gave it no name.
 */
const UNNAMED = "--compound__";

/**
 * Lists the conditions that switch on the color mode, which a recipe never writes.
 */
const MODE_CONDITIONS = new Set(["_dark", "_light", "_osDark", "_osLight"]);

/**
 * Matches a length in one of the units a theme cannot move.
 */
const LENGTH = /(?:^|[\s(,])-?\d*\.?\d+(?:px|rem|pt)(?![\w-])/u;

/**
 * Matches a color written outright.
 */
const LITERAL = /^(?:#|(?:oklch|oklab|rgba?|hsla?|lab|lch|color)\()/iu;

/**
 * Matches a step of a ramp, such as `blue.500`.
 */
const STEP = /^[a-zA-Z]+\.\d+$/u;

/**
 * Matches a value that is not a color: a keyword every property takes, or a custom property a
 * runtime value is written into.
 */
const PASSES = /^(?:transparent|current|currentColor|inherit|initial|unset|none|var\(--)/u;

/**
 * Matches a value that names a token: one word, a dotted path, or the compiler's token function
 * anywhere in the value.
 *
 * @remarks
 *   A dot is not required. Nine of the categories a theme states are keyed by one word, `radii`
 *   and `zIndex` among them, so a value written `l9` or `stiky` reached the page as raw CSS with
 *   the dotted form alone.
 */
const TOKEN = /^[a-zA-Z][\w-]*(?:\.[\w-]+)*$|token\(/u;

/**
 * Matches a call whose arguments the compiler resolves: its token function, and a custom
 * property with a fallback.
 *
 * @remarks
 *   One level of nesting inside the call, which is as deep as a fallback goes.
 */
const RESOLVED = /(?:token|var)\((?:[^()]|\([^()]*\))*\)/gu;

/**
 * Lists the words a property takes that no category defines: the CSS-wide keywords, and the
 * sizes a box takes from its content or its context.
 *
 * @remarks
 *   A word that is also a token name needs no entry, because the category defines it. Only the
 *   words no theme can move are listed, so a name typed wrongly is still reported.
 */
const KEYWORDS = new Set([
  "auto",
  "fit-content",
  "inherit",
  "initial",
  "max-content",
  "min-content",
  "none",
  "normal",
  "revert",
  "revert-layer",
  "stretch",
  "unset",
]);

/**
 * Matches the category and the path inside the compiler's token function, wherever it is in the
 * value.
 */
const TOKEN_CALL = /token\(([a-zA-Z]+)\.([^,)]+)/u;

/**
 * Fixes the virtual palette a recipe reads roles through.
 */
const VIRTUAL = "colorPalette";

/**
 * Strips the opacity modifier a color may carry, such as `fg/50`.
 */
function bare(value: string): string {
  return value.replace(/\/\d+$/u, "");
}

/**
 * Reports whether a value is a plain object, which an axis's values and a compound are.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Lists each axis of a recipe against the values it takes.
 */
function axesOf(
  recipe: Declared,
): ReadonlyArray<readonly [axis: string, values: readonly string[]]> {
  return Object.entries(recipe.variants ?? {}).map(([axis, values]) => [
    axis,
    isRecord(values) ? Object.keys(values) : [],
  ]);
}

/**
 * Lists the classes a recipe emits its base rules under: its own, or one per slot.
 */
function ownersOf(recipe: Declared): readonly string[] {
  return recipe.slots === undefined
    ? [recipe.className]
    : recipe.slots.map((slot) => slotClass(recipe.className, slot));
}

/**
 * Lists the classes one value writes on: the recipe's own for a recipe that draws one element,
 * and the slot class of each part the value styles for a slot recipe.
 *
 * @remarks
 *   Two axes of a slot recipe may offer one value where they style different parts, because the
 *   runtime writes a class per part and the two never meet on one element. A grid offering three
 *   columns on its root and a span of three on its entry is the case.
 */
function stylesOf(recipe: Declared, styles: unknown): readonly string[] {
  if (recipe.slots === undefined) return [recipe.className];

  return recipe.slots
    .filter((slot) => isRecord(styles) && isRecord(styles[slot]))
    .map((slot) => slotClass(recipe.className, slot));
}

/**
 * Reports every value that writes the class another value or a boolean axis writes.
 *
 * @remarks
 *   The scheme writes a variant's class from the value alone, and a boolean axis at `true` from
 *   the axis, so two axes sharing a value, or a value that is also a boolean axis's name, would
 *   draw two variants under one class.
 */
function valueViolations(recipe: Declared): readonly string[] {
  const written = new Map<string, string>();
  const found: string[] = [];

  for (const [axis, values] of Object.entries(recipe.variants ?? {})) {
    if (!isRecord(values)) continue;

    for (const [value, styles] of Object.entries(values)) {
      for (const owner of stylesOf(recipe, styles)) {
        const className = variantClass(owner, axis, value);

        if (className === "") continue;

        const other = written.get(className);

        if (other === undefined) written.set(className, `${axis} ${value}`);
        else
          found.push(
            `${recipe.className} writes ${className} for ${axis} ${value} and for ${other}`,
          );
      }
    }
  }

  return found;
}

/**
 * Reports a compound without a name, two compounds under one name, and a compound whose name
 * writes the class of a variant.
 *
 * @remarks
 *   A compound without a name is one `defineRecipe` named by the compiler's own scheme, which
 *   reads as the axes it matches on rather than as a word.
 */
function compoundViolations(recipe: Declared): readonly string[] {
  const variants = new Set(
    ownersOf(recipe).flatMap((owner) =>
      axesOf(recipe).flatMap(([axis, values]) =>
        values.map((value) => variantClass(owner, axis, value)),
      ),
    ),
  );
  const named = new Set<string>();

  return (recipe.compoundVariants ?? []).flatMap((compound, index) => {
    if (!isRecord(compound)) return [];

    const className = compound["className"];
    const ordinal = `compound ${String(index + 1)}`;

    if (typeof className !== "string" || className.includes(UNNAMED)) {
      return [`${recipe.className} declares ${ordinal} without a name`];
    }
    if (named.has(className)) {
      return [`${recipe.className} names ${ordinal} ${className}, as it names another`];
    }
    named.add(className);

    return variants.has(className)
      ? [`${recipe.className} names ${ordinal} ${className}, which is the class of a variant`]
      : [];
  });
}

/**
 * Reports whether a value is one no theme owns: a keyword every property takes, a custom property
 * a runtime value is written into, or a color the display chooses for itself.
 */
function passes(named: string): boolean {
  return PASSES.test(named) || isSystemColor(named);
}

/**
 * Says what is wrong with a color value, or nothing where a theme can move it.
 */
function colorFault(value: string, preset: Preset): string | undefined {
  const named = bare(value);
  const [first = "", ...rest] = named.split(".");

  if (passes(named)) return undefined;
  if (LITERAL.test(named)) return `writes the color ${value}`;
  if (named.startsWith("{")) return `references ${value}`;
  if (STEP.test(named)) return `names the ramp step ${value}`;
  if (first === VIRTUAL) {
    return ROLES.some((role) => role === rest.join("."))
      ? undefined
      : `reads ${value}, which is not a role of the palette`;
  }
  if (HUES.some((hue) => hue === first)) return `names the hue ${value}`;
  if (semanticColorPaths(preset).has(named)) return undefined;

  return `names ${value}, which is not a semantic color token`;
}

/**
 * Reports every color a recipe writes that a theme cannot move, and every palette that is a hue
 * rather than an intent.
 */
function colorViolations(
  recipe: Declared,
  found: readonly Written[],
  preset: Preset,
): readonly string[] {
  return found.flatMap(({ path, property, value }) => {
    if (property === VIRTUAL) {
      return PALETTES.some((palette) => palette === value)
        ? []
        : [
            `${recipe.className} points colorPalette at ${value} at ${path}, and a recipe names an intent`,
          ];
    }

    const fault = colorFault(value, preset);

    return fault === undefined ? [] : [`${recipe.className} ${fault} at ${path}`];
  });
}

/**
 * Says what is wrong with a token a value names, or nothing where the preset defines it.
 *
 * @remarks
 *   A word every property takes is passed over, because no theme can move it. Everything else
 *   that reads as a name is held against the paths the preset defines in the category.
 */
function tokenFault(category: string, value: string, preset: Preset): string | undefined {
  const call = TOKEN_CALL.exec(value);

  if (call !== null) {
    const [called, path] = call.slice(1);

    return tokenPaths(String(called), preset).has(String(path))
      ? undefined
      : `names ${value}, which is not a ${String(called)} token`;
  }

  const composed = COMPOSITIONS.some((kind) => kind === category);

  if (!TOKEN.test(value) && !composed) return undefined;
  if (KEYWORDS.has(bare(value))) return undefined;

  return tokenPaths(category, preset).has(bare(value))
    ? undefined
    : `names ${value}, which is not a ${category} token`;
}

/**
 * Reports every token a recipe names that the preset does not define.
 */
function tokenViolations(
  recipe: Declared,
  found: readonly Written[],
  preset: Preset,
): readonly string[] {
  return found.flatMap(({ category, path, value }) => {
    if (category === undefined || category === "colors") return [];

    const fault = tokenFault(category, value, preset);

    return fault === undefined ? [] : [`${recipe.className} ${fault} at ${path}`];
  });
}

/**
 * Reports every condition a recipe nests under that nothing defines.
 */
function conditionViolations(recipe: Declared, found: Walked, preset: Preset): readonly string[] {
  const known = conditionNames(preset);

  return found.conditions
    .filter(({ condition }) => !known.has(condition.slice(1)))
    .map(
      ({ condition, path }) =>
        `${recipe.className} nests under ${condition} at ${path}, which is not a condition`,
    );
}

/**
 * Reports every length a recipe writes in a unit a theme cannot move.
 *
 * @remarks
 *   A length inside the compiler's token function or a custom property's fallback is the theme's
 *   own, so the calls come out of the value before it is read.
 */
function lengthViolations(
  recipe: Declared,
  found: readonly Written[],
  allowed: readonly string[],
): readonly string[] {
  return found.flatMap(({ path, property, value }) =>
    property !== undefined &&
    !allowed.includes(property) &&
    LENGTH.test(value.replaceAll(RESOLVED, ""))
      ? [`${recipe.className} sets ${property} to ${value} at ${path}, a length in px, rem or pt`]
      : [],
  );
}

/**
 * Reports every color mode a recipe switches on.
 */
function modeViolations(recipe: Declared, found: Walked): readonly string[] {
  return found.conditions
    .filter(({ condition }) => MODE_CONDITIONS.has(condition))
    .map(({ path }) => `${recipe.className} switches on the color mode at ${path}`);
}

/**
 * Reports a slot the anatomy stamps no part for, and a part no slot styles.
 */
function slotViolations(recipe: Declared, parts: readonly string[]): readonly string[] {
  const styled = recipe.slots ?? [];
  const unstamped = styled
    .filter((slot) => !parts.includes(slot))
    .map((slot) => `${recipe.className} styles ${slot}, which the anatomy stamps no part for`);
  const unstyled = parts
    .filter((part) => !styled.includes(part))
    .map((part) => `${recipe.className} styles no slot for the part ${part}`);

  return unstamped.concat(unstyled);
}

/**
 * Runs one check and reports what it found.
 */
type Runner = (
  recipe: Declared,
  found: Walked,
  options: RecipeChecks,
  preset: Preset,
) => readonly string[];

/**
 * Maps each check to the call that performs it, in the order they report.
 */
const RUNNERS: ReadonlyArray<readonly [RecipeCheck, Runner]> = [
  [
    "recipe.className",
    (recipe) =>
      CLASS_NAME.test(recipe.className)
        ? []
        : [`${recipe.className} is not a class name in kebab case`],
  ],
  ["recipe.values", (recipe) => valueViolations(recipe)],
  ["recipe.compounds", (recipe) => compoundViolations(recipe)],
  ["recipe.empty", (recipe) => emptyViolations(recipe)],
  ["recipe.defaults", (recipe) => defaultViolations(recipe)],
  ["recipe.emitted", (recipe) => emittedViolations(recipe)],
  ["recipe.selections", (recipe) => selectionViolations(recipe)],
  [
    "recipe.jsx",
    (recipe, _found, options) =>
      options.names === undefined ? [] : jsxViolations(recipe, options.names),
  ],
  [
    "recipe.colors",
    (recipe, found, _options, preset) =>
      colorViolations(
        recipe,
        found.strings.filter(({ category }) => category === "colors"),
        preset,
      ),
  ],
  [
    "recipe.tokens",
    (recipe, found, _options, preset) => tokenViolations(recipe, found.strings, preset),
  ],
  [
    "recipe.conditions",
    (recipe, found, _options, preset) => conditionViolations(recipe, found, preset),
  ],
  [
    "recipe.lengths",
    (recipe, found, options) => lengthViolations(recipe, found.strings, options.lengths ?? []),
  ],
  ["recipe.modes", (recipe, found) => modeViolations(recipe, found)],
  [
    "recipe.slots",
    (recipe, _found, options) =>
      options.parts === undefined ? [] : slotViolations(recipe, options.parts),
  ],
];

/**
 * Runs every check the specification leaves standing over a recipe.
 *
 * @returns Each violation, opening with the check that reported it, or an empty array for a
 *   recipe a theme can move every value of.
 */
export function recipeViolations(recipe: Declared, options: RecipeChecks = {}): readonly string[] {
  const found = walked(recipe);
  const preset = options.preset ?? foundation;

  return gated(
    RUNNERS.map(([check, run]) => [check, () => run(recipe, found, options, preset)] as const),
    options,
  );
}
