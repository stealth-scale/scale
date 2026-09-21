/**
 * Rewrites a named import from the icon set's root into one import per icon file.
 *
 * @remarks
 *   The root exports about two thousand icons. A production build tree-shakes it down to the ones
 *   a document renders. A dev server does not. In middleware mode Vite pre-bundles the root whole,
 *   five megabytes for a document that imports one icon, and in full bundle mode the whole set
 *   lands in the vendor chunk. The set publishes one module per icon under `dist/esm/icons`, named
 *   in kebab case, with a file for every alias the root exports, so the file name follows from the
 *   identifier and needs no lookup table. The rewrite reads declarations off the bundler's own
 *   parse, so a string or a comment that looks like an import is left alone, and it replaces each
 *   declaration in place to keep the line count. An identifier with no icon file keeps its root
 *   import, which is how the root's helpers and its type exports keep working.
 */

import { type Plugin } from "vite";

import { contribute, type Contribution } from "@stealthscale/vite-config";

/**
 * The package whose named exports this plugin redirects.
 */
const ROOT = "lucide-react";

/**
 * The directory in that package holding one module per icon.
 */
const ICONS = `${ROOT}/dist/esm/icons/`;

/**
 * Matches a source file's extension, capturing the language to parse it as.
 */
const SOURCE = /\.([jt]sx?)(?:$|\?)/u;

/**
 * Matches a path under node_modules. The transform skips those files.
 */
const UNTOUCHED = /\/node_modules\//u;

/**
 * The configuration key the plugin is contributed at.
 */
const AT = "plugins";

/**
 * The languages the parser accepts.
 */
export type Language = "js" | "jsx" | "ts" | "tsx";

/**
 * The same languages as a set, for testing an extension against.
 */
const LANGUAGES: ReadonlySet<string> = new Set(["js", "jsx", "ts", "tsx"]);

/**
 * A parsed node, with the source range it covers.
 */
interface Node {
  /**
   * Offset one past the node's last character.
   */
  readonly end: number;

  /**
   * Offset of the node's first character.
   */
  readonly start: number;

  /**
   * Kind of node, as the parser labels it.
   */
  readonly type: string;
}

/**
 * The export a specifier refers to, written as an identifier or as a string literal.
 */
interface Imported {
  /**
   * Identifier, where the import writes one.
   */
  readonly name?: string | undefined;

  /**
   * String literal, where the import quotes the export name instead.
   */
  readonly value?: unknown;
}

/**
 * A binding the importing file introduces.
 */
interface Local {
  /**
   * Identifier bound in the importing file.
   */
  readonly name: string;
}

/**
 * The module a declaration imports from.
 */
interface Source {
  /**
   * Specifier, as written in the source.
   */
  readonly value: unknown;
}

/**
 * One name an import binds, as the parser reads it.
 */
interface Specifier extends Node {
  /**
   * Export the name refers to, on a named import.
   */
  readonly imported?: Imported | undefined;

  /**
   * `"type"` where this specifier alone imports a type.
   */
  readonly importKind?: string | undefined;

  /**
   * Name the importing file binds it to.
   */
  readonly local: Local;
}

/**
 * An import declaration, as the parser reads it.
 */
interface Declaration extends Node {
  /**
   * `"type"` where the whole declaration imports types.
   */
  readonly importKind?: string | undefined;

  /**
   * Module imported from.
   */
  readonly source: Source;

  /**
   * Bindings the declaration introduces.
   */
  readonly specifiers: readonly Specifier[];
}

/**
 * The parse result, as the bundler's parser returns it.
 */
export interface Parsed {
  /**
   * Top-level statements, in source order.
   */
  readonly body: readonly Node[];
}

/**
 * Parses a source into its statements, the way the bundler's own parser does.
 */
export type Parse = (code: string, language: Language) => Parsed;

/**
 * One imported name: what the root exports it as, and what the file calls it.
 */
interface Bound {
  /**
   * Name the root exports.
   */
  readonly exported: string;

  /**
   * Name the importing file binds, equal to the exported name unless the import renames it.
   */
  readonly local: string;
}

