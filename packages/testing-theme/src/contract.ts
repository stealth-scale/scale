/**
 * Checks a theme against the contract a type cannot hold it to: a role stated in one mode, a
 * reference that points nowhere, an extension aimed at a recipe nobody publishes, a variant value
 * or a part the runtime never writes a class for, a compound the runtime never applies, an
 * extension file the theme does not list, and a style with nothing in it.
 */

import { existsSync } from "node:fs";

import {
  BACKGROUNDS,
  BORDERS,
  CODE,
  compoundSelection,
  FOREGROUNDS,
  MODES,
  ROLES,
  STATUSES,
  type Theme,
} from "@stealthscale/theme/authoring";

import { COMPOSITIONS } from "#categories.ts";
import { extensionFiles } from "#files.ts";
import { type Declared } from "#recipe.ts";
import { colorsOf, extendedRecipes, palettesOf, resolved, type Resolving } from "#theme.ts";
import { leaves, nodeAt, stated } from "#tokens.ts";

/**
 * Lists the four families against the members each states.
 */
const FAMILIES: ReadonlyArray<readonly [family: string, members: readonly string[]]> = [
  ["bg", [...BACKGROUNDS, ...STATUSES]],
  ["border", [...BORDERS, ...STATUSES]],
  ["code", CODE],
  ["fg", [...FOREGROUNDS, ...STATUSES]],
];

/**
 * Lists the two keys an extension may never name.
 */
const OWNED = ["className", "slots"];

/**
 * Reports a palette that leaves one of the twelve roles out, and a family that leaves one of its
 * members out.
 */
export function roles(theme: Theme): readonly string[] {
  const colors = colorsOf(theme);
  const missing: string[] = [];

  for (const palette of palettesOf(theme)) {
    for (const role of ROLES) {
      if (!stated(nodeAt(colors, palette), role)) {
        missing.push(`${theme.name} ${palette}.${role} is not stated`);
      }
    }
  }

  for (const [family, members] of FAMILIES) {
    const group = nodeAt(colors, family);

    if (group === undefined) continue;

    for (const member of members) {
      if (!stated(group, member)) missing.push(`${theme.name} ${family}.${member} is not stated`);
    }
  }

  return missing;
}

/**
 * Reports a color stated in one mode and not the other, and one whose value states no mode at all.
 *
 * @remarks
 *   A color stated once as a string covers both modes, and a reference inherits both from the
 *   token it names, so a string is passed over. An object value names the modes, so one that names
 *   neither states nothing the compiler will emit: an empty object, or a pair of keys misspelt.
 *   Nothing else reports those, because a reference check reads the same keys and a contrast pair
 *   covers the roles it names and no other.
 */
export function modes(theme: Theme): readonly string[] {
  return leaves(colorsOf(theme)).flatMap(({ path, value }) => {
    if (typeof value !== "object" || value === null) return [];

    const missing = MODES.filter((mode) => !(mode in value));

    if (missing.length === MODES.length) return [`${theme.name} ${path} states no mode`];

    return missing.map((mode) => `${theme.name} ${path} is not stated in ${mode}`);
  });
}

/**
 * Reports a reference that points at a token nothing defines, or at itself.
 */
export function references(theme: Theme, options: Resolving): readonly string[] {
  return leaves(colorsOf(theme)).flatMap(({ path, value }) =>
    MODES.flatMap((mode) => {
      const written: unknown =
        typeof value === "object" && value !== null ? Reflect.get(value, mode) : value;

      if (typeof written !== "string" || !written.startsWith("{")) return [];
      if (resolved(theme, { value }, mode, options) !== undefined) return [];

      return [`${theme.name} ${path} in ${mode} names ${written}, which nothing defines`];
    }),
  );
}

/**
 * Reports an extension that names a recipe key the workspace does not publish, or that names one
 * of the two keys the component owns.
 *
 * @remarks
 *   The keys the workspace publishes are the caller's to state. Left unstated, the keys go
 *   unchecked and the two owned keys are still refused.
 */
export function extensions(theme: Theme, recipes?: readonly string[]): readonly string[] {
  const extend = theme.preset.theme?.extend;
  const named = Object.entries({ ...extend?.recipes, ...extend?.slotRecipes });

  return named.flatMap(([key, extension]) => {
    const unpublished =
      recipes === undefined || recipes.includes(key)
        ? []
        : [`${theme.name} extends ${key}, which no package publishes`];
    const owned = OWNED.filter((field) => field in extension).map(
      (field) => `${theme.name} extends ${key} with ${field}, which the component owns`,
    );

    return unpublished.concat(owned);
  });
}

/**
 * Reports whether a style object states anything.
 */
function states(held: unknown): boolean {
  return typeof held === "object" && held !== null && Object.keys(held).length > 0;
}

/**
 * Lists the parts a slot recipe's value or compound states styles on.
 */
function partsStyled(slotted: unknown): readonly string[] {
  return typeof slotted === "object" && slotted !== null
    ? Object.entries(slotted)
        .filter(([, held]) => states(held))
        .map(([slot]) => slot)
    : [];
}

/**
 * Lists the parts an extension's value or compound styles that the recipe's own does not, for a
 * slot recipe, and nothing for a recipe that draws one element.
 */
function unstyledParts(recipe: Declared, own: unknown, extended: unknown): readonly string[] {
  if (recipe.slots === undefined) return [];

  const styledOwn = partsStyled(own);

  return partsStyled(extended).filter((slot) => !styledOwn.includes(slot));
}

