/**
 * Reports the faults an assembly found: a contributor installed twice, a theme compound no
 * published recipe declares, and an import that renames a component the compiler matches by name.
 */

import { aliasedImports, matchedNames } from "#aliases.ts";
import { type Contributor } from "#contributors.ts";
import { type Diagnostic } from "#pandacss.ts";
import { publishedCompounds, unmatchedCompounds } from "#scope.ts";
import { type Theme } from "#statement.ts";

/**
 * The contributors an assembly keeps, with the diagnostics raised for the rest.
 */
export interface Distinct {
  /**
   * One diagnostic per contributor that duplicates a kept one's name.
   */
  diagnostics: readonly Diagnostic[];

  /**
   * One contributor per name, the first installation the graph reached.
   */
  kept: readonly Contributor[];
}

/**
 * Keeps one contributor per name and reports every further installation of that name.
 *
 * @remarks
 *   Two installed versions of one package are two contributors under one name, and the compiler
 *   would install two presets declaring the same vocabulary. The first is kept, being the one the
 *   application resolves from its own manifest. The second is an error, because a component
 *   compiled against one version and styled by the other gets no rules at all.
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
 * The inputs the findings are read from.
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
   * Every file the compiler scanned, as absolute paths.
   */
  sources: readonly string[];

  /**
   * The themes the application states.
   */
  themes: readonly Theme[];
}

/**
 * Reports every theme compound that no published recipe declares.
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
 * Reports the faults in an assembly's themes and sources: a compound no published recipe declares,
 * and an import that renames a component.
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