/**
 * Reports whether a character is a capital letter.
 */
function isCapital(character: string): boolean {
  return /^[A-Z]$/u.test(character);
}

/**
 * Reports whether a character is a small letter.
 */
function isSmall(character: string): boolean {
  return /^[a-z]$/u.test(character);
}

/**
 * Reports whether a character is a digit.
 */
function isDigit(character: string): boolean {
  return /^[0-9]$/u.test(character);
}

/**
 * Returns the icon file an exported name resolves to.
 *
 * @remarks
 *   The set exports each icon under three names, `Smartphone`, `SmartphoneIcon` and
 *   `LucideSmartphone`. Stripping the affix leaves all three with the same parts, and the file
 *   name is those parts joined by hyphens. Two rules place the boundaries. A capital starts a part
 *   when a lowercase letter or a digit precedes it, or when a lowercase letter follows it, and
 *   that second test is what splits the leading pair of `AArrowDown`. A digit starts a part only
 *   when its part did not already begin with one, which resolves `Grid2x2` to `grid-2x2` and
 *   `Grid2X2` to `grid-2-x-2`.
 * @param exported - Name the root exports.
 * @returns The file name, without its extension.
 */
export function fileOf(exported: string): string {
  const bare = exported.replace(/^Lucide/u, "").replace(/Icon$/u, "");
  let file = "";
  let digital = false;

  for (let index = 0; index < bare.length; index += 1) {
    const character = bare.charAt(index);
    const before = bare.charAt(index - 1);
    const after = bare.charAt(index + 1);

    if (isCapital(character)) {
      file += startsAtCapital(before, after)
        ? `-${character.toLowerCase()}`
        : character.toLowerCase();
      digital = false;
    } else if (isDigit(character) && !digital && before !== "" && !isDigit(before)) {
      file += `-${character}`;
      digital = true;
    } else {
      file += character;
    }
  }

  return file;
}

/**
 * Reports whether a capital letter starts a part of the file name.
 *
 * @param before - Character to its left, empty at the start of the name.
 * @param after - Character to its right, empty at the end of the name.
 */
function startsAtCapital(before: string, after: string): boolean {
  return before !== "" && (isSmall(before) || isDigit(before) || isSmall(after));
}

/**
 * Reports whether a statement imports values from the root by name.
 *
 * @remarks
 *   A default or namespace import binds the whole set under one name, which per-icon files cannot
 *   stand in for. A type-only declaration never reaches the bundle, so there is nothing to save.
 */
function fromRoot(node: Node): node is Declaration {
  if (node.type !== "ImportDeclaration") return false;

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the parser types a statement by its kind alone, and the kind was checked on the line above
  const held = node as Declaration;

  return (
    held.source.value === ROOT &&
    held.importKind !== "type" &&
    held.specifiers.length > 0 &&
    held.specifiers.every((one) => one.type === "ImportSpecifier")
  );
}

/**
 * Reports whether an extension is one of the languages the parser reads.
 */
function isLanguage(found: string): found is Language {
  return LANGUAGES.has(found);
}

/**
 * Returns the language to parse a file as, taken from its extension, or undefined for a file the
 * transform does not read.
 */
function languageOf(id: string): Language | undefined {
  const found = SOURCE.exec(id)?.[1] ?? "";

  return isLanguage(found) ? found : undefined;
}

/**
 * Returns the export name a specifier refers to, whether the import wrote it as an identifier or
 * as a string literal.
 */
function exportedOf(one: Specifier): string {
  return one.imported?.name ?? String(one.imported?.value);
}

/**
 * Returns the value bindings of one declaration, dropping its type-only specifiers.
 *
 * @remarks
 *   Type-only specifiers are dropped because the output feeds the bundler, which erases types
 *   itself, and never the type checker.
 */
function bound(declaration: Declaration): readonly Bound[] {
  return declaration.specifiers
    .filter((one) => one.importKind !== "type")
    .map((one) => ({ exported: exportedOf(one), local: one.local.name }));
}