/**
 * Lists each axis an extension's variants name against the values it states under it.
 */
function variantsOf(
  extension: object,
): ReadonlyArray<readonly [axis: string, values: Readonly<Record<string, unknown>>]> {
  const held: unknown = Reflect.get(extension, "variants");

  if (typeof held !== "object" || held === null) return [];

  return Object.entries(held).flatMap(([axis, values]) =>
    typeof values === "object" && values !== null
      ? // eslint-disable-next-line typescript/no-unsafe-type-assertion -- an object is read by its keys, whatever they hold
        [[axis, values as Readonly<Record<string, unknown>>] as const]
      : [],
  );
}

/**
 * Reports a theme's variant styles the runtime never writes a class for: an axis the recipe does
 * not offer, a value the axis does not offer, and a part the recipe's own value does not style.
 *
 * @remarks
 *   The runtime writes a variant class from the component's recipe alone, and writes a part's
 *   variant class only where the recipe styles that part under the value. A theme's styles for
 *   any other axis, value or part compile to a rule no element carries the class for. A key the
 *   map leaves out goes unchecked here, and the extensions check reports it.
 */
export function variants(
  theme: Theme,
  recipes: Readonly<Record<string, Declared>>,
): readonly string[] {
  const extend = theme.preset.theme?.extend;
  const named = Object.entries({ ...extend?.recipes, ...extend?.slotRecipes });

  return named.flatMap(([key, extension]) => {
    const recipe = recipes[key];

    if (recipe === undefined) return [];

    return variantsOf(extension).flatMap(([axis, values]) => {
      const offered: unknown = recipe.variants?.[axis];

      if (typeof offered !== "object" || offered === null) {
        return [`${theme.name} extends ${key} on ${axis}, which the recipe does not offer`];
      }

      return Object.entries(values).flatMap(([value, extended]) => {
        if (!(value in offered)) {
          return [`${theme.name} extends ${key} ${axis} ${value}, which the axis does not offer`];
        }

        return unstyledParts(recipe, Reflect.get(offered, value), extended).map(
          (slot) =>
            `${theme.name} extends ${key} ${axis} ${value} on ${slot}, which the recipe's value does not style`,
        );
      });
    });
  });
}

/**
 * Reports a theme's compound for a selection the recipe declares no compound for, a compound
 * matched on a value a class name cannot carry, and a compound styling a part the recipe's own
 * compound does not.
 *
 * @remarks
 *   The runtime takes a compound's class from the component's recipe alone, so a theme's compound
 *   reaches an element only where the recipe declares the same selection, and reaches a part only
 *   where the recipe's compound styles that part. Any other compound is compiled and never
 *   applied. A key the map leaves out goes unchecked here, and the extensions check reports it.
 */
export function compounds(
  theme: Theme,
  recipes: Readonly<Record<string, Declared>>,
): readonly string[] {
  const extend = theme.preset.theme?.extend;
  const named = Object.entries({ ...extend?.recipes, ...extend?.slotRecipes });

  return named.flatMap(([key, extension]) => {
    const recipe = recipes[key];

    if (recipe === undefined) return [];

    const declared = new Map(
      (recipe.compoundVariants ?? [])
        .filter((compound): compound is object => typeof compound === "object" && compound !== null)
        .map((compound) => [compoundSelection(compound), compound] as const),
    );

    return (extension.compoundVariants ?? []).flatMap((compound) => {
      if (typeof compound !== "object" || compound === null) return [];

      const selection = compoundSelection(compound);

      if (selection === undefined) {
        return [
          `${theme.name} extends ${key} with a compound matched on a value a class name cannot carry`,
        ];
      }

      const own = declared.get(selection);

      if (own === undefined) {
        return [
          `${theme.name} extends ${key} with a compound for ${selection}, which the recipe does not declare`,
        ];
      }

      return unstyledParts(recipe, Reflect.get(own, "css"), Reflect.get(compound, "css")).map(
        (slot) =>
          `${theme.name} extends ${key} with a compound for ${selection} on ${slot}, which the recipe's compound does not style`,
      );
    });
  });
}

/**
 * Reports an extension file under the theme's source directory that the theme does not list.
 */
export function listed(theme: Theme, at: string): readonly string[] {
  if (!existsSync(at)) return [`${theme.name} has no source directory at ${at}`];

  const keys = extendedRecipes(theme);

  return extensionFiles(at)
    .filter((file) => !keys.includes(file.key))
    .map((file) => `${theme.name} does not list ${file.file}`);
}

/**
 * Reports a text, layer or animation style that states nothing, and a text style without a size.
 */
export function styles(theme: Theme): readonly string[] {
  const extend = theme.preset.theme?.extend;
  const empty = COMPOSITIONS.flatMap((kind) =>
    leaves(extend?.[kind]).flatMap(({ path, value }) =>
      typeof value === "object" && value !== null && Object.keys(value).length > 0
        ? []
        : [`${theme.name} ${kind}.${path} states nothing`],
    ),
  );
  const unsized = leaves(extend?.textStyles).flatMap(({ path, value }) =>
    typeof value === "object" &&
    value !== null &&
    Object.keys(value).length > 0 &&
    !("fontSize" in value)
      ? [`${theme.name} textStyles.${path} states no fontSize`]
      : [],
  );

  return empty.concat(unsized);
}
