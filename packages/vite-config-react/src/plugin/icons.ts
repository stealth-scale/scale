/**
 * Rewrites an import from the icon set's root into one import per icon file, so a document loads
 * the icons it draws and not the two thousand the root exports.
 *
 * @remarks
 *   A build tree-shakes the root down to the icons a page draws, but a dev server does not: in
 *   middleware mode the root is pre-bundled whole, five megabytes for every document that imports
 *   one icon, and in full bundle mode the vendor chunk carries every icon, because that mode does
 *   not shake. The set publishes one module per icon under `dist/esm/icons`, named in kebab case,
 *   and every alias the root exports has a file of its own, so the file an identifier stands for
 *   is a spelling rule rather than a table. The rewrite reads the import declarations off the
 *   bundler's own parse of the source, so a string or a comment that looks like an import is left
 *   as written, replaces each declaration's own range, keeps the line count, and leaves an
 *   identifier alone where no icon file answers to it, which is how the root's own helpers and its
 *   types stay on the root import.
 */

import { type Plugin } from "vite";

import { contribute, type Contribution } from "@stealthscale/vite-config";

/**
 * The package the icons are imported from.
 */
const ROOT = "lucide-react";

/**
 * Where the package keeps one module per icon.
 */
const ICONS = `${ROOT}/dist/esm/icons/`;

/**
 * The file kinds the rewrite reads, with the language each is parsed as.
 */
const SOURCE = /\.([jt]sx?)(?:$|\?)/u;

/**
 * The files the rewrite leaves alone.
 */
const UNTOUCHED = /\/node_modules\//u;

/**
 * Where the rewrite is contributed.
 */
const AT = "plugins";

/**
 * The languages the parser reads a source as.
 */
export type Language = "js" | "jsx" | "ts" | "tsx";

/**
 * The languages, as a set the file's extension is looked up in.
 */
const LANGUAGES: ReadonlySet<string> = new Set(["js", "jsx", "ts", "tsx"]);

/**
 * A node of the parsed source, with the range it covers.
 */
interface Node {
  /**
   * The offset the node ends at, exclusive.
   */
  readonly end: number;

  /**
   * The offset the node starts at.
   */
  readonly start: number;

  /**
   * The node's kind.
   */
  readonly type: string;
}

/**
 * The name the root exports, as an identifier or as a string literal.
 */
interface Imported {
  /**
   * The identifier, where the import names one.
   */
  readonly name?: string | undefined;

  /**
   * The string, where the import names the export as one.
   */
  readonly value?: unknown;
}

/**
 * The name the importing file binds.
 */
interface Local {
  /**
   * The identifier.
   */
  readonly name: string;
}

/**
 * The module a declaration imports from.
 */
interface Source {
  /**
   * The specifier, as written.
   */
  readonly value: unknown;
}

/**
 * One name an import binds, as the parser reads it.
 */
interface Specifier extends Node {
  /**
   * The name the root exports, for a named import.
   */
  readonly imported?: Imported | undefined;

  /**
   * Whether the name is imported for its type alone.
   */
  readonly importKind?: string | undefined;

  /**
   * The name the importing file binds.
   */
  readonly local: Local;
}

/**
 * An import declaration, as the parser reads it.
 */
interface Declaration extends Node {
  /**
   * Whether the whole declaration imports types alone.
   */
  readonly importKind?: string | undefined;

  /**
   * The module the declaration imports from.
   */
  readonly source: Source;

  /**
   * The names the declaration binds.
   */
  readonly specifiers: readonly Specifier[];
}

/**
 * A parsed source: the statements it holds.
 */
export interface Parsed {
  /**
   * The statements, in order.
   */
  readonly body: readonly Node[];
}

/**
 * Parses a source into the statements it holds, the way the bundler's own parser does.
 */
export type Parse = (code: string, language: Language) => Parsed;

/**
 * One name an import binds: what the root exports it as, and what the file binds it to.
 */
interface Bound {
  /**
   * The name the root exports.
   */
  readonly exported: string;

