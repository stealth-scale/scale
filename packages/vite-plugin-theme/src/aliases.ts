/**
 * Finds an import that renames a component the compiler matches by name.
 *
 * @remarks
 *   The compiler extracts the props of a component by matching the element's name against the
 *   patterns a recipe states under `jsx`. An import written as `import { Button as Renamed }`
 *   draws `<Renamed>`, which no pattern matches, so the variants it selects compile to no rule and
 *   the element carries classes with nothing behind them. The compiler cannot see the binding, so
 *   the import is read here and reported.
 */

import { readFileSync } from "node:fs";
import { relative } from "node:path";

import { type Diagnostic } from "#pandacss.ts";

/**
 * Matches a named import, with everything between its braces and the package it imports from.
 */
const IMPORTED = /import\s*(?:type\s+)?\{([^}]*)\}\s*from\s*["']([^"']+)["']/gu;

/**
 * The fields of a preset's theme that hold recipes.
 */
const RECIPE_FIELDS = ["recipes", "slotRecipes"];

/**
 * Lists the patterns a package's recipes match a component's name against, by package.
 */
export type Matched = ReadonlyMap<string, readonly RegExp[]>;

/**
 * Reads one field of a value where the value is an object, and nothing otherwise.
 */
function fieldOf(held: unknown, field: string): unknown {
  return typeof held === "object" && held !== null ? Reflect.get(held, field) : undefined;
}

/**
 * Lists the values of an object, and nothing for anything else.
 */
function valuesOf(held: unknown): readonly unknown[] {
  return typeof held === "object" && held !== null ? Object.values(held) : [];
}

/**
 * Reads one pattern as a recipe states it: a regular expression as it is, and a name as the
 * expression that matches it whole.
 */
function patternOf(stated: unknown): RegExp | undefined {
  if (stated instanceof RegExp) return stated;
  if (typeof stated !== "string") return undefined;

  return new RegExp(`^${stated.replaceAll(/[$()*+.?[\\\]^{|}]/gu, String.raw`\$&`)}$`, "u");
}

/**
 * Reads the patterns one recipe states under `jsx`.
 */
function patternsOf(recipe: unknown): RegExp[] {
  const jsx = fieldOf(recipe, "jsx");

  return (Array.isArray(jsx) ? jsx : [])
    .map((stated) => patternOf(stated))
    .filter((pattern) => pattern !== undefined);
}

/**
 * Reads the patterns every recipe of one preset states under `jsx`.
 */
function patternsIn(preset: unknown): RegExp[] {
  const extend = fieldOf(fieldOf(preset, "theme"), "extend");

  return RECIPE_FIELDS.flatMap((field) =>
    valuesOf(fieldOf(extend, field)).flatMap((recipe) => patternsOf(recipe)),
  );
}

/**
 * Reads the patterns every contributor's recipes match a component's name against.
 *
 * @param names - The contributors' names, in the order their presets were loaded.
 * @param presets - The presets, in the same order.
 */
export function matchedNames(names: readonly string[], presets: readonly unknown[]): Matched {
  return new Map(names.map((name, index) => [name, patternsIn(presets[index])]));
}

/**
 * Reads the bindings one import renames, as pairs of the exported and the local name.
 */
function renamed(specifiers: string): ReadonlyArray<readonly [string, string]> {
  return specifiers
    .split(",")
    .map((specifier) =>
      specifier
        .trim()
        .replace(/^type\s+/u, "")
        .split(/\s+as\s+/u),
    )
    .filter((parts): parts is [string, string] => parts.length === 2)
    .map(([exported, local]) => [exported, local]);
}

/**
 * Reports whether any pattern matches a name.
 */
function matchesAny(patterns: readonly RegExp[], name: string): boolean {
  return patterns.some((pattern) => pattern.test(name));
}

/**
 * Writes the diagnostic for one import that renames a component.
 */
function aliased(file: string, specifier: string, exported: string, local: string): Diagnostic {
  return {
    code: "naming/aliased-import",
    file,
    message:
      `${exported} from ${specifier} is imported as ${local}. The compiler matches a ` +
      `component by its name, so the variants <${local}> selects compile to no rule. ` +
      `Import it under a name the recipe matches, such as ${exported}.`,
    severity: "warning",
  };
}

/**
 * Reports every import in one file that renames a component a recipe matches by name.
 */
function aliasedIn(file: string, text: string, matched: Matched): Diagnostic[] {
  const found: Diagnostic[] = [];

  for (const [, specifiers = "", specifier = ""] of text.matchAll(IMPORTED)) {
    const patterns = matched.get(specifier);

    if (patterns === undefined) continue;

    for (const [exported, local] of renamed(specifiers)) {
      if (matchesAny(patterns, exported) && !matchesAny(patterns, local)) {
        found.push(aliased(file, specifier, exported, local));
      }
    }
  }

  return found;
}

/**
 * Reports every import across the scanned sources that renames a component a recipe matches by
 * name.
 *
 * @remarks
 *   A source that names no contributor is passed over without being parsed, so the read costs what
 *   the files that import a contributor cost and nothing for the rest.
 * @param root - The application's directory, which a file is reported relative to.
 * @param sources - Every file the compiler scanned, absolute.
 * @param matched - The patterns each contributor's recipes state.
 */
export function aliasedImports(
  root: string,
  sources: readonly string[],
  matched: Matched,
): readonly Diagnostic[] {
  const names = [...matched.keys()];

  return sources.flatMap((file) => {
    const text = readFileSync(file, "utf8");

    return names.some((name) => text.includes(name))
      ? aliasedIn(relative(root, file), text, matched)
      : [];
  });
}
