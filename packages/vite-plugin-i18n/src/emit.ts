/**
 * Generates the module an application imports its catalogues from, and one module per pair.
 */

import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";

import { type Catalogue } from "#find.ts";

/**
 * The specifier an application imports to reach its catalogues.
 */
export const ID = "virtual:i18n";

/**
 * Builds the specifier one language's namespace is fetched under.
 *
 * @remarks
 *   Neither a language tag nor a namespace contains a slash, so `pairOfId` splits the result back
 *   without ambiguity.
 * @param language - The BCP 47 tag.
 * @param namespace - The namespace name.
 * @returns A specifier such as `virtual:i18n/nl/menu`.
 */
export function pairId(language: string, namespace: string): string {
  return `${ID}/${language}/${namespace}`;
}

/**
 * One language and one namespace, which together address a single module.
 */
export type Pair = Pick<Catalogue, "language" | "namespace">;

/**
 * Splits a pair module's specifier back into its language and namespace.
 *
 * @param id - A specifier, with or without the resolution prefix.
 * @returns The pair, or undefined when the specifier addresses something else.
 */
export function pairOfId(id: string): Pair | undefined {
  const [head, language, namespace, ...rest] = id.replace(/^\0/u, "").split("/");

  return head === ID && language !== undefined && namespace !== undefined && rest.length === 0
    ? { language, namespace }
    : undefined;
}

/**
 * The contents of one catalogue: keys mapped to strings, nested to any depth.
 */
export interface Words {
  readonly [key: string]: string | Words;
}

/**
 * Catalogue files indexed by language, then by namespace, each list in merge order.
 */
export type CatalogueIndex = ReadonlyMap<string, ReadonlyMap<string, readonly Catalogue[]>>;

/**
 * Indexes catalogues by language and namespace, preserving the order they were found in.
 *
 * @param catalogues - Every catalogue found.
 */
export function indexed(catalogues: readonly Catalogue[]): CatalogueIndex {
  const byLanguage = new Map<string, Map<string, Catalogue[]>>();

  for (const catalogue of catalogues) {
    const byNamespace = byLanguage.get(catalogue.language) ?? new Map<string, Catalogue[]>();
    const files = byNamespace.get(catalogue.namespace) ?? [];

    files.push(catalogue);
    byNamespace.set(catalogue.namespace, files);
    byLanguage.set(catalogue.language, byNamespace);
  }

  return byLanguage;
}

/**
 * Returns one language's catalogues indexed by namespace.
 *
 * @param index - The indexed catalogues.
 * @param language - The BCP 47 tag.
 * @returns The files per namespace, or an empty map when the language has no catalogue.
 */
export function ofLanguage(
  index: CatalogueIndex,
  language: string,
): ReadonlyMap<string, readonly Catalogue[]> {
  return index.get(language) ?? new Map();
}

/**
 * Returns every file that belongs to one pair.
 *
 * @param index - The indexed catalogues.
 * @param language - The BCP 47 tag.
 * @param namespace - The namespace name.
 * @returns The files in merge order, or an empty array when no file belongs to the pair.
 */
export function filesOf(
  index: CatalogueIndex,
  language: string,
  namespace: string,
): readonly Catalogue[] {
  return ofLanguage(index, language).get(namespace) ?? [];
}

/**
 * Returns true when a parsed value is an object whose every leaf is a string.
 *
 * @param value - The parsed file contents.
 */
function isWords(value: unknown): value is Words {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((leaf) => typeof leaf === "string" || isWords(leaf))
  );
}

/**
 * Parses one catalogue file, as JSON or as YAML according to its extension.
 *
 * @param catalogue - The file to read.
 * @returns Its contents, nested as written.
 * @throws {@link Error} When the file does not parse to an object of strings.
 */
export function wordsOf(catalogue: Catalogue): Words {
  const text = readFileSync(catalogue.file, "utf8");
  const parsed: unknown = catalogue.file.endsWith(".json") ? JSON.parse(text) : parseYaml(text);

  if (!isWords(parsed)) {
    throw new Error(`${catalogue.file} does not parse to an object of strings.`);
  }

  return parsed;
}

/**
 * Parses one catalogue file and nests its contents under the file's prefix.
 *
 * @remarks
 *   A `title` key in `menu/sections/billing.json` comes back as `sections.billing.title`.
 * @param catalogue - The file to read.
 */
export function nested(catalogue: Catalogue): Words {
  return catalogue.prefix
    .split(".")
    .filter((segment) => segment !== "")
    .reduceRight<Words>((inner, segment) => ({ [segment]: inner }), wordsOf(catalogue));
}

