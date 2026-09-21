/**
 * Reports what an assembly found wrong: a contributor installed twice, a theme compound no
 * published recipe declares, and an import that renames a component the compiler matches by name.
 */

import { aliasedImports, matchedNames } from "#aliases.ts";
import { type Contributor } from "#contributors.ts";
import { type Diagnostic } from "#pandacss.ts";
import { publishedCompounds, unmatchedCompounds } from "#scope.ts";
import { type Theme } from "#statement.ts";

/**
 * Carries the contributors an assembly keeps and what it reported about the rest.
 */
export interface Distinct {
  /**
   * One diagnostic per contributor a kept one shares a name with.
   */
  diagnostics: readonly Diagnostic[];

  /**
   * One contributor per name, the first installation the graph reached.
   */
  kept: readonly Contributor[];
}

/**
 * Keeps one contributor per name, and reports every further installation of a name.
 *
 * @remarks
 *   Two installed versions of one package are two contributors under one name, and the compiler
 *   would install two presets that state the same vocabulary. The first is kept, which is the one
 *   the application resolves from its own manifest, and the other is reported as an error, because
 *   a page drawn from one and a component compiled against the other is a page drawn wrong.
 */
export function distinct(found: readonly Contributor[]): Distinct {
  const kept: Contributor[] = [];
  const diagnostics: Diagnostic[] = [];

  for (const one of found) {
    const first = kept.find((each) => each.name === one.name);

    if (first === undefined) {
      kept.push(one);
    } else {
      diagnostics.push({
        code: "theme/duplicate-contributor",
        message:
          `${one.name} is installed twice, at ${first.at} and at ${one.at}, and both publish a ` +
          "preset. The first is compiled and the second is not. Install one version.",
        severity: "error",
      });
    }
  }

  return { diagnostics, kept };
}

/**
 * Carries what the findings are read from.
 */
export interface Examined {
  /**
   * Every contributor, the system package first.
   */
  found: readonly Contributor[];

  /**
   * Every contributor's preset, in the contributors' order.
   */
  loaded: readonly unknown[];

  /**
   * Every preset installed before the themes: the foundation, the other contributors' and the
   * application's own.
   */
  published: readonly unknown[];

  /**
   * The application's directory.
   */
  root: string;

  /**
   * Every file the compiler scanned, absolute.
   */
  sources: readonly string[];

  /**
   * The themes the application states.
   */
  themes: readonly Theme[];
}

/**
 * Reports every theme compound no published recipe declares a compound for.
 */
function unmatched(themes: readonly Theme[], published: readonly unknown[]): Diagnostic[] {
  return unmatchedCompounds(themes, publishedCompounds(published)).map((line) => ({
    code: "theme/unmatched-compound",
    message:
      `${line} is a compound no published recipe declares for that selection, so the runtime ` +
      "writes no class the rule applies to. Declare the compound in the recipe, or name its class.",
    severity: "warning",
  }));
}

/**
 * Reports what an assembly found wrong with the themes and the sources: a compound no published
 * recipe declares, and an import that renames a component.
 */
export function findings(examined: Examined): readonly Diagnostic[] {
  const matched = matchedNames(
    examined.found.map((each) => each.name),
    examined.loaded,
  );

  return [
    ...unmatched(examined.themes, examined.published),
    ...aliasedImports(examined.root, examined.sources, matched),
  ];
}
