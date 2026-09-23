/**
 * Rewrites example files into consumer-facing source and exports it from the example module.
 *
 * @remarks
 *   An example file is the code a consumer writes, except that it imports the package through `#`
 *   subpath imports, which resolve only inside the package. The rewrite merges those into one
 *   named import from the package name. It relies on the package barrel exporting each compound as
 *   a namespace under the name its directory barrel is imported as, so
 *   `import * as Tag from "#tag/index.ts"` becomes `import { Tag }`.
 */

import { readFileSync } from "node:fs";
import { type ESTree, parseSync } from "vite";

import { ownerOf } from "#emit.ts";

/**
 * Matches example file paths.
 */
export const EXAMPLE = /\.example\.tsx$/u;

/**
 * Specifier of an import declaration.
 */
type Specifier = ESTree.ImportDeclaration["specifiers"][number];

/**
 * Returns true for an import declaration with a `#` specifier.
 */
function isOwn(node: ESTree.Program["body"][number]): node is ESTree.ImportDeclaration {
  return node.type === "ImportDeclaration" && node.source.value.startsWith("#");
}

/**
 * Returns the specifier as written inside the braces of a named import.
 *
 * @param specifier - Specifier of a `#` import declaration.
 * @param path - Example file path, for the error message.
 * @throws {@link Error} When the specifier is a default import, which a package barrel cannot
 *   provide.
 */
function named(specifier: Specifier, path: string): string {
  if (specifier.type === "ImportNamespaceSpecifier") return specifier.local.name;
  if (specifier.type === "ImportDefaultSpecifier") {
    throw new Error(`specimen: ${path} imports a default export through a # specifier`);
  }

  const imported =
    specifier.imported.type === "Identifier" ? specifier.imported.name : specifier.imported.value;

  return imported === specifier.local.name ? imported : `${imported} as ${specifier.local.name}`;
}

/**
 * Merges every `#` import of an example into one named import from the package.
 *
 * @remarks
 *   The merged import replaces the first `#` import, and the others are removed. Removal runs from
 *   the end of the text backwards, so it never shifts the parser offsets of an earlier import.
 * @param text - Example source.
 * @param path - File path. The parser infers TSX from the extension.
 * @param owner - Package name.
 * @returns The rewritten source, or the input unchanged when it has no `#` import or `owner` is
 *   empty.
 */
export function exampled(text: string, path: string, owner: string): string {
  const own = parseSync(path, text).program.body.filter((node) => isOwn(node));
  const [first] = own;

  if (first === undefined || owner === "") return text;

  const names = [
    ...new Set(own.flatMap((node) => node.specifiers.map((each) => named(each, path)))),
  ];
  const merged = `import { ${names.toSorted().join(", ")} } from "${owner}";`;
  const trimmed = own
    .slice(1)
    .toReversed()
    .reduce(
      (written, node) => written.slice(0, node.start) + written.slice(node.end).replace(/^\n/u, ""),
      text,
    );

  return trimmed.slice(0, first.start) + merged + trimmed.slice(first.end);
}

/**
 * Appends source text to module code as a string export named `source`.
 *
 * @remarks
 *   The extra export disqualifies the module as a React Refresh boundary, since a boundary may
 *   export only components. An edit to the example therefore propagates to the importing specimen,
 *   which self-accepts and hands the new module, with the new source, to the catalogue.
 * @param code - Transformed module code.
 * @param shown - Source text to export.
 * @returns The code with the export appended.
 */
export function appended(code: string, shown: string): string {
  return `${code}\nexport const source = ${JSON.stringify(shown)};\n`;
}

/**
 * Appends the rewritten source of an example file to its transformed module.
 *
 * @remarks
 *   The function reads the source from disk, because an earlier plugin may already have compiled
 *   `code`.
 * @param code - Transformed module code.
 * @param id - Absolute module path without a query.
 * @returns The code with the `source` export, or undefined when `id` is not an example file.
 */
export function exampleModule(code: string, id: string): string | undefined {
  if (!EXAMPLE.test(id)) return undefined;

  return appended(code, exampled(readFileSync(id, "utf8"), id, ownerOf(id)));
}