/**
 * Merges two sets of contents key by key, so the later one overwrites only the keys it declares.
 *
 * @param under - The contents merged so far.
 * @param over - The contents to apply on top.
 */
export function merged(under: Words, over: Words): Words {
  const result: Record<string, string | Words> = { ...under };

  for (const [key, value] of Object.entries(over)) {
    const existing = result[key];

    result[key] =
      typeof value === "object" && typeof existing === "object" ? merged(existing, value) : value;
  }

  return result;
}

/**
 * Parses and merges every file of one pair, each nested under its own prefix.
 *
 * @param files - The files in merge order, the last one winning each key.
 */
export function mergedWords(files: readonly Catalogue[]): Words {
  return files.reduce<Words>((words, file) => merged(words, nested(file)), {});
}

/**
 * Generates the module one pair is fetched as, holding every file of the pair merged.
 *
 * @param files - The files in merge order.
 */
export function pairModule(files: readonly Catalogue[]): string {
  return `export default ${JSON.stringify(mergedWords(files))};\n`;
}

/**
 * Generates the loader table: one dynamic import per pair of a language the module does not
 * inline, so a namespace costs one request and an inlined one costs none.
 *
 * @remarks
 *   Every entry ends in its own comma, so a table with no language and a language with no
 *   namespace both close as an object rather than as a bare comma. An inlined language gets no
 *   loader. The runtime reads its words from the bundle and never asks for them, and a loader it
 *   never calls still made the bundler write every pair of the language as a chunk beside the same
 *   words inlined: the docs build wrote the catalogue's whole `specimen` namespace twice.
 * @param index - The indexed catalogues.
 * @param inlining - The languages the module inlines.
 * @returns The table as JavaScript source.
 */
function loaders(index: CatalogueIndex, inlining: ReadonlySet<string>): string {
  const languages = [...index.entries()]
    .filter(([language]) => !inlining.has(language))
    .map(([language, byNamespace]) => {
      const imports = [...byNamespace.keys()].map(
        (namespace) =>
          `    ${JSON.stringify(namespace)}: () => import(${JSON.stringify(pairId(language, namespace))}),`,
      );

      return `  ${JSON.stringify(language)}: {\n${imports.join("\n")}\n  },`;
    });

  return languages.length === 0 ? "{}" : `{\n${languages.join("\n")}\n}`;
}

/**
 * Merges each namespace of one language, for inlining into the module.
 *
 * @param index - The indexed catalogues.
 * @param language - The BCP 47 tag.
 */
function inlined(index: CatalogueIndex, language: string): Readonly<Record<string, Words>> {
  return Object.fromEntries(
    [...ofLanguage(index, language).entries()].map(([namespace, files]) => [
      namespace,
      mergedWords(files),
    ]),
  );
}

/**
 * Lists every namespace any language declares, sorted.
 *
 * @param index - The indexed catalogues.
 */
function namespacesIn(index: CatalogueIndex): readonly string[] {
  const names = new Set<string>();

  for (const byNamespace of index.values()) {
    for (const namespace of byNamespace.keys()) names.add(namespace);
  }

  return [...names].toSorted();
}

/**
 * Generates the module an application imports its catalogues from.
 *
 * @remarks
 *   The fallback language is inlined so the first paint needs no request. Every other language is
 *   reached through the loader. Under `eager` every language is inlined instead and the loader
 *   fetches nothing, which costs one larger bundle and saves a request per language.
 * @param index - The indexed catalogues.
 * @param fallback - The language that defines every key.
 * @param eager - Inlines every language when true.
 * @returns The module as JavaScript source.
 */
export function cataloguesModule(index: CatalogueIndex, fallback: string, eager = false): string {
  const languages = [...index.keys()].toSorted();
  const inlining = eager ? languages : [fallback];
  const bundled = Object.fromEntries(
    inlining.map((language) => [language, inlined(index, language)]),
  );

  return [
    `export const fallback = ${JSON.stringify(fallback)};`,
    `export const languages = ${JSON.stringify(languages)};`,
    `export const namespaces = ${JSON.stringify(namespacesIn(index))};`,
    `export const bundled = ${JSON.stringify(bundled)};`,
    `export const defaults = bundled[fallback] ?? {};`,
    `const loaders = ${loaders(index, new Set(inlining))};`,
    "",
    "export async function load(language, namespace) {",
    "  const loader = loaders[language]?.[namespace];",
    "  if (loader === undefined) return undefined;",
    "  return (await loader()).default;",
    "}",
    "",
    "export const catalogues = { bundled, defaults, fallback, languages, load, namespaces };",
    "",
  ].join("\n");
}