/**
 * Returns the statements that replace one import declaration, on a single line padded back to the
 * declaration's line count.
 *
 * @remarks
 *   The padding keeps every later line at the offset the author wrote it at, which the transform
 *   depends on because it reports no source map. A declaration that resolves no icon file is
 *   returned unchanged: stripping its specifiers would leave a side-effect import of the root,
 *   which loads the whole set again.
 */
function rewritten(
  original: string,
  values: readonly Bound[],
  answers: (exported: string) => boolean,
): string {
  const kept = values.filter((one) => !answers(one.exported)).map((one) => spelled(one));
  const statements = values
    .filter((one) => answers(one.exported))
    .map((one) => `import ${one.local} from "${ICONS}${fileOf(one.exported)}.mjs";`);

  if (statements.length === 0) return original;
  if (kept.length > 0) statements.push(`import { ${kept.join(", ")} } from "${ROOT}";`);

  return statements.join(" ") + "\n".repeat(original.split("\n").length - 1);
}

/**
 * Returns one binding spelled as an import specifier, with `as` where the import renamed it.
 */
function spelled(one: Bound): string {
  return one.exported === one.local ? one.exported : `${one.exported} as ${one.local}`;
}

/**
 * Returns every named import of the root in one source.
 */
function declared(code: string, language: Language, parse: Parse): readonly Declaration[] {
  return parse(code, language).body.filter((node) => fromRoot(node));
}

/**
 * Redirects every named root import in one file to the icon modules behind it.
 *
 * @param code - File's contents, as the bundler handed them over.
 * @param answers - Reports whether an exported name has an icon module of its own.
 * @param parse - Parser the declarations are read with.
 * @param language - Language the source is parsed as.
 * @returns The rewritten source, or null where nothing in it changed.
 */
export function iconized(
  code: string,
  answers: (exported: string) => boolean,
  parse: Parse,
  language: Language = "tsx",
): null | string {
  if (!code.includes(ROOT)) return null;

  let written = "";
  let from = 0;

  for (const declaration of declared(code, language, parse)) {
    const original = code.slice(declaration.start, declaration.end);

    written +=
      code.slice(from, declaration.start) + rewritten(original, bound(declaration), answers);
    from = declaration.end;
  }

  written += code.slice(from);

  return written === code ? null : written;
}

/**
 * Builds the plugin that performs the redirect.
 *
 * @remarks
 *   Each exported name is resolved once and the answer cached for the life of the plugin, so a
 *   name costs one resolution on the first file that imports it and none afterwards. A name the
 *   set publishes no module for resolves to null, and that answer is cached too.
 */
function plugin(): Plugin {
  const answered = new Map<string, boolean>();

  return {
    enforce: "pre",
    name: "react.plugin.icons",

    /**
     * Resolves the icon modules a source needs, then returns it with its root imports rewritten.
     */
    async transform(code, id) {
      const language = languageOf(id);

      if (language === undefined || UNTOUCHED.test(id) || !code.includes(ROOT)) return null;

      /**
       * Parses a source through the bundler's parser, at the language of the file being read.
       */
      const parse: Parse = (source, lang) => this.parse(source, { lang });
      const names = declared(code, language, parse).flatMap((one) => bound(one));
      const unmet = [...new Set(names.map((one) => one.exported))].filter(
        (exported) => !answered.has(exported),
      );

      await Promise.all(
        unmet.map(async (exported) => {
          const resolved = await this.resolve(`${ICONS}${fileOf(exported)}.mjs`, id);

          answered.set(exported, resolved !== null);
        }),
      );

      const written = iconized(
        code,
        (exported) => answered.get(exported) === true,
        parse,
        language,
      );

      return written === null ? null : { code: written, map: null };
    },
  };
}

/**
 * Contributes the redirect to the bundler's plugin list.
 *
 * @returns A contribution carrying the plugin and the reason it is configured.
 */
export function icons(): Contribution {
  return contribute({
    at: AT,
    because:
      "a dev server serves the icon set whole to every document that imports one icon, " +
      "and one import per icon file is what a build would have shaken it down to",
    item: plugin(),
    name: "react.plugin.icons",
  });
}