  /**
   * The name the importing file binds, which is the exported name unless the import renames it.
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
 * Spells the icon file an exported name stands for.
 *
 * @remarks
 *   The root exports every icon under three names, `Smartphone`, `SmartphoneIcon` and
 *   `LucideSmartphone`, and every one of them spells the same file once the affix is dropped. The
 *   file's name is the icon's, in parts joined by hyphens, and the exported name is those parts
 *   with the first letter of each raised. So a part starts at a capital that follows a small
 *   letter or a digit, or that is followed by a small letter, which is what tells `AArrowDown`
 *   apart from `Axis3D`. A part starts at a digit that follows a letter, unless the part it is in
 *   started with a digit, which is what keeps `2x2` together in `Grid2x2` while `Grid2X2` spells
 *   `grid-2-x-2`. The set publishes a file under every one of those spellings.
 * @param exported - The name the root exports.
 * @returns The file's name, without its extension.
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
 * Reports whether a capital starts a part: it follows a small letter or a digit, or a small
 * letter follows it, and it is not the first letter.
 */
function startsAtCapital(before: string, after: string): boolean {
  return before !== "" && (isSmall(before) || isDigit(before) || isSmall(after));
}

/**
 * Reports whether a statement is an import of named values from the root.
 *
 * @remarks
 *   A default or a namespace import of the root is left as written, and so is a declaration that
 *   imports types alone, which the bundler drops itself.
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
 * Reports whether a file's extension names a language the parser reads.
 */
function isLanguage(found: string): found is Language {
  return LANGUAGES.has(found);
}

/**
 * Reads the language a file is parsed as off its name.
 */
function languageOf(id: string): Language | undefined {
  const found = SOURCE.exec(id)?.[1] ?? "";

  return isLanguage(found) ? found : undefined;
}

/**
 * Spells the name the root exports, whether the import wrote it as an identifier or as a string.
 */
function exportedOf(one: Specifier): string {
  return one.imported?.name ?? String(one.imported?.value);
}

/**
 * Reads the names one declaration binds to values, leaving its type-only specifiers out.
 */
function bound(declaration: Declaration): readonly Bound[] {
  return declaration.specifiers
    .filter((one) => one.importKind !== "type")
    .map((one) => ({ exported: exportedOf(one), local: one.local.name }));
}

/**
 * Writes the statements that replace one import: an import per icon, and the root import for
 * whatever value stays on it, on one line, padded to the lines the original took. An import that
 * binds no icon is left as written.
 *
 * @remarks
 *   A type-only specifier is dropped rather than kept, because what is rewritten here is what the
 *   bundler runs and never what the type checker reads, and an import left with types alone is
 *   kept by the transform as an import of the root for its side effects, which loads the whole
 *   set again.
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
 * Spells one bound name the way the import wrote it.
 */
function spelled(one: Bound): string {
  return one.exported === one.local ? one.exported : `${one.exported} as ${one.local}`;
}

/**
 * Lists the import declarations of the root in one source.
 */
function declared(code: string, language: Language, parse: Parse): readonly Declaration[] {
  return parse(code, language).body.filter((node) => fromRoot(node));
}

/**
 * Rewrites every named import from the root in one file's source.
 *
 * @param code - The source.
 * @param answers - Says whether an exported name has an icon file of its own.
 * @param parse - The parser the declarations are read with.
 * @param language - The language the source is parsed as.
 * @returns The rewritten source, or null where the file imports nothing from the root.
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
 * Builds the plugin that rewrites the imports.
 *
 * @remarks
 *   Whether a name has a file is asked of the bundler's resolver once per name and remembered,
 *   so a file that imports three icons costs three resolutions the first time and none after. The
 *   source is parsed by the bundler's own parser, once per file that names the root, and the
 *   rewrite keeps every line where it was, so a location the bundler reports for the file still
 *   names the line the author wrote.
 */
function plugin(): Plugin {
  const answered = new Map<string, boolean>();

  return {
    enforce: "pre",
    name: "react.plugin.icons",

    /**
     * Rewrites the imports of a source file that imports from the root, having asked the
     * resolver about each name it has not met before.
     */
    async transform(code, id) {
      const language = languageOf(id);

      if (language === undefined || UNTOUCHED.test(id) || !code.includes(ROOT)) return null;

      /**
       * Parses through the bundler's own parser, told the file's language.
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
 * Imports each icon a file draws from the icon file that publishes it rather than from the root.
 *
 * @returns The contribution, under the name of the call that produced it.
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
