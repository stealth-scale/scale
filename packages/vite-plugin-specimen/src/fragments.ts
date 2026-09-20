/**
 * Slices a specimen's source into one self-contained snippet per scene, and lists the components
 * the specimen imports from its own package.
 *
 * @remarks
 *   A snippet holds the scene's own declaration, every top-level declaration it references, and the
 *   import specifiers those use, in source order. It compiles on its own, so a reader can copy it
 *   into a file of their own.
 */

import { type ESTree, parseSync } from "vite";

import { type Source } from "#contract.ts";
import { declaredIn, stated } from "#read.ts";
import { closing, importing, objectOf, referred, type Scoped, scoped } from "#scope.ts";

/**
 * Writes the snippet for one scene.
 *
 * @remarks
 *   `owner` is the name the scene is declared under, and is undefined when the scene is written
 *   inline in the `scenes` array. An inline scene is appended to the snippet, because no
 *   declaration carries it.
 */
function snippetOf(
  scope: Scoped,
  scene: ESTree.ObjectExpression,
  owner: string | undefined,
): string {
  const names = referred(scene);

  if (owner !== undefined) names.add(owner);

  const declarations = [...closing(scope, names)]
    .toSorted((left, right) => left.start - right.start)
    .map((statement) => scope.text.slice(statement.start, statement.end));
  const imports = scope.imports.flatMap((imported) => importing(scope, imported, names) ?? []);
  const inline = owner === undefined ? [scope.text.slice(scene.start, scene.end)] : [];

  return [imports.join("\n"), ...declarations, ...inline]
    .filter((section) => section !== "")
    .join("\n\n");
}

/**
 * Returns the array elements the page's `scenes` property lists.
 *
 * @returns The elements, and an empty array when the property is absent or is not an array.
 */
function scenesOf(page: ESTree.ObjectExpression): ESTree.ArrayExpression["elements"] {
  const property = page.properties.find(
    (candidate) =>
      candidate.type === "Property" &&
      !candidate.computed &&
      candidate.key.type === "Identifier" &&
      candidate.key.name === "scenes",
  );

  return property?.type === "Property" && property.value.type === "ArrayExpression"
    ? property.value.elements
    : [];
}

/**
 * Resolves one element of the `scenes` array to the scene's object literal and the name it is
 * declared under.
 *
 * @returns The object and the name, either of which may be undefined.
 */
function listedAs(
  scope: Scoped,
  element: ESTree.ArrayExpression["elements"][number],
): [scene: ESTree.ObjectExpression | undefined, owner: string | undefined] {
  if (element?.type === "Identifier") return [objectOf(scope, element.name), element.name];
  if (element?.type === "ObjectExpression") return [element, undefined];

  return [undefined, undefined];
}

/**
 * Parses a specimen and indexes it by what it declares and imports.
 *
 * @returns The scope, or undefined for a file that does not parse.
 */
function scopeOf(file: Source): Scoped | undefined {
  const parsed = parseSync(file.path, file.text);

  return parsed.errors.length > 0 ? undefined : scoped(parsed.program, file.text);
}

/**
 * Slices a parsed specimen into one snippet per scene, keyed by the scene's title.
 *
 * @remarks
 *   A scene is an element of the `scenes` array in the object the default export is called with:
 *   either a name the file declares or an object written inline. A scene whose title is not a
 *   string literal is skipped, because there is no key for it.
 * @returns Each scene's snippet, and an empty record for a file that declares no page.
 */
function snippetsOf(scope: Scoped): Record<string, string> {
  const page = declaredIn(scope.program);

  if (typeof page === "string") return {};

  const snippets: Record<string, string> = {};

  for (const element of scenesOf(page)) {
    const [scene, owner] = listedAs(scope, element);
    const title = scene === undefined ? undefined : stated(scene)["title"];

    if (scene !== undefined && title !== undefined)
      snippets[title] = snippetOf(scope, scene, owner);
  }

  return snippets;
}

/**
 * Returns true when a specifier binds a value rather than a type.
 */
function bindsValue(specifier: ESTree.ImportDeclarationSpecifier): boolean {
  return specifier.type !== "ImportSpecifier" || specifier.importKind !== "type";
}

/**
 * Lists the components a parsed specimen imports from its own package.
 *
 * @remarks
 *   A specifier under the package's imports map starts with `#`, which Node requires of every
 *   entry in that map, so the prefix alone tells an own import from a dependency's. A binding
 *   that starts with a capital letter is a component or a namespace of parts. A recipe, a
 *   constant or a type imported beside them is left out.
 * @returns The names, sorted.
 */
function importedBy(scope: Scoped): string[] {
  return scope.imports
    .filter(
      (own) =>
        own.declaration.importKind !== "type" && own.declaration.source.value.startsWith("#"),
    )
    .flatMap((own) => [...own.specifiers.values()].filter((specifier) => bindsValue(specifier)))
    .map((specifier) => specifier.local.name)
    .filter((name) => /^[A-Z]/u.test(name))
    .toSorted((one, other) => one.localeCompare(other));
}

/**
 * Describes what one page's fragments module carries: each scene's source, and the components
 * the page imports from its own package.
 */
export interface Sliced {
  /**
   * Each scene's snippet, keyed by the scene's title.
   */
  readonly fragments: Record<string, string>;

  /**
   * The components the page imports from its own package, sorted.
   */
  readonly imported: string[];
}

/**
 * Slices a specimen into one snippet per scene and lists the components it imports, from one
 * parse.
 *
 * @returns The snippets and the names, both empty for a file that does not parse.
 */
export function sliced(file: Source): Sliced {
  const scope = scopeOf(file);

  if (scope === undefined) return { fragments: {}, imported: [] };

  return { fragments: snippetsOf(scope), imported: importedBy(scope) };
}
